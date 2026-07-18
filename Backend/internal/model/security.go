package model

import (
	"encoding/json"
	"strings"
	"time"
)

// SecuritySettingKey stores the authentication policy in the settings table.
const SecuritySettingKey = "security"

// SecurityConfig is the admin-tunable authentication policy.
type SecurityConfig struct {
	TwoFactorEnabled  bool   `json:"twoFactorEnabled"`
	OTPLength         int    `json:"otpLength"`
	OTPExpiryMinutes  int    `json:"otpExpiryMinutes"`
	TrustDays         int    `json:"trustDays"`
	ResendCooldownSec int    `json:"resendCooldownSec"`
	MaxOTPAttempts    int    `json:"maxOtpAttempts"`
	MaxResends        int    `json:"maxResends"`
	OTPSubject        string `json:"otpSubject"`
	OTPBody           string `json:"otpBody"`
	NewDeviceSubject  string `json:"newDeviceSubject"`
	NewDeviceBody     string `json:"newDeviceBody"`
}

func DefaultSecurityConfig() SecurityConfig {
	return SecurityConfig{
		TwoFactorEnabled:  true,
		OTPLength:         6,
		OTPExpiryMinutes:  5,
		TrustDays:         30,
		ResendCooldownSec: 60,
		MaxOTPAttempts:    5,
		MaxResends:        3,
	}
}

const (
	defaultOTPSubject = "Your {{site}} sign-in code"
	defaultOTPBody    = "Hello {{name}},\n\nYour sign-in verification code is: {{code}}\n\nIt expires in {{minutes}} minutes. If you did not try to sign in, change your password immediately."

	defaultNewDeviceSubject = "New sign-in to {{site}}"
	defaultNewDeviceBody    = "Hello {{name}},\n\nYour account was just signed in from a new device.\n\nDevice: {{device}}\nIP address: {{ip}}\nTime: {{time}} UTC\n\nIf this was you, no action is needed. If not, reset your password right away."
)

// ParseSecurityConfig reads the settings value and clamps every knob into a
// safe range, so a hand-edited row can never disable brute-force limits.
func ParseSecurityConfig(raw json.RawMessage) SecurityConfig {
	cfg := DefaultSecurityConfig()
	if len(raw) > 0 {
		_ = json.Unmarshal(raw, &cfg)
	}
	cfg.OTPLength = clampInt(cfg.OTPLength, 4, 8, 6)
	cfg.OTPExpiryMinutes = clampInt(cfg.OTPExpiryMinutes, 1, 15, 5)
	cfg.TrustDays = clampInt(cfg.TrustDays, 1, 90, 30)
	cfg.ResendCooldownSec = clampInt(cfg.ResendCooldownSec, 15, 600, 60)
	cfg.MaxOTPAttempts = clampInt(cfg.MaxOTPAttempts, 3, 10, 5)
	cfg.MaxResends = clampInt(cfg.MaxResends, 1, 10, 3)
	return cfg
}

func clampInt(value, min, max, fallback int) int {
	if value == 0 {
		return fallback
	}
	if value < min {
		return min
	}
	if value > max {
		return max
	}
	return value
}

// OTPEmail renders the (possibly admin-customized) code email.
func (c SecurityConfig) OTPEmail(data map[string]string) (subject, body string) {
	subject = renderTemplate(firstNonEmpty(c.OTPSubject, defaultOTPSubject), data)
	body = renderTemplate(firstNonEmpty(c.OTPBody, defaultOTPBody), data)
	return subject, body
}

// NewDeviceEmail renders the new-device notification.
func (c SecurityConfig) NewDeviceEmail(data map[string]string) (subject, body string) {
	subject = renderTemplate(firstNonEmpty(c.NewDeviceSubject, defaultNewDeviceSubject), data)
	body = renderTemplate(firstNonEmpty(c.NewDeviceBody, defaultNewDeviceBody), data)
	return subject, body
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if strings.TrimSpace(v) != "" {
			return v
		}
	}
	return ""
}

// renderTemplate substitutes {{key}} placeholders; unknown keys are left
// intact so typos are visible in the received email rather than silent.
func renderTemplate(template string, data map[string]string) string {
	out := template
	for key, value := range data {
		out = strings.ReplaceAll(out, "{{"+key+"}}", value)
	}
	return out
}

// --- runtime models ---

type LoginChallenge struct {
	ID          string
	UserID      string
	CodeHash    string
	ExpiresAt   time.Time
	Attempts    int
	ResendCount int
	LastSentAt  time.Time
	ConsumedAt  *time.Time
}

type TrustedDevice struct {
	ID              string     `json:"id"`
	UserID          string     `json:"-"`
	TokenHash       string     `json:"-"`
	FingerprintHash string     `json:"-"`
	Label           string     `json:"label"`
	IP              string     `json:"ip"`
	CreatedAt       time.Time  `json:"createdAt"`
	LastUsedAt      time.Time  `json:"lastUsedAt"`
	ExpiresAt       time.Time  `json:"expiresAt"`
	RevokedAt       *time.Time `json:"-"`
}

// LoginResult is what POST /auth/login now returns: either tokens (2FA off /
// trusted device) or a pending OTP challenge.
type LoginResult struct {
	Status            string      `json:"status"` // ok | otp_required
	Tokens            *AuthTokens `json:"tokens,omitempty"`
	ChallengeID       string      `json:"challengeId,omitempty"`
	MaskedEmail       string      `json:"maskedEmail,omitempty"`
	CodeLength        int         `json:"codeLength,omitempty"`
	ExpiresAt         *time.Time  `json:"expiresAt,omitempty"`
	ResendCooldownSec int         `json:"resendCooldownSec,omitempty"`
	TrustDays         int         `json:"trustDays,omitempty"`
}

type VerifyOTPInput struct {
	ChallengeID string `json:"challengeId"`
	Code        string `json:"code"`
	TrustDevice bool   `json:"trustDevice"`
	Fingerprint string `json:"fingerprint"`
}

type VerifyOTPResult struct {
	Tokens         AuthTokens `json:"tokens"`
	TrustToken     string     `json:"trustToken,omitempty"`
	TrustExpiresAt *time.Time `json:"trustExpiresAt,omitempty"`
}

// LoginHistoryEntry is one row of a user's sign-in history (from audit_logs).
type LoginHistoryEntry struct {
	ID        string    `json:"id"`
	Action    string    `json:"action"`
	IP        string    `json:"ip"`
	UserAgent string    `json:"userAgent"`
	CreatedAt time.Time `json:"createdAt"`
}
