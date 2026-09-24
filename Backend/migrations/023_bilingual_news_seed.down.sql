-- 023_bilingual_news_seed.down.sql
-- Rollback bilingual news changes (restore monolingual titles)

BEGIN;

UPDATE news_categories SET name = 'Product & Technology' WHERE slug = 'product-technology' OR slug = 'products' OR name ILIKE '%Product%';
UPDATE news_categories SET name = 'Service' WHERE slug = 'service' OR slug = 'services' OR name ILIKE '%Service%';
UPDATE news_categories SET name = 'Company' WHERE slug = 'company' OR slug = 'company-news' OR name ILIKE '%Company%';
UPDATE news_categories SET name = 'Insight' WHERE slug = 'insight' OR slug = 'insights' OR name ILIKE '%Insight%';
UPDATE news_categories SET name = 'Project' WHERE slug = 'project' OR slug = 'projects' OR name ILIKE '%Project%';

COMMIT;
