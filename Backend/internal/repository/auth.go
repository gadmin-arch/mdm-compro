package repository

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"net"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/irfanzuhdiabdillah/mdm-compro/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthRepository struct {
	pool *pgxpool.Pool
}

func NewAuthRepository(pool *pgxpool.Pool) AuthRepository {
	return AuthRepository{pool: pool}
}

func (r AuthRepository) UserByEmail(ctx context.Context, email string) (model.User, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT u.id::text, u.email, u.name, u.password_hash, u.is_active, u.created_at,
		       COALESCE(MAX(ro.code), 'user'),
		       COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}')
		FROM users u
		LEFT JOIN user_roles ur ON ur.user_id = u.id
		LEFT JOIN roles ro ON ro.id = ur.role_id AND ro.deleted_at IS NULL
		LEFT JOIN role_permissions rp ON rp.role_id = ro.id
		LEFT JOIN permissions p ON p.id = rp.permission_id
		WHERE lower(u.email) = lower($1) AND u.deleted_at IS NULL
		GROUP BY u.id
	`, email)

	return scanUser(row)
}

func (r AuthRepository) UserByID(ctx context.Context, id string) (model.User, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT u.id::text, u.email, u.name, u.password_hash, u.is_active, u.created_at,
		       COALESCE(MAX(ro.code), 'user'),
		       COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}')
		FROM users u
		LEFT JOIN user_roles ur ON ur.user_id = u.id
		LEFT JOIN roles ro ON ro.id = ur.role_id AND ro.deleted_at IS NULL
		LEFT JOIN role_permissions rp ON rp.role_id = ro.id
		LEFT JOIN permissions p ON p.id = rp.permission_id
		WHERE u.id = $1 AND u.deleted_at IS NULL
		GROUP BY u.id
	`, id)

	return scanUser(row)
}

func scanUser(row pgx.Row) (model.User, error) {
	var user model.User
	if err := row.Scan(&user.ID, &user.Email, &user.Name, &user.PasswordHash, &user.IsActive, &user.CreatedAt, &user.Role, &user.Permissions); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.User{}, ErrNotFound
		}
		return model.User{}, err
	}
	return user, nil
}

func (r AuthRepository) StoreRefreshToken(ctx context.Context, userID, token string, expiresAt time.Time) error {
	_, err := r.pool.Exec(ctx, `
		INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
		VALUES ($1, $2, $3, $4)
	`, uuid.NewString(), userID, hashToken(token), expiresAt)
	return err
}

func (r AuthRepository) RefreshTokenUser(ctx context.Context, token string) (model.User, error) {
	row := r.pool.QueryRow(ctx, `
		SELECT u.id::text, u.email, u.name, u.password_hash, u.is_active, u.created_at,
		       COALESCE(MAX(ro.code), 'user'),
		       COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}')
		FROM refresh_tokens rt
		JOIN users u ON u.id = rt.user_id AND u.deleted_at IS NULL
		LEFT JOIN user_roles ur ON ur.user_id = u.id
		LEFT JOIN roles ro ON ro.id = ur.role_id AND ro.deleted_at IS NULL
		LEFT JOIN role_permissions rp ON rp.role_id = ro.id
		LEFT JOIN permissions p ON p.id = rp.permission_id
		WHERE rt.token_hash = $1 AND rt.revoked_at IS NULL AND rt.expires_at > now()
		GROUP BY u.id
	`, hashToken(token))

	return scanUser(row)
}

func (r AuthRepository) RevokeRefreshToken(ctx context.Context, token string) error {
	_, err := r.pool.Exec(ctx, `
		UPDATE refresh_tokens
		SET revoked_at = now()
		WHERE token_hash = $1 AND revoked_at IS NULL
	`, hashToken(token))
	return err
}

func (r AuthRepository) ListUsers(ctx context.Context) ([]model.User, error) {
	rows, err := r.pool.Query(ctx, `
		SELECT u.id::text, u.email, u.name, u.password_hash, u.is_active, u.created_at,
		       COALESCE(MAX(ro.code), 'user'),
		       COALESCE(array_agg(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL), '{}')
		FROM users u
		LEFT JOIN user_roles ur ON ur.user_id = u.id
		LEFT JOIN roles ro ON ro.id = ur.role_id AND ro.deleted_at IS NULL
		LEFT JOIN role_permissions rp ON rp.role_id = ro.id
		LEFT JOIN permissions p ON p.id = rp.permission_id
		WHERE u.deleted_at IS NULL
		GROUP BY u.id
		ORDER BY u.created_at ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []model.User{}
	for rows.Next() {
		user, err := scanUser(rows)
		if err != nil {
			return nil, err
		}
		user.PasswordHash = ""
		users = append(users, user)
	}
	return users, rows.Err()
}

func (r AuthRepository) CreateInvitedUser(ctx context.Context, input model.UserInviteInput, passwordHash, codeHash string, expiresAt time.Time) (model.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.User{}, err
	}
	defer tx.Rollback(ctx)

	userID := uuid.NewString()
	_, err = tx.Exec(ctx, `
		INSERT INTO users (id, email, name, password_hash, is_active)
		VALUES ($1, $2, $3, $4, false)
	`, userID, input.Email, input.Name, passwordHash)
	if err != nil {
		if isUniqueViolation(err) {
			return model.User{}, ErrConflict
		}
		return model.User{}, err
	}
	if _, err := tx.Exec(ctx, `
		INSERT INTO user_roles (user_id, role_id)
		SELECT $1, id FROM roles WHERE code = $2 AND deleted_at IS NULL
	`, userID, input.Role); err != nil {
		return model.User{}, err
	}
	if _, err := tx.Exec(ctx, `
		INSERT INTO auth_codes (user_id, purpose, code_hash, expires_at)
		VALUES ($1, 'invite', $2, $3)
	`, userID, codeHash, expiresAt); err != nil {
		return model.User{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.User{}, err
	}
	return r.UserByID(ctx, userID)
}

func (r AuthRepository) StoreAuthCode(ctx context.Context, userID, purpose, codeHash string, expiresAt time.Time) error {
	if _, err := r.pool.Exec(ctx, `
		UPDATE auth_codes SET used_at = now()
		WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL
	`, userID, purpose); err != nil {
		return err
	}
	_, err := r.pool.Exec(ctx, `
		INSERT INTO auth_codes (user_id, purpose, code_hash, expires_at)
		VALUES ($1, $2, $3, $4)
	`, userID, purpose, codeHash, expiresAt)
	return err
}

func (r AuthRepository) CompleteAuthCode(ctx context.Context, email, purpose, codeHash, passwordHash string, activate bool) (model.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.User{}, err
	}
	defer tx.Rollback(ctx)

	var userID string
	err = tx.QueryRow(ctx, `
		SELECT u.id::text
		FROM auth_codes ac
		JOIN users u ON u.id = ac.user_id AND u.deleted_at IS NULL
		WHERE lower(u.email) = lower($1)
		  AND ac.purpose = $2
		  AND ac.code_hash = $3
		  AND ac.used_at IS NULL
		  AND ac.expires_at > now()
		ORDER BY ac.created_at DESC
		LIMIT 1
		FOR UPDATE OF ac
	`, email, purpose, codeHash).Scan(&userID)
	if errors.Is(err, pgx.ErrNoRows) {
		return model.User{}, ErrNotFound
	}
	if err != nil {
		return model.User{}, err
	}

	if _, err := tx.Exec(ctx, `
		UPDATE users
		SET password_hash = $2,
		    is_active = CASE WHEN $3 THEN true ELSE is_active END,
		    updated_at = now(),
		    version = version + 1
		WHERE id = $1
	`, userID, passwordHash, activate); err != nil {
		return model.User{}, err
	}
	if _, err := tx.Exec(ctx, `
		UPDATE auth_codes SET used_at = now()
		WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL
	`, userID, purpose); err != nil {
		return model.User{}, err
	}
	if _, err := tx.Exec(ctx, `
		UPDATE refresh_tokens SET revoked_at = now()
		WHERE user_id = $1 AND revoked_at IS NULL
	`, userID); err != nil {
		return model.User{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.User{}, err
	}
	return r.UserByID(ctx, userID)
}

func (r AuthRepository) UpdateUserRole(ctx context.Context, userID, role string) (model.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.User{}, err
	}
	defer tx.Rollback(ctx)
	if _, err := tx.Exec(ctx, `DELETE FROM user_roles WHERE user_id = $1`, userID); err != nil {
		return model.User{}, err
	}
	result, err := tx.Exec(ctx, `
		INSERT INTO user_roles (user_id, role_id)
		SELECT $1, id FROM roles WHERE code = $2 AND deleted_at IS NULL
	`, userID, role)
	if err != nil {
		return model.User{}, err
	}
	if result.RowsAffected() == 0 {
		return model.User{}, ErrNotFound
	}
	if _, err := tx.Exec(ctx, `UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, userID); err != nil {
		return model.User{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return model.User{}, err
	}
	return r.UserByID(ctx, userID)
}

func (r AuthRepository) DeleteUser(ctx context.Context, userID string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	result, err := tx.Exec(ctx, `
		UPDATE users
		SET deleted_at = now(), is_active = false, updated_at = now(), version = version + 1
		WHERE id = $1 AND deleted_at IS NULL
	`, userID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}
	if _, err := tx.Exec(ctx, `UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, userID); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, `DELETE FROM auth_codes WHERE user_id = $1`, userID); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (r AuthRepository) UpdateUserPassword(ctx context.Context, userID, passwordHash string) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	result, err := tx.Exec(ctx, `
		UPDATE users
		SET password_hash = $2,
		    updated_at = now(),
		    version = version + 1
		WHERE id = $1 AND deleted_at IS NULL
	`, userID, passwordHash)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return ErrNotFound
	}

	// Revoke all existing refresh tokens so user is forced to re-login on other devices
	if _, err := tx.Exec(ctx, `
		UPDATE refresh_tokens
		SET revoked_at = now()
		WHERE user_id = $1 AND revoked_at IS NULL
	`, userID); err != nil {
		return err
	}

	return tx.Commit(ctx)
}

func (r AuthRepository) UpdateUserProfile(ctx context.Context, userID, email, name string) (model.User, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return model.User{}, err
	}
	defer tx.Rollback(ctx)

	result, err := tx.Exec(ctx, `
		UPDATE users
		SET email = $2,
		    name = $3,
		    updated_at = now(),
		    version = version + 1
		WHERE id = $1 AND deleted_at IS NULL
	`, userID, email, name)
	if err != nil {
		if isUniqueViolation(err) {
			return model.User{}, ErrConflict
		}
		return model.User{}, err
	}
	if result.RowsAffected() == 0 {
		return model.User{}, ErrNotFound
	}

	if _, err := tx.Exec(ctx, `
		UPDATE refresh_tokens
		SET revoked_at = now()
		WHERE user_id = $1 AND revoked_at IS NULL
	`, userID); err != nil {
		return model.User{}, err
	}

	if err := tx.Commit(ctx); err != nil {
		return model.User{}, err
	}

	return r.UserByID(ctx, userID)
}

// ThrottleLockedUntil returns the active lock expiry for a throttle key, or nil.
func (r AuthRepository) ThrottleLockedUntil(ctx context.Context, key string) (*time.Time, error) {
	var lockedUntil time.Time
	err := r.pool.QueryRow(ctx, `
		SELECT locked_until FROM auth_throttle
		WHERE key = $1 AND locked_until IS NOT NULL AND locked_until > now()
	`, key).Scan(&lockedUntil)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &lockedUntil, nil
}

// RegisterAuthFailure bumps the failure counter for key inside a rolling window
// and locks the key for lockFor once maxAttempts is reached. It returns the lock
// expiry when the key is (now) locked.
func (r AuthRepository) RegisterAuthFailure(ctx context.Context, key string, maxAttempts int, window, lockFor time.Duration) (*time.Time, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var attempts int
	err = tx.QueryRow(ctx, `
		INSERT INTO auth_throttle (key, attempts, window_start, locked_until, updated_at)
		VALUES ($1, 1, now(), NULL, now())
		ON CONFLICT (key) DO UPDATE SET
			attempts = CASE
				WHEN auth_throttle.window_start < now() - make_interval(secs => $2)
					AND (auth_throttle.locked_until IS NULL OR auth_throttle.locked_until <= now())
				THEN 1
				ELSE auth_throttle.attempts + 1
			END,
			window_start = CASE
				WHEN auth_throttle.window_start < now() - make_interval(secs => $2)
					AND (auth_throttle.locked_until IS NULL OR auth_throttle.locked_until <= now())
				THEN now()
				ELSE auth_throttle.window_start
			END,
			updated_at = now()
		RETURNING attempts
	`, key, window.Seconds()).Scan(&attempts)
	if err != nil {
		return nil, err
	}

	var lockedUntil *time.Time
	if attempts >= maxAttempts {
		var until time.Time
		if err := tx.QueryRow(ctx, `
			UPDATE auth_throttle
			SET locked_until = now() + make_interval(secs => $2), updated_at = now()
			WHERE key = $1
			RETURNING locked_until
		`, key, lockFor.Seconds()).Scan(&until); err != nil {
			return nil, err
		}
		lockedUntil = &until
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return lockedUntil, nil
}

func (r AuthRepository) ClearAuthThrottle(ctx context.Context, key string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM auth_throttle WHERE key = $1`, key)
	return err
}

// RecordAuthEvent appends an authentication event to the audit log.
func (r AuthRepository) RecordAuthEvent(ctx context.Context, actorID *string, action, ip, userAgent string) error {
	var inet any
	if parsed := net.ParseIP(strings.TrimSpace(ip)); parsed != nil {
		inet = parsed.String()
	}
	var actor any
	if actorID != nil && *actorID != "" {
		actor = *actorID
	}
	_, err := r.pool.Exec(ctx, `
		INSERT INTO audit_logs (id, actor_id, action, entity_type, ip_address, user_agent)
		VALUES ($1, $2, $3, 'auth', $4, $5)
	`, uuid.NewString(), actor, action, inet, userAgent)
	return err
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}
