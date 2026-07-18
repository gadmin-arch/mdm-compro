-- 011_seed_source_media.up.sql
-- Local copies of selected public assets from multidayamitra.co.id.
-- The files live in FrontEnd/public/uploads so seeded records do not depend on
-- the source site's hotlink policy.

BEGIN;

INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, alt_text, status, metadata) VALUES
('00000000-0000-0000-0000-000000000951', 'hero-project.jpg', 'seed/multidayamitra/hero-project.jpg', '/uploads/hero-project.jpg', 'image/jpeg', 114297, 'PT Multi Daya Mitra project team at an industrial site', 'ready', '{"source":"https://multidayamitra.co.id/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000952', 'automation-project.jpg', 'seed/multidayamitra/automation-project.jpg', '/uploads/automation-project.jpg', 'image/jpeg', 77279, 'Industrial automation project', 'ready', '{"source":"https://multidayamitra.co.id/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000953', 'M2.jpeg', 'seed/multidayamitra/M2.jpeg', '/uploads/M2.jpeg', 'image/jpeg', 43859, 'Industrial automation solution', 'ready', '{"source":"https://multidayamitra.co.id/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000954', 'PM-Fire-Alarm-1.jpg', 'seed/multidayamitra/PM-Fire-Alarm-1.jpg', '/uploads/PM-Fire-Alarm-1.jpg', 'image/jpeg', 93201, 'Fire alarm system', 'ready', '{"source":"https://multidayamitra.co.id/services/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000955', 'PM-Partial-Discharge-Analyzer-1.jpg', 'seed/multidayamitra/PM-Partial-Discharge-Analyzer-1.jpg', '/uploads/PM-Partial-Discharge-Analyzer-1.jpg', 'image/jpeg', 39934, 'Partial discharge analyzer', 'ready', '{"source":"https://multidayamitra.co.id/services/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000956', 'PMS-Network_001.jpg', 'seed/multidayamitra/PMS-Network_001.jpg', '/uploads/PMS-Network_001.jpg', 'image/jpeg', 46770, 'Power monitoring system network', 'ready', '{"source":"https://multidayamitra.co.id/services/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000957', 'Rittal.png', 'seed/multidayamitra/Rittal.png', '/uploads/Rittal.png', 'image/png', 2412, 'Rittal enclosure systems', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000958', 'Schneider-Electric.png', 'seed/multidayamitra/Schneider-Electric.png', '/uploads/Schneider-Electric.png', 'image/png', 37320, 'Schneider Electric electrical equipment', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000959', 'xarrow.jpg', 'seed/multidayamitra/xarrow.jpg', '/uploads/xarrow.jpg', 'image/jpeg', 5638, 'xArrow SCADA software', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb),
('00000000-0000-0000-0000-000000000960', 'BOSCH.png', 'seed/multidayamitra/BOSCH.png', '/uploads/BOSCH.png', 'image/png', 10835, 'Bosch fire alarm systems', 'ready', '{"source":"https://multidayamitra.co.id/products/","seed":true}'::jsonb)
ON CONFLICT DO NOTHING;

UPDATE services
SET image_url = CASE slug
  WHEN 'electrical-services' THEN '/uploads/hero-project.jpg'
  WHEN 'electrical-engineering' THEN '/uploads/hero-project.jpg'
  WHEN 'industrial-automation' THEN '/uploads/automation-project.jpg'
  WHEN 'automation' THEN '/uploads/automation-project.jpg'
  WHEN 'maintenance' THEN '/uploads/PMS-Network_001.jpg'
  WHEN 'tools-testing-measurement' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'testing-measurement' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'fire-alarm-services' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  WHEN 'fire-alarm' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  ELSE image_url
END,
gallery = CASE slug
  WHEN 'electrical-services' THEN '[{"url":"/uploads/hero-project.jpg","altText":"PT Multi Daya Mitra project team","mimeType":"image/jpeg"}]'::jsonb
  WHEN 'industrial-automation' THEN '[{"url":"/uploads/automation-project.jpg","altText":"Industrial automation project","mimeType":"image/jpeg"}]'::jsonb
  WHEN 'tools-testing-measurement' THEN '[{"url":"/uploads/PM-Partial-Discharge-Analyzer-1.jpg","altText":"Partial discharge analyzer","mimeType":"image/jpeg"}]'::jsonb
  WHEN 'fire-alarm-services' THEN '[{"url":"/uploads/PM-Fire-Alarm-1.jpg","altText":"Fire alarm system","mimeType":"image/jpeg"}]'::jsonb
  ELSE gallery
END,
updated_at = now()
WHERE slug IN ('electrical-services', 'electrical-engineering', 'industrial-automation', 'automation', 'maintenance', 'tools-testing-measurement', 'testing-measurement', 'fire-alarm-services', 'fire-alarm');

UPDATE products
SET image_url = CASE slug
  WHEN 'automation-products' THEN '/uploads/M2.jpeg'
  WHEN 'scada-xarrow' THEN '/uploads/xarrow.jpg'
  WHEN 'instrumentation' THEN '/uploads/PMS-Network_001.jpg'
  WHEN 'electrical-equipment' THEN '/uploads/Schneider-Electric.png'
  WHEN 'testing-equipment' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'protection-relay' THEN '/uploads/Schneider-Electric.png'
  WHEN 'electrical-panels' THEN '/uploads/Schneider-Electric.png'
  WHEN 'fire-alarm-systems' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  WHEN 'bosch-fire-alarm' THEN '/uploads/BOSCH.png'
  WHEN 'rittal-products' THEN '/uploads/Rittal.png'
  WHEN 'rittal-enclosures' THEN '/uploads/Rittal.png'
  ELSE image_url
END,
updated_at = now()
WHERE slug IN ('automation-products', 'scada-xarrow', 'instrumentation', 'electrical-equipment', 'testing-equipment', 'protection-relay', 'electrical-panels', 'fire-alarm-systems', 'bosch-fire-alarm', 'rittal-products', 'rittal-enclosures');

UPDATE news
SET featured_image_url = CASE slug
  WHEN 'energy-monitoring-system-launch' THEN '/uploads/PMS-Network_001.jpg'
  WHEN '20mw-substation-commissioning-east-java' THEN '/uploads/hero-project.jpg'
  WHEN 'transformer-testing-maintenance' THEN '/uploads/hero-project.jpg'
  WHEN 'effects-of-harmonic-distortion' THEN '/uploads/PMS-Network_001.jpg'
  WHEN 'partial-discharge-analyzer' THEN '/uploads/PM-Partial-Discharge-Analyzer-1.jpg'
  WHEN 'centralized-fire-alarm-monitoring' THEN '/uploads/PM-Fire-Alarm-1.jpg'
  ELSE featured_image_url
END,
updated_at = now()
WHERE slug IN ('energy-monitoring-system-launch', '20mw-substation-commissioning-east-java', 'transformer-testing-maintenance', 'effects-of-harmonic-distortion', 'partial-discharge-analyzer', 'centralized-fire-alarm-monitoring');

COMMIT;
