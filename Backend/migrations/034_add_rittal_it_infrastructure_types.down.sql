-- 034_add_rittal_it_infrastructure_types.down.sql
-- Remove the 3 newly added specialized Rittal IT Infrastructure products

BEGIN;

DELETE FROM products WHERE full_path IN (
  'rittal-distributor/tx-cablenet-network-racks',
  'rittal-distributor/intelligent-it-pdu-power-distribution',
  'rittal-distributor/lcp-liquid-cooling-packages'
);

COMMIT;
