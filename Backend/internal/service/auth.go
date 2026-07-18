package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/auth"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/config"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/mailer"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/validator"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUnauthorized         = errors.New("unauthorized")
	ErrForbidden            = errors.New("forbidden")
	ErrVerificationRequired = errors.New("verification required")
)

// LockedError signals that an account or verification flow is temporarily
// locked after too many failed attempts.
type LockedError struct {
	Until time.Time
}

func (e LockedError) Error() string {
	return "too many attempts"
}

func (e LockedError) RetryAfter() time.Duration {
	remaining := time.Until(e.Until)
	if remaining < 0 {
		return 0
	}
	return remaining
}

// Throttle policies. Windows and lock durations are deliberately conservative:
// a six-digit code has one million combinations, so five tries per window makes
// brute force impractical while staying forgiving for real users.
const (
	loginMaxAttempts = 5
	loginWindow      = 15 * time.Minute
	loginLockFor     = 15 * time.Minute

	codeMaxAttempts = 5
	codeWindow      = 15 * time.Minute
	codeLockFor     = 30 * time.Minute

	sendMaxPerWindow = 3
	sendWindow       = time.Hour
	sendLockFor      = time.Hour
)

type AuthService struct {
	cfg  config.Config
	repo repository.AuthRepository
	jwt  auth.Manager
	mail mailer.Mailer
}

func NewAuthService(cfg config.Config, repo repository.AuthRepository, mail mailer.Mailer) AuthService {
	return AuthService{
		cfg:  cfg,
		repo: repo,
		jwt:  auth.NewManager(cfg.JWTSecret, cfg.AccessTokenTTL),
		mail: mail,
	}
}

// Login verifies the password (step 1). Depending on policy and device trust
// it either issues tokens directly or opens an email-code challenge (step 2).
func (s AuthService) Login(ctx context.Context, input model.LoginInput, meta model.AuthMeta) (model.LoginResult, error) {
	v := validator.New()
	if !validator.Email(input.Email) {
		v = v.Add("email", "A valid email is required.")
	}
	if !validator.Required(input.Password) {
		v = v.Add("password", "Password is required.")
	}
	if v.HasErrors() {
		return model.LoginResult{}, v
	}

	email := strings.ToLower(strings.TrimSpace(input.Email))
	throttleKey := "login:" + email
	if locked, err := s.lockedError(ctx, throttleKey); err != nil {
		return model.LoginResult{}, err
	} else if locked != nil {
		return model.LoginResult{}, *locked
	}

	user, err := s.repo.UserByEmail(ctx, email)
	if err != nil {
		return model.LoginResult{}, s.loginFailure(ctx, throttleKey, nil, meta)
	}
	if !user.IsActive {
		return model.LoginResult{}, ErrVerificationRequired
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)) != nil {
		return model.LoginResult{}, s.loginFailure(ctx, throttleKey, &user.ID, meta)
	}
	_ = s.repo.ClearAuthThrottle(ctx, throttleKey)

	cfg := s.securityConfig(ctx)
	if !cfg.TwoFactorEnabled {
		s.audit(ctx, &user.ID, "auth.login_success", meta)
		tokens, err := s.issueTokens(ctx, user)
		if err != nil {
			return model.LoginResult{}, err
		}
		return model.LoginResult{Status: "ok", Tokens: &tokens}, nil
	}

	// Trusted device: a valid, fingerprint-matching token skips the OTP step.
	if input.TrustedToken != "" {
		device, err := s.repo.TrustedDeviceByToken(ctx, input.TrustedToken)
		if err == nil && device.UserID == user.ID && fingerprintMatches(device.FingerprintHash, input.Fingerprint) {
			_ = s.repo.TouchTrustedDevice(ctx, device.ID, meta.IP)
			s.audit(ctx, &user.ID, "auth.login_trusted_device", meta)
			s.audit(ctx, &user.ID, "auth.login_success", meta)
			tokens, err := s.issueTokens(ctx, user)
			if err != nil {
				return model.LoginResult{}, err
			}
			return model.LoginResult{Status: "ok", Tokens: &tokens}, nil
		}
	}

	return s.startChallenge(ctx, user, cfg, meta)
}

// startChallenge creates the OTP challenge and emails the code (step 2).
func (s AuthService) startChallenge(ctx context.Context, user model.User, cfg model.SecurityConfig, meta model.AuthMeta) (model.LoginResult, error) {
	code, err := randomCodeN(cfg.OTPLength)
	if err != nil {
		return model.LoginResult{}, err
	}
	expiresAt := time.Now().UTC().Add(time.Duration(cfg.OTPExpiryMinutes) * time.Minute)
	challengeID, err := s.repo.CreateLoginChallenge(ctx, user.ID, codeHash(code), expiresAt, meta.IP, meta.UserAgent)
	if err != nil {
		return model.LoginResult{}, err
	}
	if err := s.sendOTPEmail(ctx, user, cfg, code); err != nil {
		return model.LoginResult{}, err
	}
	s.audit(ctx, &user.ID, "auth.otp_sent", meta)
	return model.LoginResult{
		Status:            "otp_required",
		ChallengeID:       challengeID,
		MaskedEmail:       maskEmail(user.Email),
		CodeLength:        cfg.OTPLength,
		ExpiresAt:         &expiresAt,
		ResendCooldownSec: cfg.ResendCooldownSec,
		TrustDays:         cfg.TrustDays,
	}, nil
}

// VerifyOTP checks the emailed code (step 3) and issues the session (step 4),
// optionally minting a trusted-device token.
func (s AuthService) VerifyOTP(ctx context.Context, input model.VerifyOTPInput, meta model.AuthMeta) (model.VerifyOTPResult, error) {
	input.Code = strings.TrimSpace(input.Code)
	if input.ChallengeID == "" || input.Code == "" {
		return model.VerifyOTPResult{}, ErrUnauthorized
	}
	cfg := s.securityConfig(ctx)

	challenge, err := s.repo.LoginChallenge(ctx, input.ChallengeID)
	if err != nil || challenge.ConsumedAt != nil || time.Now().After(challenge.ExpiresAt) {
		return model.VerifyOTPResult{}, ErrUnauthorized
	}

	// Count the attempt before comparing so a flood of guesses locks the
	// challenge no matter how the comparison goes.
	attempts, err := s.repo.BumpChallengeAttempts(ctx, challenge.ID)
	if err != nil {
		return model.VerifyOTPResult{}, ErrUnauthorized
	}
	if attempts > cfg.MaxOTPAttempts {
		s.audit(ctx, &challenge.UserID, "auth.otp_locked", meta)
		return model.VerifyOTPResult{}, LockedError{Until: challenge.ExpiresAt}
	}
	if codeHash(input.Code) != challenge.CodeHash {
		s.audit(ctx, &challenge.UserID, "auth.otp_failed", meta)
		return model.VerifyOTPResult{}, ErrUnauthorized
	}
	if err := s.repo.ConsumeLoginChallenge(ctx, challenge.ID); err != nil {
		return model.VerifyOTPResult{}, ErrUnauthorized
	}

	user, err := s.repo.UserByID(ctx, challenge.UserID)
	if err != nil || !user.IsActive {
		return model.VerifyOTPResult{}, ErrUnauthorized
	}
	s.audit(ctx, &user.ID, "auth.otp_verified", meta)
	s.audit(ctx, &user.ID, "auth.login_success", meta)

	tokens, err := s.issueTokens(ctx, user)
	if err != nil {
		return model.VerifyOTPResult{}, err
	}
	result := model.VerifyOTPResult{Tokens: tokens}

	if input.TrustDevice {
		token, err := randomToken()
		if err == nil {
			expiresAt := time.Now().UTC().Add(time.Duration(cfg.TrustDays) * 24 * time.Hour)
			device := model.TrustedDevice{
				UserID:          user.ID,
				TokenHash:       codeHash(token),
				FingerprintHash: fingerprintHash(input.Fingerprint),
				Label:           deviceLabel(meta.UserAgent),
				IP:              meta.IP,
				ExpiresAt:       expiresAt,
			}
			if _, err := s.repo.CreateTrustedDevice(ctx, device); err == nil {
				result.TrustToken = token
				result.TrustExpiresAt = &expiresAt
				s.audit(ctx, &user.ID, "auth.device_trusted", meta)
			}
		}
	}

	// This login came from a device that had to pass the OTP step — by
	// definition a device we had not seen. Notify asynchronously so a slow
	// SMTP server never delays the sign-in.
	s.notifyNewDevice(user, cfg, meta)
	return result, nil
}

// ResendOTP re-sends a fresh code for a pending challenge, with a cooldown
// and a hard cap on resends.
func (s AuthService) ResendOTP(ctx context.Context, challengeID string, meta model.AuthMeta) (model.LoginResult, error) {
	cfg := s.securityConfig(ctx)
	challenge, err := s.repo.LoginChallenge(ctx, challengeID)
	if err != nil || challenge.ConsumedAt != nil {
		return model.LoginResult{}, ErrUnauthorized
	}
	if challenge.ResendCount >= cfg.MaxResends {
		return model.LoginResult{}, LockedError{Until: challenge.ExpiresAt}
	}
	cooldownEnds := challenge.LastSentAt.Add(time.Duration(cfg.ResendCooldownSec) * time.Second)
	if time.Now().Before(cooldownEnds) {
		return model.LoginResult{}, LockedError{Until: cooldownEnds}
	}

	user, err := s.repo.UserByID(ctx, challenge.UserID)
	if err != nil || !user.IsActive {
		return model.LoginResult{}, ErrUnauthorized
	}
	code, err := randomCodeN(cfg.OTPLength)
	if err != nil {
		return model.LoginResult{}, err
	}
	expiresAt := time.Now().UTC().Add(time.Duration(cfg.OTPExpiryMinutes) * time.Minute)
	if err := s.repo.RefreshLoginChallenge(ctx, challenge.ID, codeHash(code), expiresAt); err != nil {
		return model.LoginResult{}, ErrUnauthorized
	}
	if err := s.sendOTPEmail(ctx, user, cfg, code); err != nil {
		return model.LoginResult{}, err
	}
	s.audit(ctx, &user.ID, "auth.otp_resent", meta)
	return model.LoginResult{
		Status:            "otp_required",
		ChallengeID:       challenge.ID,
		MaskedEmail:       maskEmail(user.Email),
		CodeLength:        cfg.OTPLength,
		ExpiresAt:         &expiresAt,
		ResendCooldownSec: cfg.ResendCooldownSec,
		TrustDays:         cfg.TrustDays,
	}, nil
}

func (s AuthService) sendOTPEmail(ctx context.Context, user model.User, cfg model.SecurityConfig, code string) error {
	subject, body := cfg.OTPEmail(map[string]string{
		"name":    user.Name,
		"code":    code,
		"minutes": fmt.Sprintf("%d", cfg.OTPExpiryMinutes),
		"site":    "MDM CMS",
	})
	return s.mail.SendRaw(ctx, user.Email, subject, body)
}

func (s AuthService) notifyNewDevice(user model.User, cfg model.SecurityConfig, meta model.AuthMeta) {
	subject, body := cfg.NewDeviceEmail(map[string]string{
		"name":   user.Name,
		"device": deviceLabel(meta.UserAgent),
		"ip":     meta.IP,
		"time":   time.Now().UTC().Format("2 Jan 2006 15:04"),
		"site":   "MDM CMS",
	})
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		_ = s.mail.SendRaw(ctx, user.Email, subject, body)
	}()
}

// --- trusted device management ---

func (s AuthService) TrustedDevices(ctx context.Context, userID string) ([]model.TrustedDevice, error) {
	return s.repo.ListTrustedDevices(ctx, userID)
}

func (s AuthService) RevokeTrustedDevice(ctx context.Context, userID, deviceID string, meta model.AuthMeta) error {
	if err := s.repo.RevokeTrustedDevice(ctx, userID, deviceID); err != nil {
		return err
	}
	s.audit(ctx, &userID, "auth.trusted_device_revoked", meta)
	return nil
}

func (s AuthService) RevokeAllTrustedDevices(ctx context.Context, userID string, meta model.AuthMeta) error {
	if err := s.repo.RevokeAllTrustedDevices(ctx, userID); err != nil {
		return err
	}
	s.audit(ctx, &userID, "auth.trusted_device_revoked", meta)
	return nil
}

func (s AuthService) LoginHistory(ctx context.Context, userID string) ([]model.LoginHistoryEntry, error) {
	return s.repo.LoginHistory(ctx, userID, 25)
}

// securityConfig loads the admin-tunable policy; failure falls back to safe
// defaults so authentication never breaks on a bad settings row.
func (s AuthService) securityConfig(ctx context.Context) model.SecurityConfig {
	raw, err := s.repo.SecurityConfigValue(ctx)
	if err != nil {
		return model.DefaultSecurityConfig()
	}
	return model.ParseSecurityConfig(raw)
}

// loginFailure registers a failed sign-in and returns either LockedError (when
// the failure tripped the lock) or the generic ErrUnauthorized.
func (s AuthService) loginFailure(ctx context.Context, key string, userID *string, meta model.AuthMeta) error {
	s.audit(ctx, userID, "auth.login_failed", meta)
	lockedUntil, err := s.repo.RegisterAuthFailure(ctx, key, loginMaxAttempts, loginWindow, loginLockFor)
	if err != nil {
		return err
	}
	if lockedUntil != nil {
		s.audit(ctx, userID, "auth.login_locked", meta)
		return LockedError{Until: *lockedUntil}
	}
	return ErrUnauthorized
}

func (s AuthService) lockedError(ctx context.Context, key string) (*LockedError, error) {
	until, err := s.repo.ThrottleLockedUntil(ctx, key)
	if err != nil {
		return nil, err
	}
	if until == nil {
		return nil, nil
	}
	return &LockedError{Until: *until}, nil
}

func (s AuthService) audit(ctx context.Context, actorID *string, action string, meta model.AuthMeta) {
	// Audit writes must never fail the auth flow itself.
	_ = s.repo.RecordAuthEvent(ctx, actorID, action, meta.IP, meta.UserAgent)
}

func (s AuthService) Refresh(ctx context.Context, token string) (model.AuthTokens, error) {
	user, err := s.repo.RefreshTokenUser(ctx, token)
	if err != nil || !user.IsActive {
		return model.AuthTokens{}, ErrUnauthorized
	}
	if err := s.repo.RevokeRefreshToken(ctx, token); err != nil {
		return model.AuthTokens{}, err
	}
	return s.issueTokens(ctx, user)
}

func (s AuthService) Logout(ctx context.Context, token string) error {
	if strings.TrimSpace(token) == "" {
		return nil
	}
	return s.repo.RevokeRefreshToken(ctx, token)
}

func (s AuthService) TokenManager() auth.Manager {
	return s.jwt
}

func (s AuthService) RequestPasswordReset(ctx context.Context, input model.EmailInput, meta model.AuthMeta) error {
	email := strings.ToLower(strings.TrimSpace(input.Email))
	if !validator.Email(email) {
		return validator.New().Add("email", "A valid email is required.")
	}

	// Cap how often reset emails can be requested per account. Failures stay
	// silent so the endpoint never reveals whether an account exists.
	sendKey := "send:password_reset:" + email
	if locked, err := s.lockedError(ctx, sendKey); err != nil || locked != nil {
		return err
	}
	if _, err := s.repo.RegisterAuthFailure(ctx, sendKey, sendMaxPerWindow, sendWindow, sendLockFor); err != nil {
		return err
	}

	user, err := s.repo.UserByEmail(ctx, email)
	if err != nil || !user.IsActive {
		return nil
	}
	code, err := randomCode()
	if err != nil {
		return err
	}
	if err := s.repo.StoreAuthCode(ctx, user.ID, "password_reset", codeHash(code), time.Now().UTC().Add(15*time.Minute)); err != nil {
		return err
	}
	s.audit(ctx, &user.ID, "auth.reset_requested", meta)
	return s.mail.SendPasswordResetCode(ctx, user.Email, user.Name, code)
}

func (s AuthService) ResetPassword(ctx context.Context, input model.VerifyCodeInput, meta model.AuthMeta) error {
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	input.Code = strings.TrimSpace(input.Code)
	if v := validateCodePassword(input); v.HasErrors() {
		return v
	}

	throttleKey := "code:password_reset:" + input.Email
	if locked, err := s.lockedError(ctx, throttleKey); err != nil {
		return err
	} else if locked != nil {
		return *locked
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = s.repo.CompleteAuthCode(ctx, input.Email, "password_reset", codeHash(input.Code), string(passwordHash), false)
	if errors.Is(err, repository.ErrNotFound) {
		return s.codeFailure(ctx, throttleKey, meta)
	}
	if err != nil {
		return err
	}
	_ = s.repo.ClearAuthThrottle(ctx, throttleKey)
	s.audit(ctx, nil, "auth.password_reset", meta)
	return nil
}

// codeFailure registers a wrong verification code and locks the flow once the
// attempt budget is spent — six-digit codes must never be brute-forceable.
func (s AuthService) codeFailure(ctx context.Context, key string, meta model.AuthMeta) error {
	s.audit(ctx, nil, "auth.code_failed", meta)
	lockedUntil, err := s.repo.RegisterAuthFailure(ctx, key, codeMaxAttempts, codeWindow, codeLockFor)
	if err != nil {
		return err
	}
	if lockedUntil != nil {
		s.audit(ctx, nil, "auth.code_locked", meta)
		return LockedError{Until: *lockedUntil}
	}
	return ErrUnauthorized
}

func (s AuthService) ChangePassword(ctx context.Context, userID string, input model.ChangePasswordInput) error {
	v := validator.New()
	if !validator.Required(input.CurrentPassword) {
		v = v.Add("currentPassword", "Current password is required.")
	}
	if !validator.StrongPassword(input.NewPassword) {
		v = v.Add("newPassword", "New password must be at least 10 characters and include letters and numbers.")
	}
	if v.HasErrors() {
		return v
	}

	user, err := s.repo.UserByID(ctx, userID)
	if err != nil {
		return ErrUnauthorized
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.CurrentPassword)) != nil {
		return ErrUnauthorized
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return s.repo.UpdateUserPassword(ctx, userID, string(newHash))
}

func (s AuthService) Profile(ctx context.Context, userID string) (model.User, error) {
	user, err := s.repo.UserByID(ctx, userID)
	if err != nil {
		return model.User{}, err
	}
	user.PasswordHash = ""
	return user, nil
}

func (s AuthService) UpdateProfile(ctx context.Context, userID string, input model.UpdateProfileInput) (model.User, error) {
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	input.Name = strings.TrimSpace(input.Name)

	v := validator.New()
	if !validator.Email(input.Email) {
		v = v.Add("email", "A valid email is required.")
	}
	if !validator.Required(input.Name) {
		v = v.Add("name", "Name is required.")
	}
	if v.HasErrors() {
		return model.User{}, v
	}

	user, err := s.repo.UpdateUserProfile(ctx, userID, input.Email, input.Name)
	if err != nil {
		return model.User{}, err
	}
	user.PasswordHash = ""
	return user, nil
}


func (s AuthService) VerifyInvitation(ctx context.Context, input model.VerifyCodeInput, meta model.AuthMeta) (model.AuthTokens, error) {
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	input.Code = strings.TrimSpace(input.Code)
	if v := validateCodePassword(input); v.HasErrors() {
		return model.AuthTokens{}, v
	}

	throttleKey := "code:invite:" + input.Email
	if locked, err := s.lockedError(ctx, throttleKey); err != nil {
		return model.AuthTokens{}, err
	} else if locked != nil {
		return model.AuthTokens{}, *locked
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return model.AuthTokens{}, err
	}
	user, err := s.repo.CompleteAuthCode(ctx, input.Email, "invite", codeHash(input.Code), string(passwordHash), true)
	if errors.Is(err, repository.ErrNotFound) {
		return model.AuthTokens{}, s.codeFailure(ctx, throttleKey, meta)
	}
	if err != nil {
		return model.AuthTokens{}, err
	}
	_ = s.repo.ClearAuthThrottle(ctx, throttleKey)
	s.audit(ctx, &user.ID, "auth.invite_accepted", meta)
	return s.issueTokens(ctx, user)
}

func (s AuthService) Users(ctx context.Context) ([]model.User, error) {
	actor, err := s.currentActor(ctx)
	if err != nil || (actor.Role != "owner" && actor.Role != "admin") {
		return nil, ErrForbidden
	}
	return s.repo.ListUsers(ctx)
}

func (s AuthService) InviteUser(ctx context.Context, input model.UserInviteInput) (model.User, error) {
	// Only the owner (master) account can bring new users into the CMS.
	actor, err := s.currentActor(ctx)
	if err != nil || actor.Role != "owner" {
		return model.User{}, ErrForbidden
	}
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	input.Name = strings.TrimSpace(input.Name)
	input.Role = strings.ToLower(strings.TrimSpace(input.Role))
	if input.Role == "" {
		input.Role = "user"
	}
	v := validator.New()
	if !validator.Email(input.Email) {
		v = v.Add("email", "A valid email is required.")
	}
	if !validator.Required(input.Name) {
		v = v.Add("name", "Name is required.")
	}
	if input.Role != "user" && input.Role != "admin" {
		v = v.Add("role", "Role must be admin or user.")
	}
	if v.HasErrors() {
		return model.User{}, v
	}
	placeholder, err := bcrypt.GenerateFromPassword([]byte(uuidLikePassword()), bcrypt.DefaultCost)
	if err != nil {
		return model.User{}, err
	}
	code, err := randomCode()
	if err != nil {
		return model.User{}, err
	}
	user, err := s.repo.CreateInvitedUser(ctx, input, string(placeholder), codeHash(code), time.Now().UTC().Add(30*time.Minute))
	if err != nil {
		return model.User{}, err
	}
	user.PasswordHash = ""
	if err := s.mail.SendInviteCode(ctx, user.Email, user.Name, code); err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (s AuthService) UpdateUserRole(ctx context.Context, userID, role string) (model.User, error) {
	claims := auth.ClaimsFromContext(ctx)
	actor, err := s.currentActor(ctx)
	if err != nil || claims == nil || actor.Role != "owner" {
		return model.User{}, ErrForbidden
	}
	role = strings.ToLower(strings.TrimSpace(role))
	if role != "admin" && role != "user" {
		return model.User{}, validator.New().Add("role", "Role must be admin or user.")
	}
	target, err := s.repo.UserByID(ctx, userID)
	if err != nil {
		return model.User{}, err
	}
	if target.Role == "owner" || target.ID == claims.UserID {
		return model.User{}, ErrForbidden
	}
	user, err := s.repo.UpdateUserRole(ctx, userID, role)
	user.PasswordHash = ""
	return user, err
}

func (s AuthService) DeleteUser(ctx context.Context, userID string) error {
	// Mirror InviteUser: only the owner manages the user list.
	claims := auth.ClaimsFromContext(ctx)
	actor, err := s.currentActor(ctx)
	if err != nil || claims == nil || actor.Role != "owner" || claims.UserID == userID {
		return ErrForbidden
	}
	target, err := s.repo.UserByID(ctx, userID)
	if err != nil {
		return err
	}
	if target.Role == "owner" {
		return ErrForbidden
	}
	return s.repo.DeleteUser(ctx, userID)
}

func (s AuthService) currentActor(ctx context.Context) (model.User, error) {
	claims := auth.ClaimsFromContext(ctx)
	if claims == nil {
		return model.User{}, ErrForbidden
	}
	user, err := s.repo.UserByID(ctx, claims.UserID)
	if err != nil || !user.IsActive {
		return model.User{}, ErrForbidden
	}
	return user, nil
}

func (s AuthService) issueTokens(ctx context.Context, user model.User) (model.AuthTokens, error) {
	accessToken, accessExpiresAt, err := s.jwt.Generate(user.ID, user.Email, user.Role, user.Permissions)
	if err != nil {
		return model.AuthTokens{}, err
	}
	refreshToken, err := randomToken()
	if err != nil {
		return model.AuthTokens{}, err
	}
	refreshExpiresAt := time.Now().UTC().Add(s.cfg.RefreshTokenTTL)
	if err := s.repo.StoreRefreshToken(ctx, user.ID, refreshToken, refreshExpiresAt); err != nil {
		return model.AuthTokens{}, err
	}
	user.PasswordHash = ""
	return model.AuthTokens{
		AccessToken:           accessToken,
		AccessTokenExpiresAt:  accessExpiresAt,
		RefreshToken:          refreshToken,
		RefreshTokenExpiresAt: refreshExpiresAt,
		User:                  user,
	}, nil
}

func randomToken() (string, error) {
	buffer := make([]byte, 32)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(buffer), nil
}

func randomCode() (string, error) {
	buffer := make([]byte, 4)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	number := int(buffer[0])<<16 | int(buffer[1])<<8 | int(buffer[2])
	return fmt.Sprintf("%06d", number%1000000), nil
}

// randomCodeN draws each digit independently (rejection-sampled) so every
// code of the configured length is equally likely.
func randomCodeN(length int) (string, error) {
	if length < 4 || length > 10 {
		length = 6
	}
	digits := make([]byte, 0, length)
	buffer := make([]byte, 1)
	for len(digits) < length {
		if _, err := rand.Read(buffer); err != nil {
			return "", err
		}
		// 0..249 maps evenly onto 0..9; 250..255 would bias, so redraw.
		if buffer[0] >= 250 {
			continue
		}
		digits = append(digits, '0'+buffer[0]%10)
	}
	return string(digits), nil
}

// maskEmail keeps just enough of the address for the user to recognize it.
func maskEmail(email string) string {
	at := strings.Index(email, "@")
	if at <= 0 {
		return email
	}
	local := email[:at]
	visible := 2
	if len(local) < 3 {
		visible = 1
	}
	return local[:visible] + strings.Repeat("•", max(len(local)-visible, 2)) + email[at:]
}

// deviceLabel condenses a user agent into "Browser on OS" for device lists
// and notification emails.
func deviceLabel(userAgent string) string {
	ua := strings.ToLower(userAgent)
	browser := "Unknown browser"
	switch {
	case strings.Contains(ua, "edg/"):
		browser = "Edge"
	case strings.Contains(ua, "opr/"):
		browser = "Opera"
	case strings.Contains(ua, "samsungbrowser"):
		browser = "Samsung Internet"
	case strings.Contains(ua, "firefox/"):
		browser = "Firefox"
	case strings.Contains(ua, "chrome/"):
		browser = "Chrome"
	case strings.Contains(ua, "safari/"):
		browser = "Safari"
	}
	os := "unknown OS"
	switch {
	case strings.Contains(ua, "windows"):
		os = "Windows"
	case strings.Contains(ua, "android"):
		os = "Android"
	case strings.Contains(ua, "iphone"), strings.Contains(ua, "ipad"):
		os = "iOS"
	case strings.Contains(ua, "mac os"):
		os = "macOS"
	case strings.Contains(ua, "linux"):
		os = "Linux"
	}
	return browser + " on " + os
}

// fingerprintHash normalizes the client-computed device fingerprint. Empty
// fingerprints stay empty: the trust token then binds to the token alone.
func fingerprintHash(fingerprint string) string {
	fingerprint = strings.TrimSpace(fingerprint)
	if fingerprint == "" {
		return ""
	}
	return codeHash(fingerprint)
}

// fingerprintMatches enforces the device binding: a device stored with a
// fingerprint requires the same fingerprint at login.
func fingerprintMatches(storedHash, presented string) bool {
	if storedHash == "" {
		return true
	}
	return storedHash == fingerprintHash(presented)
}

func codeHash(code string) string {
	sum := sha256.Sum256([]byte(strings.TrimSpace(code)))
	return hex.EncodeToString(sum[:])
}

func uuidLikePassword() string {
	token, err := randomToken()
	if err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return token
}

func validateCodePassword(input model.VerifyCodeInput) validator.ValidationError {
	v := validator.New()
	if !validator.Email(input.Email) {
		v = v.Add("email", "A valid email is required.")
	}
	if len(input.Code) != 6 {
		v = v.Add("code", "A valid six-digit code is required.")
	}
	if !validator.StrongPassword(input.Password) {
		v = v.Add("password", "Password must be at least 10 characters and include letters and numbers.")
	}
	return v
}
