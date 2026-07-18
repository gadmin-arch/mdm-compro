-- 009_category_hierarchy.up.sql
-- Creates hierarchical parent categories for Services and Products
-- and updates existing records to be children of these parents.

BEGIN;

-- 1. Create Parent Services
INSERT INTO services (id, slug, full_path, title, summary, status, sort_order, depth)
VALUES
    (gen_random_uuid(), 'electrical-services', 'electrical-services', 'Electrical Services', 'Complete electrical lifecycle support for industrial and infrastructure facilities.', 'published', 1, 0),
    (gen_random_uuid(), 'industrial-automation', 'industrial-automation', 'Industrial Automation', 'Advanced control systems, PLC, HMI, and SCADA engineering.', 'published', 2, 0),
    (gen_random_uuid(), 'tools-testing-measurement', 'tools-testing-measurement', 'Tools for Testing & Measurement', 'Precision equipment and tools for electrical testing and condition monitoring.', 'published', 3, 0),
    (gen_random_uuid(), 'fire-alarm-services', 'fire-alarm-services', 'Fire Alarm', 'Comprehensive fire detection and alarm system engineering.', 'published', 4, 0)
ON CONFLICT DO NOTHING;

-- Map existing services to their new parents
UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'electrical-services'),
    depth = 1,
    full_path = 'electrical-services/' || slug
WHERE slug IN ('electrical-engineering', 'maintenance');

UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'industrial-automation'),
    depth = 1,
    full_path = 'industrial-automation/' || slug
WHERE slug IN ('automation');

UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'tools-testing-measurement'),
    depth = 1,
    full_path = 'tools-testing-measurement/' || slug
WHERE slug IN ('testing-measurement');

UPDATE services SET 
    parent_id = (SELECT id FROM services WHERE slug = 'fire-alarm-services'),
    depth = 1,
    full_path = 'fire-alarm-services/' || slug
WHERE slug IN ('fire-alarm');

-- 2. Create Parent Products
INSERT INTO products (id, slug, full_path, title, summary, status, sort_order, depth)
VALUES
    (gen_random_uuid(), 'automation-products', 'automation-products', 'Automation', 'Industrial automation software and hardware.', 'published', 1, 0),
    (gen_random_uuid(), 'electrical-equipment', 'electrical-equipment', 'Electrical Equipment', 'High-quality electrical panels, relays, and testing equipment.', 'published', 2, 0),
    (gen_random_uuid(), 'fire-alarm-systems', 'fire-alarm-systems', 'Fire Alarm System', 'Reliable fire detection and alarm systems.', 'published', 3, 0),
    (gen_random_uuid(), 'rittal-products', 'rittal-products', 'Rittal', 'Premium enclosures and climate control solutions by Rittal.', 'published', 4, 0)
ON CONFLICT DO NOTHING;

-- Map existing products to their new parents
UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'automation-products'),
    depth = 1,
    full_path = 'automation-products/' || slug
WHERE slug IN ('scada-xarrow', 'instrumentation');

UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'electrical-equipment'),
    depth = 1,
    full_path = 'electrical-equipment/' || slug
WHERE slug IN ('testing-equipment', 'protection-relay', 'electrical-panels');

UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'fire-alarm-systems'),
    depth = 1,
    full_path = 'fire-alarm-systems/' || slug
WHERE slug IN ('bosch-fire-alarm');

UPDATE products SET 
    parent_id = (SELECT id FROM products WHERE slug = 'rittal-products'),
    depth = 1,
    full_path = 'rittal-products/' || slug
WHERE slug IN ('rittal-enclosures');

-- 3. Fix Dates and Image URLs
-- Using images downloaded from scraper
UPDATE news SET published_at = '2020-04-18T00:00:00Z', featured_image_url = '/uploads/c38f8d75-6d71-4a31-836c-e9af3d6db596.jpg' WHERE slug = 'energy-monitoring-system-launch';
UPDATE news SET published_at = '2020-06-25T00:00:00Z', featured_image_url = '/uploads/PMS-Network_001.jpg' WHERE slug = '20mw-substation-commissioning-east-java';
UPDATE news SET published_at = '2020-08-10T00:00:00Z', featured_image_url = '/uploads/PM-Partial-Discharge-Analyzer-1.jpg' WHERE slug = 'testing-maintenance-substation';
UPDATE news SET published_at = '2020-08-10T00:00:00Z', featured_image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'transformer-testing-maintenance';

UPDATE careers SET published_at = '2023-01-15T00:00:00Z' WHERE slug = 'senior-electrical-engineer';
UPDATE careers SET published_at = '2023-02-10T00:00:00Z' WHERE slug = 'automation-engineer-plc-scada';
UPDATE careers SET published_at = '2023-03-05T00:00:00Z' WHERE slug = 'testing-commissioning-technician';
UPDATE careers SET published_at = '2023-04-20T00:00:00Z' WHERE slug = 'fire-alarm-system-designer';

UPDATE services SET image_url = '/uploads/IMG_1003-e1585984946182.jpg' WHERE slug = 'electrical-engineering';
UPDATE services SET image_url = '/uploads/Centralized-Mointoring.jpg' WHERE slug = 'automation';
UPDATE services SET image_url = '/uploads/Installation-Cable.jpg' WHERE slug = 'maintenance';
UPDATE services SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'fire-alarm';
UPDATE services SET image_url = '/uploads/PM-Partial-Discharge-Analyzer-1.jpg' WHERE slug = 'testing-measurement';
UPDATE services SET image_url = '/uploads/IMG_1003-e1585984946182.jpg' WHERE slug = 'electrical-services';
UPDATE services SET image_url = '/uploads/Centralized-Mointoring.jpg' WHERE slug = 'industrial-automation';
UPDATE services SET image_url = '/uploads/PM-Partial-Discharge-Analyzer-1.jpg' WHERE slug = 'tools-testing-measurement';
UPDATE services SET image_url = '/uploads/PM-Fire-Alarm-1.jpg' WHERE slug = 'fire-alarm-services';

UPDATE products SET image_url = '/uploads/Relay-Protection-Study.jpg' WHERE slug = 'protection-relay';
UPDATE products SET image_url = '/uploads/M2.jpeg' WHERE slug = 'scada-xarrow';

COMMIT;
