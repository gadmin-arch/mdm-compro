-- Revert Migration 041: Restore enclosure-climate-control as top-level product

UPDATE products
SET 
    parent_id = NULL,
    full_path = 'enclosure-climate-control',
    depth = 0,
    status = 'published',
    sort_order = 5
WHERE slug = 'enclosure-climate-control';

UPDATE products SET sort_order = 6 WHERE slug = 'power-quality' AND parent_id IS NULL;
UPDATE products SET sort_order = 7 WHERE slug = 'fire-alarm-products' AND parent_id IS NULL;
