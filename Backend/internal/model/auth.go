package model

import "time"

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	Name         string    `json:"name"`
	PasswordHash string    `json:"-"`
	IsActive     bool      `json:"isActive"`
	Role         string    `json:"role"`
	Permissions  []string  `json:"permissions"`
	CreatedAt    time.Time `json:"createdAt"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	// TrustedToken is the opaque trusted-device token (from the HTTP-only
	// cookie); when valid it skips the email verification step.
	TrustedToken string `json:"trustedToken"`
	// Fingerprint is a coarse client-computed device hash the trust token is
	// bound to.
	Fingerprint string `json:"fingerprint"`
}

// AuthMeta carries request metadata (client IP, user agent) into the auth
// service for throttling decisions and audit logging.
type AuthMeta struct {
	IP        string
	UserAgent string
}

type RefreshInput struct {
	RefreshToken string `json:"refreshToken"`
}

type EmailInput struct {
	Email string `json:"email"`
}

type VerifyCodeInput struct {
	Email    string `json:"email"`
	Code     string `json:"code"`
	Password string `json:"password"`
}

type UserInviteInput struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	Role  string `json:"role"`
}

type UserRoleInput struct {
	Role string `json:"role"`
}

type AuthTokens struct {
	AccessToken           string    `json:"accessToken"`
	AccessTokenExpiresAt  time.Time `json:"accessTokenExpiresAt"`
	RefreshToken          string    `json:"refreshToken"`
	RefreshTokenExpiresAt time.Time `json:"refreshTokenExpiresAt"`
	User                  User      `json:"user"`
}

type ChangePasswordInput struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

type UpdateProfileInput struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

