-- 027_bilingual_site_settings.down.sql
-- Rollback bilingual site settings to original English-only

BEGIN;

UPDATE settings
SET value = jsonb_set(
    jsonb_set(
        COALESCE(value, '{}'::jsonb),
        '{tagline}',
        to_jsonb('Electrical · Automation · Fire System'::text)
    ),
    '{footerDescription}',
    to_jsonb('Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.'::text)
),
    updated_at = now()
WHERE key = 'site';

COMMIT;
