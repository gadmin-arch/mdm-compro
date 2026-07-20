package auth

import (
	"strings"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestGenerateParseRoundtrip(t *testing.T) {
	manager := NewManager("test-secret-at-least-32-characters!!", time.Hour)
	token, expiresAt, err := manager.Generate("user-1", "user@example.com", "admin", []string{"content:write"})
	if err != nil {
		t.Fatalf("Generate: %v", err)
	}
	if time.Until(expiresAt) <= 0 {
		t.Fatal("expiry must be in the future")
	}

	claims, err := manager.Parse(token)
	if err != nil {
		t.Fatalf("Parse: %v", err)
	}
	if claims.UserID != "user-1" || claims.Email != "user@example.com" || claims.Role != "admin" {
		t.Errorf("claims mismatch: %+v", claims)
	}
	if len(claims.Permissions) != 1 || claims.Permissions[0] != "content:write" {
		t.Errorf("permissions mismatch: %v", claims.Permissions)
	}
}

func TestParseRejectsExpired(t *testing.T) {
	manager := NewManager("test-secret-at-least-32-characters!!", -time.Minute)
	token, _, err := manager.Generate("user-1", "user@example.com", "admin", nil)
	if err != nil {
		t.Fatalf("Generate: %v", err)
	}
	if _, err := manager.Parse(token); err == nil {
		t.Fatal("expected expired token to be rejected")
	}
}

func TestParseRejectsWrongSecret(t *testing.T) {
	manager := NewManager("test-secret-at-least-32-characters!!", time.Hour)
	token, _, _ := manager.Generate("user-1", "user@example.com", "admin", nil)

	other := NewManager("a-completely-different-secret-value!", time.Hour)
	if _, err := other.Parse(token); err == nil {
		t.Fatal("expected token signed with another secret to be rejected")
	}
}

func TestParseRejectsWrongAlgorithm(t *testing.T) {
	// alg=none tokens must never validate (HS256 is pinned).
	manager := NewManager("test-secret-at-least-32-characters!!", time.Hour)
	unsigned := jwt.NewWithClaims(jwt.SigningMethodNone, jwt.MapClaims{"sub": "user-1"})
	token, err := unsigned.SignedString(jwt.UnsafeAllowNoneSignatureType)
	if err != nil {
		t.Fatalf("sign none: %v", err)
	}
	if _, err := manager.Parse(token); err == nil {
		t.Fatal("expected alg=none token to be rejected")
	}
	if !strings.Contains(token, ".") {
		t.Fatal("sanity: token must be a JWT")
	}
}

func TestHasPermission(t *testing.T) {
	claims := &Claims{Permissions: []string{"content:read", "media:write"}}
	if !HasPermission(claims, "content:read") {
		t.Error("exact permission should match")
	}
	if HasPermission(claims, "users:manage") {
		t.Error("missing permission must not match")
	}
	wildcard := &Claims{Permissions: []string{"admin:*"}}
	if !HasPermission(wildcard, "anything:at-all") {
		t.Error("admin:* must grant everything")
	}
	if HasPermission(nil, "content:read") {
		t.Error("nil claims must never grant permissions")
	}
}
