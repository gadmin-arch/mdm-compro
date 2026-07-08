-- Persistent failed-attempt tracking for login and verification codes.
-- Keys look like "login:<email>", "code:invite:<email>", "send:password_reset:<email>".
CREATE TABLE IF NOT EXISTS auth_throttle (
    key text PRIMARY KEY,
    attempts integer NOT NULL DEFAULT 0,
    window_start timestamptz NOT NULL DEFAULT now(),
    locked_until timestamptz,
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_throttle_updated_idx ON auth_throttle (updated_at);
