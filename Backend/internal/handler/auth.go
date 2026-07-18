package handler

import (
	"errors"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/auth"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/repository"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/service"
)

type AuthHandler struct {
	service service.AuthService
}

func NewAuthHandler(service service.AuthService) AuthHandler {
	return AuthHandler{service: service}
}

func authMeta(r *http.Request) model.AuthMeta {
	ip := r.RemoteAddr
	if host, _, err := net.SplitHostPort(ip); err == nil {
		ip = host
	}
	return model.AuthMeta{IP: ip, UserAgent: r.UserAgent()}
}

// writeLocked renders the shared 429 response for throttled auth flows.
func writeLocked(w http.ResponseWriter, err error) bool {
	var locked service.LockedError
	if !errors.As(err, &locked) {
		return false
	}
	seconds := int(locked.RetryAfter()/time.Second) + 1
	w.Header().Set("Retry-After", strconv.Itoa(seconds))
	Error(w, http.StatusTooManyRequests, "locked", "Too many attempts. Try again in a few minutes.")
	return true
}

func (h AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var input model.LoginInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	result, err := h.service.Login(r.Context(), input, authMeta(r))
	if writeLocked(w, err) {
		return
	}
	if errors.Is(err, service.ErrUnauthorized) {
		Error(w, http.StatusUnauthorized, "unauthorized", "Invalid email or password.")
		return
	}
	if errors.Is(err, service.ErrVerificationRequired) {
		Error(w, http.StatusForbidden, "verification_required", "Verify your invitation code before signing in.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, result)
}

// VerifyOTP completes the two-step sign-in with the emailed code.
func (h AuthHandler) VerifyOTP(w http.ResponseWriter, r *http.Request) {
	var input model.VerifyOTPInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	result, err := h.service.VerifyOTP(r.Context(), input, authMeta(r))
	if writeLocked(w, err) {
		return
	}
	if errors.Is(err, service.ErrUnauthorized) {
		Error(w, http.StatusUnauthorized, "invalid_code", "The verification code is invalid or expired.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, result)
}

// ResendOTP sends a fresh code for a pending challenge (cooldown enforced).
func (h AuthHandler) ResendOTP(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ChallengeID string `json:"challengeId"`
	}
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	result, err := h.service.ResendOTP(r.Context(), input.ChallengeID, authMeta(r))
	if writeLocked(w, err) {
		return
	}
	if errors.Is(err, service.ErrUnauthorized) {
		Error(w, http.StatusUnauthorized, "invalid_challenge", "The sign-in session is invalid or already completed.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, result)
}

// TrustedDevices lists the signed-in user's trusted devices.
func (h AuthHandler) TrustedDevices(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Sign in first.")
		return
	}
	devices, err := h.service.TrustedDevices(r.Context(), claims.UserID)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"data": devices})
}

func (h AuthHandler) RevokeTrustedDevice(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Sign in first.")
		return
	}
	err := h.service.RevokeTrustedDevice(r.Context(), claims.UserID, chi.URLParam(r, "id"), authMeta(r))
	if errors.Is(err, repository.ErrNotFound) {
		Error(w, http.StatusNotFound, "not_found", "Device was not found.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusNoContent, nil)
}

func (h AuthHandler) RevokeAllTrustedDevices(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Sign in first.")
		return
	}
	if err := h.service.RevokeAllTrustedDevices(r.Context(), claims.UserID, authMeta(r)); err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusNoContent, nil)
}

// LoginHistory returns the user's recent sign-in events (incl. failures).
func (h AuthHandler) LoginHistory(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Sign in first.")
		return
	}
	entries, err := h.service.LoginHistory(r.Context(), claims.UserID)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]any{"data": entries})
}

func (h AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var input model.RefreshInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	tokens, err := h.service.Refresh(r.Context(), input.RefreshToken)
	if errors.Is(err, service.ErrUnauthorized) {
		Error(w, http.StatusUnauthorized, "unauthorized", "Refresh token is invalid or expired.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, tokens)
}

func (h AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var input model.RefreshInput
	_ = DecodeJSON(r, &input)
	if err := h.service.Logout(r.Context(), input.RefreshToken); err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusNoContent, nil)
}

func (h AuthHandler) RequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	var input model.EmailInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	if err := h.service.RequestPasswordReset(r.Context(), input, authMeta(r)); err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusAccepted, map[string]string{"message": "If the account exists, a reset code has been sent."})
}

func (h AuthHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var input model.VerifyCodeInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	if err := h.service.ResetPassword(r.Context(), input, authMeta(r)); err != nil {
		if writeLocked(w, err) {
			return
		}
		if errors.Is(err, service.ErrUnauthorized) {
			Error(w, http.StatusUnauthorized, "invalid_code", "The verification code is invalid or expired.")
			return
		}
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]string{"message": "Password updated."})
}

func (h AuthHandler) VerifyInvitation(w http.ResponseWriter, r *http.Request) {
	var input model.VerifyCodeInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	tokens, err := h.service.VerifyInvitation(r.Context(), input, authMeta(r))
	if writeLocked(w, err) {
		return
	}
	if errors.Is(err, service.ErrUnauthorized) {
		Error(w, http.StatusUnauthorized, "invalid_code", "The verification code is invalid or expired.")
		return
	}
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, tokens)
}

func (h AuthHandler) Users(w http.ResponseWriter, r *http.Request) {
	users, err := h.service.Users(r.Context())
	claims := auth.ClaimsFromContext(r.Context())
	respondAuthAdmin(w, map[string]any{
		"data":          users,
		"currentUserId": claims.UserID,
		"currentRole":   claims.Role,
	}, err)
}

func (h AuthHandler) InviteUser(w http.ResponseWriter, r *http.Request) {
	var input model.UserInviteInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	user, err := h.service.InviteUser(r.Context(), input)
	if err != nil {
		respondAuthAdmin(w, nil, err)
		return
	}
	JSON(w, http.StatusCreated, user)
}

func (h AuthHandler) UpdateUserRole(w http.ResponseWriter, r *http.Request) {
	var input model.UserRoleInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	user, err := h.service.UpdateUserRole(r.Context(), chi.URLParam(r, "id"), input.Role)
	respondAuthAdmin(w, user, err)
}

func (h AuthHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	err := h.service.DeleteUser(r.Context(), chi.URLParam(r, "id"))
	if err != nil {
		respondAuthAdmin(w, nil, err)
		return
	}
	JSON(w, http.StatusNoContent, nil)
}

func (h AuthHandler) Profile(w http.ResponseWriter, r *http.Request) {
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}
	user, err := h.service.Profile(r.Context(), claims.UserID)
	if err != nil {
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, user)
}

func (h AuthHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var input model.UpdateProfileInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}
	user, err := h.service.UpdateProfile(r.Context(), claims.UserID, input)
	if err != nil {
		if errors.Is(err, repository.ErrConflict) {
			Error(w, http.StatusConflict, "email_exists", "A user with this email already exists.")
			return
		}
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, user)
}

func (h AuthHandler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	var input model.ChangePasswordInput
	if err := DecodeJSON(r, &input); err != nil {
		Error(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.")
		return
	}
	claims := auth.ClaimsFromContext(r.Context())
	if claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized", "Authentication is required.")
		return
	}
	err := h.service.ChangePassword(r.Context(), claims.UserID, input)
	if err != nil {
		if errors.Is(err, service.ErrUnauthorized) {
			Error(w, http.StatusUnauthorized, "invalid_current_password", "Current password is incorrect.")
			return
		}
		HandleError(w, err)
		return
	}
	JSON(w, http.StatusOK, map[string]string{"message": "Password changed successfully."})
}

func respondAuthAdmin(w http.ResponseWriter, data any, err error) {
	switch {
	case errors.Is(err, service.ErrForbidden):
		Error(w, http.StatusForbidden, "forbidden", "You do not have permission to manage this account.")
	case errors.Is(err, repository.ErrNotFound):
		Error(w, http.StatusNotFound, "not_found", "User was not found.")
	case errors.Is(err, repository.ErrConflict):
		Error(w, http.StatusConflict, "email_exists", "A user with this email already exists.")
	case err != nil:
		HandleError(w, err)
	default:
		JSON(w, http.StatusOK, data)
	}
}
