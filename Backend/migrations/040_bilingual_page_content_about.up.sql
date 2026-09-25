-- Migration: 040_bilingual_page_content_about.up.sql
-- Update 'about' page content in `pages` table to full bilingual (EN & ID) format
-- so both public site and CMS admin have 100% matched bilingual fields.

UPDATE pages
SET content = jsonb_build_object(
      'overview', 'EN: Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.' || E'\n' || 'ID: Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.',
      'vision', 'EN: Global Electrical, Automation and Fire Alarm Services Company.' || E'\n' || 'ID: Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.',
      'mission', 'EN: Mutual Partnership and Professionalism in delivering every engineering engagement.' || E'\n' || 'ID: Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.',
      'tagline', 'EN: Always Make an IMPACT - Powering Solution, Creating Impact' || E'\n' || 'ID: Always Make an IMPACT - Solusi Kelistrikan Andal, Menciptakan Dampak Nyata',
      'culture', 'EN: The company culture in a professional manner brings the company to move fast in achieving every step of its vision.' || E'\n' || 'ID: Budaya perusahaan yang menjunjung tinggi profesionalisme mendorong gerak cepat perusahaan dalam mewujudkan setiap langkah visinya.',
      'established', '2012',
      'experienceYears', '14+',
      'clientCount', '400+',
      'teamCount', '200+',
      'values', jsonb_build_array(
        'EN: Integrity & Innovation' || E'\n' || 'ID: Integritas & Inovasi',
        'EN: Mastery & Intelligent Problem-Solving' || E'\n' || 'ID: Keahlian Teknis & Solusi Cerdas',
        'EN: Professional & Trusted Partnership' || E'\n' || 'ID: Kemitraan Profesional & Terpercaya',
        'EN: Agile & Adaptable Execution' || E'\n' || 'ID: Eksekusi Tangkas & Adaptif',
        'EN: Commitment to Safety & Customer First' || E'\n' || 'ID: Komitmen Keselamatan (K3) & Utamakan Pelanggan',
        'EN: Total Engineering Solutions' || E'\n' || 'ID: Solusi Rekayasa Teknik Menyeluruh'
      ),
      'certifications', jsonb_build_array(
        'ISO 9001:2015 (Quality Management - KAN)',
        'ISO 14001:2015 (Environmental Management)',
        'ISO 45001:2018 (Occupational Health & Safety - KAN)',
        'Ecovadis Silver (Top 15% Global Sustainability)',
        'Avetta Member',
        'SBUJTL & IUJPTL ESDM',
        'Sertifikat Kompetensi Level 6 Tegangan Menengah ESDM',
        'SMK3 Kemenaker',
        'NFPA Member',
        'D&B Rating'
      )
    ),
    version = version + 1,
    updated_at = now()
WHERE page_key = 'about' AND deleted_at IS NULL;
