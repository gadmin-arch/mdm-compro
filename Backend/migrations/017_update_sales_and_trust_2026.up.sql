-- 017_update_sales_and_trust_2026.up.sql
-- Updates sales phone to +62 821-4007-4122, company founding date to 2012,
-- and enriches trust & compliance data (ISO, SMK3, HSE, Tenaga Ahli, Testing Tools).

BEGIN;

-- 1. Update Site Settings
UPDATE settings
SET value = jsonb_build_object(
    'email', 'info@multidayamitra.co.id',
    'phone', '+62 31 592 1256',
    'fax', '+62 31 591 7845',
    'address', 'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
    'tagline', 'Electrical · Automation · Fire System',
    'footerDescription', 'Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.',
    'socials', jsonb_build_array(
        jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/', 'label', 'Facebook'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/', 'label', 'Instagram'),
        jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/6282140074122', 'label', 'WhatsApp Sales')
    ),
    'salesEmail', 'sales@multidayamitra.co.id',
    'salesPhone', '+62 821-4007-4122',
    'whatsappPhone', '+62 821-4007-4122',
    'hotlinePhone', '+62 821-4007-4122'
),
    updated_at = now()
WHERE key = 'site';

-- 2. Update Contact Page
UPDATE pages
SET content = jsonb_build_object(
    'offices', jsonb_build_array(
        jsonb_build_object(
            'name', 'Head Office (Surabaya)',
            'address', 'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
            'phone', '+62 31 592 1256',
            'fax', '+62 31 591 7845',
            'email', 'info@multidayamitra.co.id',
            'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
        ),
        jsonb_build_object(
            'name', 'Engineering Office & Workshop',
            'address', 'Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia',
            'phone', '+62 821-4007-4122',
            'email', 'info@multidayamitra.co.id',
            'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
        )
    ),
    'email', 'info@multidayamitra.co.id',
    'phone', '+62 31 592 1256',
    'fax', '+62 31 591 7845',
    'salesEmail', 'sales@multidayamitra.co.id',
    'salesPhone', '+62 821-4007-4122',
    'whatsappPhone', '+62 821-4007-4122',
    'hotlinePhone', '+62 821-4007-4122'
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000402';

-- 3. Update About Page
UPDATE pages
SET content = jsonb_build_object(
    'overview', 'PT Multi Daya Mitra was established in 2012 as a multidisciplinary engineering company specializing in electrical systems, industrial automation, fire alarm solutions, and mechanical works. With over 14 years of business experience, 400+ clients across multi-segments, and a dedicated team of over 200 engineers and professionals, we deliver reliable, safe, and integrated engineering solutions across Indonesia and international assignments.',
    'vision', 'Global Electrical, Automation and Fire Alarm Services Company.',
    'mission', 'Mutual Partnership and Professionalism in delivering every engineering engagement.',
    'tagline', 'Always Make an IMPACT - Powering Solution, Creating Impact',
    'culture', 'The company culture in a professional manner brings the company to move fast in achieving every step of its vision.',
    'established', '2012',
    'experienceYears', '14+',
    'clientCount', '400+',
    'teamCount', '200+',
    'hseSlogan', 'Saya Pilih Selamat - Aman Sehat Setiap Saat (Think Safe, Work Safe, Go Home Safe)',
    'hsePillars', jsonb_build_array(
        jsonb_build_object('title', 'Protect Every Person', 'desc', 'Keselamatan dimulai dari diri sendiri'),
        jsonb_build_object('title', 'Care For Each Other', 'desc', 'Peduli hari ini, melindungi masa depan'),
        jsonb_build_object('title', 'Commit To Excellence', 'desc', 'Kerja aman adalah kerja profesional'),
        jsonb_build_object('title', 'Sustain For The Future', 'desc', 'Keselamatan adalah investasi keberlanjutan')
    ),
    'impactValues', jsonb_build_array(
        jsonb_build_object('letter', 'I', 'title', 'Integrity & Innovation', 'desc', 'Building trust through honesty, responsibility, and advancing through modern technology.'),
        jsonb_build_object('letter', 'M', 'title', 'Mastery & Intelligent Problem-Solving', 'desc', 'Deep technical mastery, analytical thinking, precision engineering without assumptions.'),
        jsonb_build_object('letter', 'P', 'title', 'Professional & Trusted Partnership', 'desc', 'Discipline, consistency, and long-term strategic engineering partnership.'),
        jsonb_build_object('letter', 'A', 'title', 'Agile & Adaptable Execution', 'desc', 'Swift response to evolving project conditions and technological changes.'),
        jsonb_build_object('letter', 'C', 'title', 'Commitment to Safety & Customer First', 'desc', 'Safety is non-negotiable, operational continuity, asset reliability.'),
        jsonb_build_object('letter', 'T', 'title', 'Total Engineering Solutions', 'desc', 'End-to-end solutions from design & installation to testing, commissioning & lifecycle maintenance.')
    ),
    'certifications', jsonb_build_array(
        'ISO 9001:2015 (Quality Management System - KAN)',
        'ISO 14001:2015 (Environmental Management System)',
        'ISO 45001:2018 (Occupational Health & Safety - KAN)',
        'Ecovadis Silver (Top 15% Sustainability Rating)',
        'Avetta Member',
        'SBUJTL & IUJPTL ESDM (Izin Usaha Ketenagalistrikan)',
        'Sertifikat Kompetensi Level 6 Tegangan Menengah ESDM',
        'SMK3 Kemenaker',
        'NFPA Member (National Fire Protection Association)',
        'D&B Rating (Dun & Bradstreet)'
    ),
    'licensedExperts', jsonb_build_array(
        'AK3 Listrik (Ahli K3 Listrik Kemnaker)',
        'AK3 Umum (Ahli K3 Umum)',
        'AK3 Kebakaran (Kelas A, B, C, D)',
        'Teknisi Kompetensi Tegangan Menengah ESDM',
        'Licensed Mechanical & Termination Specialists'
    ),
    'testingTools', jsonb_build_array(
        'Partial Discharge Analyzer & Scanner',
        'Omicron Relay & CT/VT Analyzer',
        'Megger Insulation & Earth Tester',
        'Fluke Power Quality Analyzer',
        'Transformer Oil Treatment, BDV & DGA',
        'Breaker Analyzer & Contact Resistance Tester',
        'Secondary Injection Test Sets & Load Bank'
    ),
    'partnerships', jsonb_build_array(
        'Schneider Electric (Authorized Partner)',
        'Rittal (Authorized Partner)',
        'xArrow (Authorized Partner)',
        'Bosch (Authorized Partner)',
        'ABB', 'Siemens', 'Fluke', 'Megger', 'FLIR', 'Danfoss', 'Omron'
    )
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000401';

COMMIT;
