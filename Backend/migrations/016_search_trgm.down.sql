DROP INDEX IF EXISTS services_title_trgm_idx;
DROP INDEX IF EXISTS services_summary_trgm_idx;
DROP INDEX IF EXISTS products_title_trgm_idx;
DROP INDEX IF EXISTS products_summary_trgm_idx;
DROP INDEX IF EXISTS news_title_trgm_idx;
DROP INDEX IF EXISTS news_excerpt_trgm_idx;
DROP INDEX IF EXISTS careers_title_trgm_idx;
DROP INDEX IF EXISTS pages_title_trgm_idx;
-- The pg_trgm extension is left installed; other objects may rely on it.
