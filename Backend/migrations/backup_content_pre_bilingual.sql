-- BACKUP BEFORE BILINGUAL ENVELOPE SEPARATION
-- Date: 2026-09-24T13:52:00+07:00

-- Snapshot of services table row for mv-lv-cable-installation-termination:
-- slug: mv-lv-cable-installation-termination
-- title: MV & LV Cable Installation & Termination
-- summary: Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.
-- content: '{"blocks":[{"type":"paragraph","data":{"text":"Certified cable jointing and termination specialists using 3M and Raychem kits, followed by VLF / DC Hi-Pot and sheath integrity testing."}}]}'::jsonb
-- image_url: /uploads/mdm/electrical-equipment.jpg

-- To restore original state if ever required:
UPDATE services 
SET 
  title = 'MV & LV Cable Installation & Termination',
  summary = 'Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.',
  content = '{"blocks":[{"type":"paragraph","data":{"text":"Certified cable jointing and termination specialists using 3M and Raychem kits, followed by VLF / DC Hi-Pot and sheath integrity testing."}}]}'::jsonb
WHERE slug = 'mv-lv-cable-installation-termination';
