-- 030_add_rittal_enclosure_types.down.sql
-- Remove the 3 newly added specialized Rittal enclosure types

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/hygienic-design-enclosures',
  'rittal-distributor/atex-hazardous-area-enclosures',
  'rittal-distributor/hmi-consoles-support-arm-systems'
);

COMMIT;
