UPDATE pages
SET title = 'About PT Multi Daya Mitra',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'about' AND deleted_at IS NULL;

UPDATE pages
SET title = 'Contact PT Multi Daya Mitra',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'contact' AND deleted_at IS NULL;

UPDATE pages
SET title = 'Home',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'home' AND deleted_at IS NULL;

UPDATE pages
SET title = 'Services',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'services' AND deleted_at IS NULL;

UPDATE pages
SET title = 'Products',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'products' AND deleted_at IS NULL;

UPDATE pages
SET title = 'News & Insights',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'news' AND deleted_at IS NULL;

UPDATE pages
SET title = 'Careers',
    version = version + 1,
    updated_at = now()
WHERE page_key = 'career' AND deleted_at IS NULL;
