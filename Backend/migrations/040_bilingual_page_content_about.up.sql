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
      'impactValues', jsonb_build_array(
        jsonb_build_object(
          'letter', 'I',
          'title', 'EN: Integrity & Innovation' || E'\n' || 'ID: Integritas & Inovasi',
          'desc', 'EN: Building trust through honesty and responsibility while advancing with modern, up-to-date technologies.' || E'\n' || 'ID: Membangun kepercayaan melalui kejujuran dan tanggung jawab seraya terus berinovasi dengan teknologi termutakhir.'
        ),
        jsonb_build_object(
          'letter', 'M',
          'title', 'EN: Mastery & Intelligent Problem-Solving' || E'\n' || 'ID: Keahlian Teknis & Solusi Cerdas',
          'desc', 'EN: Deep technical mastery in electrical and automation systems with structured precision engineering — not assumptions.' || E'\n' || 'ID: Penguasaan teknis mendalam di bidang sistem kelistrikan dan otomasi melalui rekayasa presisi yang terstruktur — bukan asumsi.'
        ),
        jsonb_build_object(
          'letter', 'P',
          'title', 'EN: Professional & Trusted Partnership' || E'\n' || 'ID: Kemitraan Profesional & Terpercaya',
          'desc', 'EN: Discipline, consistency, and high execution standards that position us as a strategic long-term partner.' || E'\n' || 'ID: Disiplin, konsistensi, dan standar eksekusi tinggi yang menempatkan kami sebagai mitra strategis jangka panjang.'
        ),
        jsonb_build_object(
          'letter', 'A',
          'title', 'EN: Agile & Adaptable Execution' || E'\n' || 'ID: Eksekusi Tangkas & Adaptif',
          'desc', 'EN: Swift, resilient response to evolving site dynamics, operational challenges, and technological demands.' || E'\n' || 'ID: Tanggap dan tangguh dalam merespons dinamika lapangan yang berkembang, tantangan operasional, dan tuntutan teknologi.'
        ),
        jsonb_build_object(
          'letter', 'C',
          'title', 'EN: Commitment to Safety & Customer First' || E'\n' || 'ID: Komitmen Keselamatan (K3) & Utamakan Pelanggan',
          'desc', 'EN: Safety is non-negotiable. Prioritizing operational continuity, asset reliability, and zero-accident culture.' || E'\n' || 'ID: Keselamatan tidak dapat ditawar. Memprioritaskan kontinuitas operasional, keandalan aset, dan budaya nihil kecelakaan kerja.'
        ),
        jsonb_build_object(
          'letter', 'T',
          'title', 'EN: Total Engineering Solutions' || E'\n' || 'ID: Solusi Rekayasa Teknik Menyeluruh',
          'desc', 'EN: End-to-end coverage from design, assembly, and installation to testing, commissioning, and lifecycle maintenance.' || E'\n' || 'ID: Cakupan menyeluruh dari perancangan, perakitan, dan instalasi hingga pengujian, commissioning, serta pemeliharaan siklus hidup aset.'
        )
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
