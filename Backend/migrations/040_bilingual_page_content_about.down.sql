-- Migration: 040_bilingual_page_content_about.down.sql
-- Revert 'about' page content to legacy format

UPDATE pages
SET content = '{"overview":"Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.","vision":"To become a global electrical, automation, and fire alarm services company.","mission":"Build mutual partnerships and deliver every engagement with professional excellence.","values":["Safety","Reliability","Professionalism","Partnership"],"leadership":[],"timeline":[],"certifications":["ISO 9001:2015"]}'::jsonb,
    version = version + 1,
    updated_at = now()
WHERE page_key = 'about' AND deleted_at IS NULL;
