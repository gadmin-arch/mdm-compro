-- 021_bilingual_cable_termination_content.down.sql
-- Rollback to original single-language text

UPDATE services
SET content = '{"blocks":[{"type":"paragraph","data":{"text":"Certified cable jointing and termination specialists using 3M and Raychem kits, followed by VLF / DC Hi-Pot and sheath integrity testing."}}]}'::jsonb
WHERE slug = 'mv-lv-cable-installation-termination';
