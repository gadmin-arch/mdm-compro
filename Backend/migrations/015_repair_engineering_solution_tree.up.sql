-- 015_repair_engineering_solution_tree.up.sql
-- The engineering-solution row and its children are inserted in one statement
-- by migration 012, so attach the children after that parent exists.

BEGIN;

UPDATE services
SET parent_id = (SELECT id FROM services WHERE slug = 'engineering-solution'),
    depth = 2,
    updated_at = now()
WHERE slug IN ('lightning-protection-system', 'power-monitoring-system', 'active-harmonic-filter');

COMMIT;
