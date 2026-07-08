DROP TABLE IF EXISTS auth_codes;

UPDATE users
SET email = 'admin@multidayamitra.co.id',
    name = 'CMS Admin',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000301';

UPDATE roles SET name = 'Super Admin', code = 'super_admin' WHERE code = 'owner';
UPDATE roles SET name = 'Editor', code = 'editor' WHERE code = 'user';
UPDATE roles SET deleted_at = now() WHERE code = 'admin';
UPDATE permissions SET deleted_at = now() WHERE code = 'users:manage';
