-- Email OTP two-factor login + trusted devices.
--
-- login_challenges: one row per password-verified sign-in awaiting its email
-- code. Codes are stored hashed; attempts/resends are counted per challenge.
-- trusted_devices: opaque tokens (hashed) that let a browser skip the OTP
-- step for a configurable number of days, bound to a device fingerprint.

CREATE TABLE IF NOT EXISTS login_challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    resend_count integer NOT NULL DEFAULT 0,
    last_sent_at timestamptz NOT NULL DEFAULT now(),
    consumed_at timestamptz,
    ip text NOT NULL DEFAULT '',
    user_agent text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS login_challenges_user_idx ON login_challenges (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS login_challenges_expiry_idx ON login_challenges (expires_at);

CREATE TABLE IF NOT EXISTS trusted_devices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash text NOT NULL,
    fingerprint_hash text NOT NULL DEFAULT '',
    label text NOT NULL DEFAULT '',
    ip text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS trusted_devices_token_uniq ON trusted_devices (token_hash);
CREATE INDEX IF NOT EXISTS trusted_devices_user_idx ON trusted_devices (user_id, created_at DESC);

-- Security feature flags + email templates (settings key "security"),
-- editable from the admin. Placeholders: {{name}} {{code}} {{minutes}}
-- {{device}} {{ip}} {{time}} {{site}}.
INSERT INTO settings (id, key, value)
VALUES (
    '00000000-0000-0000-0000-000000000602',
    'security',
    '{"twoFactorEnabled": true, "otpLength": 6, "otpExpiryMinutes": 5, "trustDays": 30, "resendCooldownSec": 60, "maxOtpAttempts": 5, "maxResends": 3, "otpSubject": "", "otpBody": "", "newDeviceSubject": "", "newDeviceBody": ""}'
)
ON CONFLICT DO NOTHING;
