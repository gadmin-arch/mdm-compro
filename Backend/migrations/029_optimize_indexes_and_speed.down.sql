-- 029_optimize_indexes_and_speed.down.sql
-- Rollback optimization B-Tree indexes

BEGIN;

DROP INDEX IF EXISTS products_parent_id_idx;
DROP INDEX IF EXISTS services_parent_id_idx;
DROP INDEX IF EXISTS products_status_sort_idx;
DROP INDEX IF EXISTS services_status_sort_idx;
DROP INDEX IF EXISTS news_status_published_idx;
DROP INDEX IF EXISTS careers_status_published_idx;

COMMIT;
