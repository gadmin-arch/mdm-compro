-- 031_add_rittal_power_distribution_types.down.sql
-- Remove the 3 newly added specialized Rittal Power Distribution products

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/riline-compact-busbar-system',
  'rittal-distributor/riline60-modular-busbar-systems',
  'rittal-distributor/maxi-pls-flat-pls-high-current-busbars'
);

COMMIT;
