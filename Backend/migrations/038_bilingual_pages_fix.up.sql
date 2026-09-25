-- Update system pages in table `pages` with proper bilingual ID and EN titles
-- so admin dashboard and public site display 100% matched bilingual titles.

UPDATE pages
SET title = 'EN: About PT Multi Daya Mitra' || E'\n' || 'ID: Tentang PT Multi Daya Mitra',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'about' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Contact PT Multi Daya Mitra' || E'\n' || 'ID: Hubungi PT Multi Daya Mitra',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'contact' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Home' || E'\n' || 'ID: Beranda',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'home' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Services' || E'\n' || 'ID: Layanan',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'services' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Products' || E'\n' || 'ID: Produk',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'products' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: News & Insights' || E'\n' || 'ID: Berita & Wawasan',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'news' AND deleted_at IS NULL;

UPDATE pages
SET title = 'EN: Careers' || E'\n' || 'ID: Karir',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'career' AND deleted_at IS NULL;
