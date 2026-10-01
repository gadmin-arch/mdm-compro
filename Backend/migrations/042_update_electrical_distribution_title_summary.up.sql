-- Migration 042: Update Electrical Distribution title and summary to Electrical Distribution & Power Systems

UPDATE products
SET 
    title = E'EN: Electrical Distribution & Power Systems\nID: Distribusi Kelistrikan & Sistem Daya',
    summary = E'EN: Medium- and low-voltage equipment, switchboards, transformers, power quality solutions, generator synchronization, protection systems, and substation automation—with engineering, supply, integration, testing, commissioning, and maintenance support.\nID: Peralatan tegangan menengah dan rendah, switchboard, transformator, solusi kualitas daya, sinkronisasi generator, sistem proteksi, dan otomasi gardu induk—didukung layanan engineering, pengadaan, integrasi, pengujian, komisioning, serta pemeliharaan.',
    updated_at = now()
WHERE slug = 'electrical-distribution';
