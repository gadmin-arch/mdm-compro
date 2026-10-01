-- Migration 041: Move enclosure-climate-control under Rittal Authorized Distributor
-- Enclosure & Climate Control belongs to Rittal category and is no longer a top-level root category.

UPDATE products
SET 
    parent_id = '00000000-0000-0000-0000-000000000701',
    full_path = 'rittal-distributor/enclosure-climate-control',
    depth = 1,
    status = 'archived'
WHERE slug = 'enclosure-climate-control';

-- Reorder remaining root products
UPDATE products SET sort_order = 5 WHERE slug = 'power-quality' AND parent_id IS NULL;
UPDATE products SET sort_order = 6 WHERE slug = 'fire-alarm-products' AND parent_id IS NULL;
