-- 033_add_rittal_automation_systems_types.down.sql
-- Remove the 3 newly added specialized Rittal Automation Systems products

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/perforex-lc-laser-machining-centers',
  'rittal-distributor/wire-terminal-automated-wire-processing',
  'rittal-distributor/copper-workstation-busbar-machining'
);

COMMIT;
