-- 019_services_and_solutions_2026.down.sql
BEGIN;
DELETE FROM services WHERE id IS NOT NULL;
COMMIT;
