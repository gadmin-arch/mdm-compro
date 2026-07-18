-- 014_source_navigation_hierarchy.up.sql
-- Keep public navigation aligned with the hierarchy visible on multidayamitra.co.id.
-- Legacy editorial records are archived (not deleted) when they have no matching
-- menu page in the source site.

BEGIN;

UPDATE services
SET sort_order = CASE slug
  WHEN 'electrical-services' THEN 1
  WHEN 'industrial-automation' THEN 2
  WHEN 'tools' THEN 3
  WHEN 'fire-alarm' THEN 4
  WHEN 'testing-measurement' THEN 1
  WHEN 'maintenance' THEN 2
  WHEN 'construction-installation' THEN 3
  WHEN 'engineering-solution' THEN 4
  WHEN 'secondary-injector-3-and-6-phase-current-voltage' THEN 1
  WHEN 'partial-discharge-analyzer-pd-scan' THEN 2
  WHEN 'contact-resistance-low-ohm-measurement' THEN 3
  WHEN 'micrologic-test-kit-fftk-schneider' THEN 4
  WHEN 'power-quality-analyzer' THEN 5
  WHEN 'circuit-breaker-analyzer' THEN 6
  WHEN 'infrared-thermal-imaging-thermograph' THEN 7
  WHEN 'predictive-maintenance' THEN 1
  WHEN 'preventive-maintenance' THEN 2
  WHEN 'maintenance-contract' THEN 3
  WHEN 'lightning-protection-system' THEN 1
  WHEN 'power-monitoring-system' THEN 2
  WHEN 'active-harmonic-filter' THEN 3
  ELSE sort_order
END,
updated_at = now();

UPDATE services
SET status = 'archived', updated_at = now()
WHERE slug = 'electrical-engineering';

UPDATE products
SET sort_order = CASE slug
  WHEN 'automation-products' THEN 1
  WHEN 'electrical-equipment' THEN 2
  WHEN 'fire-alarm-systems' THEN 3
  WHEN 'rittal-products' THEN 4
  WHEN 'scada-xarrow' THEN 1
  WHEN 'ecostruxure-automation-expert' THEN 2
  WHEN 'electrical-distribution-equipment' THEN 1
  WHEN 'medium-voltage-equipment' THEN 2
  WHEN 'bosch-fire-alarm' THEN 1
  ELSE sort_order
END,
updated_at = now();

UPDATE products
SET status = 'archived', updated_at = now()
WHERE slug IN ('instrumentation', 'testing-equipment', 'protection-relay', 'electrical-panels', 'rittal-enclosures');

COMMIT;
