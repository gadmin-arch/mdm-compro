-- Remove only the seeded system page rows (fixed IDs); user-created pages
-- with the same keys are never touched.
DELETE FROM pages WHERE id IN (
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000404',
    '00000000-0000-0000-0000-000000000405',
    '00000000-0000-0000-0000-000000000406',
    '00000000-0000-0000-0000-000000000407'
);
