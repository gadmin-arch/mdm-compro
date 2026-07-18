-- Seed system pages so every public landing route (/, /services, /products,
-- /news, /career) has an editable CMS page. Keys must equal the public route
-- segment ('career', not 'careers') so the explicit routes shadow [pageKey].
-- Content is left empty: the landing routes keep their built-in layout until
-- an admin fills in sections via the editor presets.
-- ON CONFLICT DO NOTHING also covers pages_key_active_uniq, so a manually
-- created row with the same key (e.g. an existing 'home' page) is preserved.
INSERT INTO pages (id, page_key, title, content, status, published_at) VALUES
('00000000-0000-0000-0000-000000000403', 'home', 'Home', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000404', 'services', 'Services', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000405', 'products', 'Products', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000406', 'news', 'News & Insights', '{}', 'published', now()),
('00000000-0000-0000-0000-000000000407', 'career', 'Careers', '{}', 'published', now())
ON CONFLICT DO NOTHING;
