-- 035_add_rittal_accessories_types.down.sql
-- Remove the 3 newly added specialized Rittal System Accessories products

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/led-system-lights',
  'rittal-distributor/base-plinth-system-vx',
  'rittal-distributor/cable-entry-systems-gland-plates'
);

COMMIT;
