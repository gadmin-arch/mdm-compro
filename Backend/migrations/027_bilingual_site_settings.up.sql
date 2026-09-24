-- 027_bilingual_site_settings.up.sql
-- Update Site Settings with bilingual tagline and footerDescription

BEGIN;

UPDATE settings
SET value = jsonb_set(
    jsonb_set(
        COALESCE(value, '{}'::jsonb),
        '{tagline}',
        to_jsonb(E'EN: Electrical · Automation · Fire System\nID: Elektrikal · Otomasi · Sistem Fire Alarm'::text)
    ),
    '{footerDescription}',
    to_jsonb(E'EN: Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.\nID: Perusahaan layanan rekayasa elektrikal, otomasi industri, dan sistem fire alarm terkemuka di Indonesia — menghadirkan solusi andal untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur sejak 2012.'::text)
),
    updated_at = now()
WHERE key = 'site';

COMMIT;
