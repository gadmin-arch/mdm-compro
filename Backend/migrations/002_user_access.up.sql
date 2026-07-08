CREATE TABLE IF NOT EXISTS auth_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    purpose text NOT NULL CHECK (purpose IN ('invite', 'password_reset')),
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_codes_user_purpose_idx
    ON auth_codes (user_id, purpose, expires_at DESC);

INSERT INTO permissions (id, code, description) VALUES
('00000000-0000-0000-0000-000000000106', 'users:manage', 'Invite, update, and remove CMS users')
ON CONFLICT DO NOTHING;

UPDATE roles
SET name = 'Owner', code = 'owner', description = 'Primary system owner'
WHERE code = 'super_admin';

UPDATE roles
SET name = 'User', code = 'user', description = 'CMS content user'
WHERE code = 'editor';

INSERT INTO roles (id, name, code, description) VALUES
('00000000-0000-0000-0000-000000000203', 'Admin', 'admin', 'CMS administrator')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000201'::uuid, id FROM permissions
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000203'::uuid, id
FROM permissions
WHERE code IN ('content:read', 'content:write', 'media:write', 'contacts:read', 'users:manage')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000202'::uuid, id
FROM permissions
WHERE code IN ('content:read', 'content:write', 'media:write')
ON CONFLICT DO NOTHING;

UPDATE users
SET email = 'irfanzuhdiabdillah@gmail.com',
    name = 'Irfan Zuhdi Abdillah',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000301';
