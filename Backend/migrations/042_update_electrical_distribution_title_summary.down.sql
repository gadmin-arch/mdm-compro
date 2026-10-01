-- Revert Migration 042: Restore original Electrical Distribution title and summary

UPDATE products
SET 
    title = E'EN: Electrical Distribution\nID: Distribusi Kelistrikan',
    summary = E'EN: Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.\nID: Peralatan distribusi kelistrikan tegangan menengah & rendah, panel switchboard, transformator, dan sistem proteksi daya.',
    updated_at = now()
WHERE slug = 'electrical-distribution';
