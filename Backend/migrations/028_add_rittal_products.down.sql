-- 028_add_rittal_products.down.sql
-- Remove the 3 newly added Rittal products

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/it-infrastructure',
  'rittal-distributor/outdoor-enclosures',
  'rittal-distributor/automation-systems'
);

COMMIT;
