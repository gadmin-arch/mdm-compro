-- 029_optimize_indexes_and_speed.up.sql
-- Add optimized B-Tree indexes for O(log n) tree traversal, parent-child lookups, and fast pagination

BEGIN;

-- 1. O(log n) tree hierarchy lookups on products & services parent_id
CREATE INDEX IF NOT EXISTS products_parent_id_idx ON products (parent_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS services_parent_id_idx ON services (parent_id) WHERE deleted_at IS NULL;

-- 2. Fast B-Tree indexes for status & sort ordering
CREATE INDEX IF NOT EXISTS products_status_sort_idx ON products (status, sort_order, published_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS services_status_sort_idx ON services (status, sort_order, published_at) WHERE deleted_at IS NULL;

-- 3. Fast B-Tree index for news and career reverse chronological queries
CREATE INDEX IF NOT EXISTS news_status_published_idx ON news (status, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS careers_status_published_idx ON careers (status, published_at DESC) WHERE deleted_at IS NULL;

COMMIT;
