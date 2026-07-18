-- 013_source_product_image.up.sql
-- Source image for the Electrical Equipment catalog landing page.

BEGIN;

INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, alt_text, status, metadata)
VALUES ('00000000-0000-0000-0000-000000001222', 'electrical-equipment.jpg', 'seed/multidayamitra/electrical-equipment.jpg', '/uploads/mdm/electrical-equipment.jpg', 'image/jpeg', 76886, 'Electrical equipment installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/products/electrical-equipment/"}')
ON CONFLICT DO NOTHING;

UPDATE products
SET image_url = '/uploads/mdm/electrical-equipment.jpg', updated_at = now()
WHERE slug = 'electrical-equipment';

COMMIT;
