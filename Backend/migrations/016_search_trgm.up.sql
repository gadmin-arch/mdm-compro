-- Trigram indexes so the leading-wildcard ILIKE search filters
-- (title/summary/excerpt) can use an index instead of sequential scans.
-- Guarded: managed/shared Postgres may deny CREATE EXTENSION — in that case
-- the migration still succeeds and search simply stays unindexed.
DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'pg_trgm extension not available (insufficient privilege); skipping trigram indexes';
    END;
END
$$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        CREATE INDEX IF NOT EXISTS services_title_trgm_idx ON services USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS services_summary_trgm_idx ON services USING gin (summary gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON products USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS products_summary_trgm_idx ON products USING gin (summary gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS news_title_trgm_idx ON news USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS news_excerpt_trgm_idx ON news USING gin (excerpt gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS careers_title_trgm_idx ON careers USING gin (title gin_trgm_ops);
        CREATE INDEX IF NOT EXISTS pages_title_trgm_idx ON pages USING gin (title gin_trgm_ops);
    END IF;
END
$$;

-- Scope note: the content::text / specs::text / body::text casts in search
-- queries are intentionally left unindexed — expression GIN indexes on full
-- JSON casts are large and churn on every edit; title/summary/excerpt cover
-- the common search paths.
