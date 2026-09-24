-- 032_add_rittal_climate_control_types.down.sql
-- Remove the 3 newly added specialized Rittal Climate Control products

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/fan-and-filter-units',
  'rittal-distributor/air-to-water-heat-exchangers-chillers',
  'rittal-distributor/enclosure-heaters-dehumidifiers'
);

COMMIT;
