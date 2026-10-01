-- 043_seed_electrical_distribution_subproducts.down.sql
-- Revert 10 Electrical Distribution & Power Systems sub-products

BEGIN;

DELETE FROM products 
WHERE (id >= '00000000-0000-0000-0000-000000000731' AND id <= '00000000-0000-0000-0000-000000000740')
   OR (full_path LIKE 'electrical-distribution/%' AND slug IN (
        'medium-voltage-switchgear-rmu',
        'power-distribution-transformers',
        'low-voltage-switchboards-mcc',
        'ats-amf-generator-synchronization',
        'power-management-load-control',
        'power-quality-voltage-regulation',
        'ups-dc-power-systems',
        'frequency-conversion-shore-power',
        'protection-metering-neutral-grounding',
        'substation-automation-scada'
      ));

COMMIT;
