-- 018_products_and_partners_hierarchy.down.sql
BEGIN;
DELETE FROM products WHERE id IS NOT NULL;
COMMIT;
