-- 043_seed_electrical_distribution_subproducts.up.sql
-- Add 10 Electrical Distribution & Power Systems sub-products

BEGIN;

-- 1. Medium Voltage Switchgear & RMU
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000731',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'medium-voltage-switchgear-rmu',
  'electrical-distribution/medium-voltage-switchgear-rmu',
  E'EN: Medium Voltage Switchgear & RMU\nID: Switchgear Tegangan Menengah & RMU',
  E'EN: Medium-voltage switchgear, ring main units, and MV distribution panels.\nID: Switchgear tegangan menengah, ring main unit (RMU), dan panel distribusi TM.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Medium Voltage Switchgear & Ring Main Units (RMU)</h3>\n<p>PT Multi Daya Mitra engineers, supplies, and commissions medium-voltage switchgear, gas-insulated ring main units (RMU), and MV distribution panels for industrial plants, utility substations, and critical commercial facilities up to 36 kV.</p>\n<h3>Air-Insulated & Gas-Insulated MV Switchgear</h3>\n<p>Equipped with high-performance Vacuum Circuit Breakers (VCB), motorized rack-in mechanisms, comprehensive mechanical interlocks, and digital protection relays. Designed with internal arc containment (IAC AFLR) to ensure maximum operator safety under short-circuit conditions.</p>\n<h3>Compact Ring Main Units (RMU)</h3>\n<p>Hermetically sealed stainless steel tanks provide complete environmental immunity against moisture, dust, and flooding in compact distribution substations and industrial ring networks.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Switchgear Tegangan Menengah & Ring Main Unit (RMU)</h3>\n<p>PT Multi Daya Mitra merancang, memasok, dan mengomisioning switchgear tegangan menengah (TM), gas-insulated ring main unit (RMU), serta panel distribusi TM untuk kawasan industri, gardu distribusi PLN/utilitas, dan fasilitas komersial hingga 36 kV.</p>\n<h3>Switchgear TM Berisolasi Udara & Gas</h3>\n<p>Dilengkapi Vacuum Circuit Breaker (VCB) andal, mekanisme rack-in bermotor, interlocking mekanis komprehensif, dan relai proteksi digital. Memenuhi klasifikasi ketahanan busur api internal (IAC AFLR) guna menjamin keselamatan operator saat terjadi gangguan hubung singkat.</p>\n<h3>Ring Main Unit (RMU) Kompak</h3>\n<p>Tangki baja antikarat kedap udara (hermetically sealed) memberikan perlindungan total terhadap kelembapan, debu, dan korosi untuk gardu distribusi ring dan jaringan industri kompak.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Medium Voltage Switchgear & Ring Main Units (RMU)</h3>\n<p>PT Multi Daya Mitra engineers, supplies, and commissions medium-voltage switchgear, gas-insulated ring main units (RMU), and MV distribution panels for industrial plants, utility substations, and critical commercial facilities up to 36 kV.</p>\n<h3>Air-Insulated & Gas-Insulated MV Switchgear</h3>\n<p>Equipped with high-performance Vacuum Circuit Breakers (VCB), motorized rack-in mechanisms, comprehensive mechanical interlocks, and digital protection relays. Designed with internal arc containment (IAC AFLR) to ensure maximum operator safety under short-circuit conditions.</p>\n<h3>Compact Ring Main Units (RMU)</h3>\n<p>Hermetically sealed stainless steel tanks provide complete environmental immunity against moisture, dust, and flooding in compact distribution substations and industrial ring networks.</p>\nID: <h3>Switchgear Tegangan Menengah & Ring Main Unit (RMU)</h3>\n<p>PT Multi Daya Mitra merancang, memasok, dan mengomisioning switchgear tegangan menengah (TM), gas-insulated ring main unit (RMU), serta panel distribusi TM untuk kawasan industri, gardu distribusi PLN/utilitas, dan fasilitas komersial hingga 36 kV.</p>\n<h3>Switchgear TM Berisolasi Udara & Gas</h3>\n<p>Dilengkapi Vacuum Circuit Breaker (VCB) andal, mekanisme rack-in bermotor, interlocking mekanis komprehensif, dan relai proteksi digital. Memenuhi klasifikasi ketahanan busur api internal (IAC AFLR) guna menjamin keselamatan operator saat terjadi gangguan hubung singkat.</p>\n<h3>Ring Main Unit (RMU) Kompak</h3>\n<p>Tangki baja antikarat kedap udara (hermetically sealed) memberikan perlindungan total terhadap kelembapan, debu, dan korosi untuk gardu distribusi ring dan jaringan industri kompak.</p>"}]}'::jsonb,
  '{"EN: Rated Voltage\nID: Tegangan Pengenal":"12 kV / 24 kV / 36 kV","EN: Rated Current\nID: Arus Pengenal":"630A - 3150A","EN: Breaking Capacity\nID: Kapasitas Pemutusan":"Up to 31.5 kA / 3s","EN: Technology\nID: Teknologi":"Vacuum Circuit Breaker (VCB) & SF6 Gas-Insulated RMU","EN: Standards\nID: Standar Acuan":"IEC 62271-200, IEC 62271-100, SPLN"}'::jsonb,
  '/uploads/mdm/circuit-breaker.jpg',
  'published',
  now(),
  1,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 2. Power & Distribution Transformers
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000732',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'power-distribution-transformers',
  'electrical-distribution/power-distribution-transformers',
  E'EN: Power & Distribution Transformers\nID: Transformator Daya & Distribusi',
  E'EN: Power and distribution transformers, including oil-immersed and dry-type/cast-resin transformers.\nID: Transformator daya dan distribusi, mencakup tipe terendam minyak dan tipe kering (cast-resin).',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Power & Distribution Transformers</h3>\n<p>We supply, install, and test high-efficiency power and distribution transformers engineered to withstand heavy cyclic loading, harmonic heating, and harsh industrial environments with minimal losses.</p>\n<h3>Oil-Immersed Transformers (Hermetically Sealed & Conservator)</h3>\n<p>Rugged mineral oil or synthetic ester insulated transformers featuring corrugated tanks or external detachable radiators, equipped with Buchholz relays, pressure relief valves, and oil temperature gauges.</p>\n<h3>Cast-Resin Dry-Type Transformers</h3>\n<p>Flame-retardant epoxy cast-resin transformers engineered for indoor installations, hospitals, high-rise buildings, and underground substations where fire safety, environmental protection, and zero oil leakage are mandatory.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Transformator Daya & Distribusi</h3>\n<p>Kami memasok, memasang, dan menguji transformator daya dan distribusi berefisiensi tinggi yang dirancang untuk menahan beban siklik berat, pemanasan harmonisa, dan lingkungan industri ekstrem dengan rugi-daya minimal.</p>\n<h3>Trafo Terendam Minyak (Hermetically Sealed & Konservator)</h3>\n<p>Trafo berinsulasi minyak mineral atau fluida ester sintetis dengan tangki bergelombang atau radiator eksternal, dilengkapi relai Buchholz, katup pelepas tekanan (pressure relief valve), dan termometer suhu minyak.</p>\n<h3>Trafo Kering Cast-Resin (Dry-Type)</h3>\n<p>Transformator resin cor epoksi tahan api untuk instalasi dalam gedung, rumah sakit, gedung bertingkat, dan gardu bawah tanah yang mengutamakan keselamatan kebakaran tinggi dan bebas risiko kebocoran oli.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Power & Distribution Transformers</h3>\n<p>We supply, install, and test high-efficiency power and distribution transformers engineered to withstand heavy cyclic loading, harmonic heating, and harsh industrial environments with minimal losses.</p>\n<h3>Oil-Immersed Transformers (Hermetically Sealed & Conservator)</h3>\n<p>Rugged mineral oil or synthetic ester insulated transformers featuring corrugated tanks or external detachable radiators, equipped with Buchholz relays, pressure relief valves, and oil temperature gauges.</p>\n<h3>Cast-Resin Dry-Type Transformers</h3>\n<p>Flame-retardant epoxy cast-resin transformers engineered for indoor installations, hospitals, high-rise buildings, and underground substations where fire safety, environmental protection, and zero oil leakage are mandatory.</p>\nID: <h3>Transformator Daya & Distribusi</h3>\n<p>Kami memasok, memasang, dan menguji transformator daya dan distribusi berefisiensi tinggi yang dirancang untuk menahan beban siklik berat, pemanasan harmonisa, dan lingkungan industri ekstrem dengan rugi-daya minimal.</p>\n<h3>Trafo Terendam Minyak (Hermetically Sealed & Konservator)</h3>\n<p>Trafo berinsulasi minyak mineral atau fluida ester sintetis dengan tangki bergelombang atau radiator eksternal, dilengkapi relai Buchholz, katup pelepas tekanan (pressure relief valve), dan termometer suhu minyak.</p>\n<h3>Trafo Kering Cast-Resin (Dry-Type)</h3>\n<p>Transformator resin cor epoksi tahan api untuk instalasi dalam gedung, rumah sakit, gedung bertingkat, dan gardu bawah tanah yang mengutamakan keselamatan kebakaran tinggi dan bebas risiko kebocoran oli.</p>"}]}'::jsonb,
  '{"EN: Capacity Range\nID: Rentang Kapasitas":"100 kVA to 50 MVA","EN: Primary Voltage\nID: Tegangan Primer":"Up to 36 kV / 70 kV / 150 kV","EN: Cooling Types\nID: Metode Pendinginan":"ONAN / ONAF / AN / AF","EN: Insulation Types\nID: Jenis Insulasi":"Mineral Oil / Ester Fluid / Cast Resin Epoxy (Class F/H)","EN: Standards\nID: Standar Acuan":"IEC 60076, SPLN D3.002-1, IEEE C57"}'::jsonb,
  '/uploads/mdm/construction-installation.jpg',
  'published',
  now(),
  2,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 3. Low Voltage Switchboards & Motor Control Centers
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000733',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'low-voltage-switchboards-mcc',
  'electrical-distribution/low-voltage-switchboards-mcc',
  E'EN: Low Voltage Switchboards & Motor Control Centers\nID: Panel Distribusi Tegangan Rendah & Motor Control Center',
  E'EN: Main and sub-distribution boards, motor control centers, motor starter panels, and VFD panels.\nID: Panel distribusi utama dan sub-distribusi, motor control center (MCC), panel starter motor, dan panel VFD.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Low Voltage Switchboards & Motor Control Centers (MCC)</h3>\n<p>Custom-built Low Voltage Main Distribution Panels (LVMDP), sub-distribution switchboards, and intelligent Motor Control Centers (MCC) delivering reliable power distribution and motor management across industrial plants.</p>\n<h3>Main & Sub-Distribution Switchboards</h3>\n<p>Configured with Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) up to 6300A, digital energy monitoring, modular Form 4b compartmentation, and integrated surge protection.</p>\n<h3>Motor Control Centers & VFD Panels</h3>\n<p>Fixed and withdrawable motor starter panels incorporating Direct-On-Line (DOL), Star-Delta, Soft Starters, and Variable Frequency Drives (VFD) with complete thermal overload and short-circuit coordination.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Panel Distribusi Tegangan Rendah & Motor Control Center (MCC)</h3>\n<p>Low Voltage Main Distribution Panel (LVMDP), panel sub-distribusi, serta Motor Control Center (MCC) cerdas yang dirakit khusus untuk penyaluran daya andal dan manajemen motor listrik di pabrik industri.</p>\n<h3>Panel Distribusi Utama (LVMDP) & Sub-Distribusi</h3>\n<p>Dikonfigurasi dengan Air Circuit Breaker (ACB) dan MCCB hingga 6300A, pemantauan energi digital, pemisahan modular Form 4b, serta proteksi surja petir (SPD) terintegrasi.</p>\n<h3>Motor Control Center (MCC) & Panel Inverter VFD</h3>\n<p>Panel starter motor tipe fixed dan withdrawable yang mengintegrasikan starter Direct-On-Line (DOL), Star-Delta, Soft Starter, dan inverter Variable Frequency Drive (VFD) dengan koordinasi proteksi beban lebih presisi.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Low Voltage Switchboards & Motor Control Centers (MCC)</h3>\n<p>Custom-built Low Voltage Main Distribution Panels (LVMDP), sub-distribution switchboards, and intelligent Motor Control Centers (MCC) delivering reliable power distribution and motor management across industrial plants.</p>\n<h3>Main & Sub-Distribution Switchboards</h3>\n<p>Configured with Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) up to 6300A, digital energy monitoring, modular Form 4b compartmentation, and integrated surge protection.</p>\n<h3>Motor Control Centers & VFD Panels</h3>\n<p>Fixed and withdrawable motor starter panels incorporating Direct-On-Line (DOL), Star-Delta, Soft Starters, and Variable Frequency Drives (VFD) with complete thermal overload and short-circuit coordination.</p>\nID: <h3>Panel Distribusi Tegangan Rendah & Motor Control Center (MCC)</h3>\n<p>Low Voltage Main Distribution Panel (LVMDP), panel sub-distribusi, serta Motor Control Center (MCC) cerdas yang dirakit khusus untuk penyaluran daya andal dan manajemen motor listrik di pabrik industri.</p>\n<h3>Panel Distribusi Utama (LVMDP) & Sub-Distribusi</h3>\n<p>Dikonfigurasi dengan Air Circuit Breaker (ACB) dan MCCB hingga 6300A, pemantauan energi digital, pemisahan modular Form 4b, serta proteksi surja petir (SPD) terintegrasi.</p>\n<h3>Motor Control Center (MCC) & Panel Inverter VFD</h3>\n<p>Panel starter motor tipe fixed dan withdrawable yang mengintegrasikan starter Direct-On-Line (DOL), Star-Delta, Soft Starter, dan inverter Variable Frequency Drive (VFD) dengan koordinasi proteksi beban lebih presisi.</p>"}]}'::jsonb,
  '{"EN: Rated Current\nID: Arus Pengenal":"Up to 6300A (99.9% Cu-ETP Busbar)","EN: Rated Voltage\nID: Tegangan Pengenal":"380V / 400V / 415V / 690V AC","EN: Short-Circuit Rating\nID: Ketahanan Hubung Singkat":"Up to 100 kA / 1s","EN: Internal Segregation\nID: Bentuk Pemisahan":"Form 2b, Form 3b, Form 4a, Form 4b","EN: Standards\nID: Standar Acuan":"IEC 61439-1/2, SNI"}'::jsonb,
  '/uploads/mdm/distribution-panel.jpg',
  'published',
  now(),
  3,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 4. ATS, AMF & Generator Synchronization
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000734',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'ats-amf-generator-synchronization',
  'electrical-distribution/ats-amf-generator-synchronization',
  E'EN: ATS, AMF & Generator Synchronization\nID: ATS, AMF & Sinkronisasi Genset',
  E'EN: Automatic transfer switches, automatic mains failure panels, generator control, and synchronization panels.\nID: Sakelar transfer otomatis (ATS), panel kegagalan jala-jala otomatis (AMF), kontrol generator, dan panel sinkronisasi.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>ATS, AMF & Generator Synchronization Systems</h3>\n<p>Engineered to ensure uninterrupted power availability during mains failure. Automatically manages standby diesel or gas generators and synchronizes multiple power sources with zero interruption to mission-critical operations.</p>\n<h3>Automatic Transfer Switch (ATS) & AMF Panels</h3>\n<p>Equipped with intelligent microprocessors and motorized transfer switches that continuously monitor mains voltage and frequency, automatically initiating generator startup and load transfer within seconds of utility loss.</p>\n<h3>Multi-Generator Paralleling & Synchronization</h3>\n<p>Automated multi-generator paralleling with automatic kW and kVAr load sharing, load-dependent start/stop scheduling, and closed-transition return to utility power without momentary blackouts.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Sistem ATS, AMF & Sinkronisasi Genset</h3>\n<p>Dirancang untuk memastikan pasokan daya berkelanjutan saat suplai PLN terputus. Mengatur genset diesel/gas secara otomatis dan menyinkronkan beberapa sumber daya tanpa mengganggu operasional fasilitas penting.</p>\n<h3>Panel Automatic Transfer Switch (ATS) & AMF</h3>\n<p>Dilengkapi mikroprosesor cerdas dan sakelar transfer bermotor yang terus memantau tegangan dan frekuensi PLN, secara otomatis menyalakan genset dan mengalihkan beban dalam hitungan detik saat terjadi pemadaman.</p>\n<h3>Sinkronisasi & Paralel Multi-Genset Otomatis</h3>\n<p>Sinkronisasi multi-genset otomatis dengan pembagian beban aktif (kW) dan reaktif (kVAr), penjadwalan start/stop sesuai kebutuhan beban, serta transisi tertutup kembali ke PLN tanpa kedipan daya.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>ATS, AMF & Generator Synchronization Systems</h3>\n<p>Engineered to ensure uninterrupted power availability during mains failure. Automatically manages standby diesel or gas generators and synchronizes multiple power sources with zero interruption to mission-critical operations.</p>\n<h3>Automatic Transfer Switch (ATS) & AMF Panels</h3>\n<p>Equipped with intelligent microprocessors and motorized transfer switches that continuously monitor mains voltage and frequency, automatically initiating generator startup and load transfer within seconds of utility loss.</p>\n<h3>Multi-Generator Paralleling & Synchronization</h3>\n<p>Automated multi-generator paralleling with automatic kW and kVAr load sharing, load-dependent start/stop scheduling, and closed-transition return to utility power without momentary blackouts.</p>\nID: <h3>Sistem ATS, AMF & Sinkronisasi Genset</h3>\n<p>Dirancang untuk memastikan pasokan daya berkelanjutan saat suplai PLN terputus. Mengatur genset diesel/gas secara otomatis dan menyinkronkan beberapa sumber daya tanpa mengganggu operasional fasilitas penting.</p>\n<h3>Panel Automatic Transfer Switch (ATS) & AMF</h3>\n<p>Dilengkapi mikroprosesor cerdas dan sakelar transfer bermotor yang terus memantau tegangan dan frekuensi PLN, secara otomatis menyalakan genset dan mengalihkan beban dalam hitungan detik saat terjadi pemadaman.</p>\n<h3>Sinkronisasi & Paralel Multi-Genset Otomatis</h3>\n<p>Sinkronisasi multi-genset otomatis dengan pembagian beban aktif (kW) dan reaktif (kVAr), penjadwalan start/stop sesuai kebutuhan beban, serta transisi tertutup kembali ke PLN tanpa kedipan daya.</p>"}]}'::jsonb,
  '{"EN: Configurations\nID: Konfigurasi":"Mains-to-Gen, Gen-to-Gen, Multi-Gen Parallel & Island Mode","EN: Transfer Modes\nID: Mode Transfer":"Open Transition / Closed Transition (Bumpless 0ms)","EN: Controller Brands\nID: Merek Kontroler":"Deep Sea (DSE), ComAp, Deif, Woodward","EN: Current Rating\nID: Kapasitas Arus":"100A to 5000A"}'::jsonb,
  '/uploads/mdm/preventive-maintenance.jpg',
  'published',
  now(),
  4,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 5. Power Management & Load Control
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000735',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'power-management-load-control',
  'electrical-distribution/power-management-load-control',
  E'EN: Power Management & Load Control\nID: Manajemen Daya & Kontrol Beban',
  E'EN: Generator load sharing, priority-based load shedding, automatic load restoration, and demand control.\nID: Pembagian beban generator, pelepasan beban berbasis prioritas (load shedding), pemulihan beban otomatis, dan kontrol beban.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Industrial Power Management & Automated Load Control</h3>\n<p>PT Multi Daya Mitra implements intelligent Power Management Systems (PMS) that safeguard islanded or grid-connected power networks from total blackouts during unexpected generation losses or sudden peak overloads.</p>\n<h3>Generator Load Sharing & Demand Management</h3>\n<p>Optimizes fuel economy and engine operating hours by distributing plant electrical load proportionally across running generators, with automatic peak shaving during high tariff periods.</p>\n<h3>Priority-Based Load Shedding & Sequential Restoration</h3>\n<p>When generating capacity drops, high-speed contingency algorithms instantly shed non-critical feeders within milliseconds to preserve frequency and voltage stability for essential production processes, sequentially reconnecting loads once power reserves recover.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Manajemen Daya Industri & Kontrol Beban Otomatis</h3>\n<p>PT Multi Daya Mitra menerapkan Power Management System (PMS) cerdas untuk melindungi jaringan listrik mandiri (island) maupun terhubung PLN dari risiko blackout total saat terjadi gangguan genset atau lonjakan beban tiba-tiba.</p>\n<h3>Pembagian Beban Generator (Load Sharing) & Manajemen Kebutuhan</h3>\n<p>Mengoptimalkan efisiensi bahan bakar dan jam kerja mesin dengan mendistribusikan beban listrik secara proporsional di antara genset yang beroperasi, didukung fitur peak shaving saat tarif listrik puncak.</p>\n<h3>Pelepasan Beban Berbasis Prioritas (Load Shedding) & Pemulihan Bertahap</h3>\n<p>Jika kapasitas daya turun mendadak, algoritma cepat melepaskan beban non-kritis dalam hitungan milidetik guna mempertahankan stabilitas frekuensi bagi proses produksi utama, lalu menyambungkan kembali beban secara berurutan saat pasokan daya telah aman.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial Power Management & Automated Load Control</h3>\n<p>PT Multi Daya Mitra implements intelligent Power Management Systems (PMS) that safeguard islanded or grid-connected power networks from total blackouts during unexpected generation losses or sudden peak overloads.</p>\n<h3>Generator Load Sharing & Demand Management</h3>\n<p>Optimizes fuel economy and engine operating hours by distributing plant electrical load proportionally across running generators, with automatic peak shaving during high tariff periods.</p>\n<h3>Priority-Based Load Shedding & Sequential Restoration</h3>\n<p>When generating capacity drops, high-speed contingency algorithms instantly shed non-critical feeders within milliseconds to preserve frequency and voltage stability for essential production processes, sequentially reconnecting loads once power reserves recover.</p>\nID: <h3>Manajemen Daya Industri & Kontrol Beban Otomatis</h3>\n<p>PT Multi Daya Mitra menerapkan Power Management System (PMS) cerdas untuk melindungi jaringan listrik mandiri (island) maupun terhubung PLN dari risiko blackout total saat terjadi gangguan genset atau lonjakan beban tiba-tiba.</p>\n<h3>Pembagian Beban Generator (Load Sharing) & Manajemen Kebutuhan</h3>\n<p>Mengoptimalkan efisiensi bahan bakar dan jam kerja mesin dengan mendistribusikan beban listrik secara proporsional di antara genset yang beroperasi, didukung fitur peak shaving saat tarif listrik puncak.</p>\n<h3>Pelepasan Beban Berbasis Prioritas (Load Shedding) & Pemulihan Bertahap</h3>\n<p>Jika kapasitas daya turun mendadak, algoritma cepat melepaskan beban non-kritis dalam hitungan milidetik guna mempertahankan stabilitas frekuensi bagi proses produksi utama, lalu menyambungkan kembali beban secara berurutan saat pasokan daya telah aman.</p>"}]}'::jsonb,
  '{"EN: System Architecture\nID: Arsitektur Sistem":"Redundant PLC / Microprocessor Controller Architecture","EN: Response Time\nID: Waktu Respons":"< 50 ms Fast Contingency Load Shedding","EN: Communication\nID: Protokol Komunikasi":"IEC 61850, Modbus TCP/IP, Ethernet/IP, Profinet","EN: Priority Levels\nID: Tingkat Prioritas":"Up to 16 configurable priority shedding matrices"}'::jsonb,
  '/uploads/products-schneider-automation.jpg',
  'published',
  now(),
  5,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 6. Power Quality & Voltage Regulation
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000736',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'power-quality-voltage-regulation',
  'electrical-distribution/power-quality-voltage-regulation',
  E'EN: Power Quality & Voltage Regulation\nID: Kualitas Daya & Regulasi Tegangan',
  E'EN: Power factor correction panels, detuned capacitor banks, active harmonic filters, and automatic voltage regulators/voltage stabilizers.\nID: Panel perbaikan faktor daya, kapasitor bank berreaktor detuned, filter harmonisa aktif, dan regulator tegangan otomatis/stabilizer.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Power Quality Solutions & Voltage Regulation</h3>\n<p>Eliminate costly utility power factor penalties, suppress harmful electrical harmonics, and stabilize plant line voltage to prolong equipment operational life and reduce maintenance downtime.</p>\n<h3>Automatic Power Factor Correction (APFC) & Detuned Capacitor Banks</h3>\n<p>Microprocessor-controlled capacitor banks with heavy-duty detuned iron-core reactors that prevent electrical resonance and protect capacitor cells from harmonic overvoltage.</p>\n<h3>Active Harmonic Filters (AHF) & Industrial Voltage Stabilizers</h3>\n<p>Ultra-fast IGBT active filters dynamically inject counter-phase harmonic currents from the 2nd to 50th order, paired with high-capacity Automatic Voltage Regulators (AVR) for sensitive industrial manufacturing machinery.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Solusi Kualitas Daya & Regulasi Tegangan</h3>\n<p>Meniadakan denda kelebihan pemakaian kVARh dari PLN, meredam gelombang harmonisa yang merusak, dan menstabilkan tegangan suplai guna memperpanjang umur peralatan serta mencegah downtime produksi.</p>\n<h3>Automatic Power Factor Correction (APFC) & Kapasitor Bank Detuned</h3>\n<p>Kapasitor bank otomatis terkontrol mikroprosesor dengan reaktor besi detuned tugas berat yang mencegah resonansi harmonisa dan melindungi kapasitor dari tegangan lebih.</p>\n<h3>Active Harmonic Filter (AHF) & Stabilizer Tegangan Industri</h3>\n<p>Filter aktif berkecepatan tinggi berbasis IGBT yang menginjeksi arus penyeimbang harmonisa orde 2 hingga 50 secara dinamis, dipadukan dengan Automatic Voltage Regulator (AVR) berkapasitas besar untuk mesin industri sensitif.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Power Quality Solutions & Voltage Regulation</h3>\n<p>Eliminate costly utility power factor penalties, suppress harmful electrical harmonics, and stabilize plant line voltage to prolong equipment operational life and reduce maintenance downtime.</p>\n<h3>Automatic Power Factor Correction (APFC) & Detuned Capacitor Banks</h3>\n<p>Microprocessor-controlled capacitor banks with heavy-duty detuned iron-core reactors that prevent electrical resonance and protect capacitor cells from harmonic overvoltage.</p>\n<h3>Active Harmonic Filters (AHF) & Industrial Voltage Stabilizers</h3>\n<p>Ultra-fast IGBT active filters dynamically inject counter-phase harmonic currents from the 2nd to 50th order, paired with high-capacity Automatic Voltage Regulators (AVR) for sensitive industrial manufacturing machinery.</p>\nID: <h3>Solusi Kualitas Daya & Regulasi Tegangan</h3>\n<p>Meniadakan denda kelebihan pemakaian kVARh dari PLN, meredam gelombang harmonisa yang merusak, dan menstabilkan tegangan suplai guna memperpanjang umur peralatan serta mencegah downtime produksi.</p>\n<h3>Automatic Power Factor Correction (APFC) & Kapasitor Bank Detuned</h3>\n<p>Kapasitor bank otomatis terkontrol mikroprosesor dengan reaktor besi detuned tugas berat yang mencegah resonansi harmonisa dan melindungi kapasitor dari tegangan lebih.</p>\n<h3>Active Harmonic Filter (AHF) & Stabilizer Tegangan Industri</h3>\n<p>Filter aktif berkecepatan tinggi berbasis IGBT yang menginjeksi arus penyeimbang harmonisa orde 2 hingga 50 secara dinamis, dipadukan dengan Automatic Voltage Regulator (AVR) berkapasitas besar untuk mesin industri sensitif.</p>"}]}'::jsonb,
  '{"EN: Power Factor\nID: Faktor Daya":"Target Cos Phi 0.98 - 1.0","EN: Harmonic Compensation\nID: Kompensasi Harmonisa":"THDi < 3% with Active Harmonic Filter (AHF)","EN: Detuned Reactors\nID: Reaktor Detuned":"5.67%, 7%, 14% anti-resonance tuning","EN: Voltage Stabilization\nID: Stabilisasi Tegangan":"AVR servo/solid-state up to 2000 kVA (±1% accuracy)"}'::jsonb,
  '/uploads/mdm/power-quality.jpg',
  'published',
  now(),
  6,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 7. UPS & DC Power Systems
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000737',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'ups-dc-power-systems',
  'electrical-distribution/ups-dc-power-systems',
  E'EN: UPS & DC Power Systems\nID: Sistem UPS & Catu Daya DC',
  E'EN: Uninterruptible power supplies, battery banks, battery chargers/rectifiers, and DC distribution panels for protection and control systems.\nID: Uninterruptible power supply (UPS), bank baterai, charger/rectifier baterai, dan panel distribusi DC untuk sistem proteksi dan kontrol.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Industrial UPS & DC Auxiliary Power Systems</h3>\n<p>Critical substations, power plants, and chemical process facilities require 100% reliable continuous DC power to operate protection relays, trip circuit breakers, emergency lubrication pumps, and SCADA monitoring nodes during total blackout conditions.</p>\n<h3>Battery Chargers & Industrial DC Distribution Boards</h3>\n<p>Thyristor-controlled industrial battery chargers and DC distribution panels with float/boost charging profiles, ground fault detection, battery temperature compensation, and dual redundant rectifier configurations.</p>\n<h3>Online Industrial Uninterruptible Power Supplies (UPS)</h3>\n<p>Heavy-duty industrial online double-conversion UPS systems featuring internal inverter isolation transformers to protect sensitive instrumentation, PLC cabinets, and DCS servers from grid disturbances.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Sistem UPS Industri & Catu Daya DC Bantu</h3>\n<p>Gardu induk, pembangkit tenaga listrik, dan fasilitas kimia membutuhkan catu daya DC tanpa henti untuk mengoperasikan relai proteksi, koil trip pemutus sirkuit, pompa oli darurat, serta pemantauan SCADA saat terjadi pemadaman listrik total.</p>\n<h3>Charger Baterai & Panel Distribusi DC Industri</h3>\n<p>Pengisi daya baterai industri berbasis thyristor dan panel distribusi DC dengan mode pengisian float/boost, deteksi gangguan hubung tanah, kompensasi suhu baterai, serta konfigurasi redundant ganda.</p>\n<h3>Uninterruptible Power Supply (UPS) Online Industri</h3>\n<p>Sistem UPS online double-conversion tugas berat dengan transformator isolasi inverter internal untuk melindungi instrumen sensitif, kabinet PLC, dan server DCS dari segala bentuk gangguan tegangan.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Industrial UPS & DC Auxiliary Power Systems</h3>\n<p>Critical substations, power plants, and chemical process facilities require 100% reliable continuous DC power to operate protection relays, trip circuit breakers, emergency lubrication pumps, and SCADA monitoring nodes during total blackout conditions.</p>\n<h3>Battery Chargers & Industrial DC Distribution Boards</h3>\n<p>Thyristor-controlled industrial battery chargers and DC distribution panels with float/boost charging profiles, ground fault detection, battery temperature compensation, and dual redundant rectifier configurations.</p>\n<h3>Online Industrial Uninterruptible Power Supplies (UPS)</h3>\n<p>Heavy-duty industrial online double-conversion UPS systems featuring internal inverter isolation transformers to protect sensitive instrumentation, PLC cabinets, and DCS servers from grid disturbances.</p>\nID: <h3>Sistem UPS Industri & Catu Daya DC Bantu</h3>\n<p>Gardu induk, pembangkit tenaga listrik, dan fasilitas kimia membutuhkan catu daya DC tanpa henti untuk mengoperasikan relai proteksi, koil trip pemutus sirkuit, pompa oli darurat, serta pemantauan SCADA saat terjadi pemadaman listrik total.</p>\n<h3>Charger Baterai & Panel Distribusi DC Industri</h3>\n<p>Pengisi daya baterai industri berbasis thyristor dan panel distribusi DC dengan mode pengisian float/boost, deteksi gangguan hubung tanah, kompensasi suhu baterai, serta konfigurasi redundant ganda.</p>\n<h3>Uninterruptible Power Supply (UPS) Online Industri</h3>\n<p>Sistem UPS online double-conversion tugas berat dengan transformator isolasi inverter internal untuk melindungi instrumen sensitif, kabinet PLC, dan server DCS dari segala bentuk gangguan tegangan.</p>"}]}'::jsonb,
  '{"EN: DC System Voltages\nID: Tegangan Sistem DC":"24V, 48V, 110V, 220V DC Auxiliary Supply","EN: UPS Technology\nID: Teknologi UPS":"True Online Double-Conversion with Galvanic Isolation","EN: Battery Chemistries\nID: Tipe Baterai":"VRLA AGM/Gel, Nickel-Cadmium (Ni-Cd), Lithium Iron Phosphate (LiFePO4)","EN: Charger Topology\nID: Topologi Charger":"Industrial Thyristor/SCR & High-Frequency Switch Mode Rectifiers"}'::jsonb,
  '/uploads/mdm/electrical-equipment.jpg',
  'published',
  now(),
  7,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 8. Frequency Conversion & Shore Power Systems
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000738',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'frequency-conversion-shore-power',
  'electrical-distribution/frequency-conversion-shore-power',
  E'EN: Frequency Conversion & Shore Power Systems\nID: Konversi Frekuensi & Sistem Shore Power',
  E'EN: Supply-frequency converters, shore-to-ship power connections, transformers, switchgear, cable management, connectors, and associated control and interlocking systems.\nID: Konverter frekuensi pasokan, koneksi listrik dermaga ke kapal (shore power), transformator, switchgear, manajemen kabel, konektor, dan sistem kontrol serta interlocking terkait.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Frequency Conversion & Shore-to-Ship Power (Cold Ironing)</h3>\n<p>PT Multi Daya Mitra delivers turnkey shore power supply systems (Alternative Maritime Power - AMP) and static frequency converters that allow marine vessels, shipyards, and offshore platforms to run on clean shoreside grid power.</p>\n<h3>Static Frequency Converters (50 Hz / 60 Hz)</h3>\n<p>High-efficiency solid-state static frequency converters seamlessly bridge the gap between 50 Hz national grid power and 60 Hz shipboard or imported plant machinery with precise voltage and frequency regulation.</p>\n<h3>Shore Connection Substations & Cable Management</h3>\n<p>Comprehensive marine shore connection infrastructure including medium-voltage transformers, switchgear, motorized cable handling reels, safety interlock control, and explosion-protected maritime sockets compliant with IEC/IEEE 80005-1.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Konversi Frekuensi & Catu Daya Dermaga ke Kapal (Shore Power)</h3>\n<p>PT Multi Daya Mitra menghadirkan sistem catu daya dermaga siap pakai (Alternative Maritime Power - AMP / Cold Ironing) dan konverter frekuensi statis yang memungkinkan kapal, galangan, dan platform lepas pantai memanfaatkan listrik dermaga yang ramah lingkungan.</p>\n<h3>Konverter Frekuensi Statis (50 Hz / 60 Hz)</h3>\n<p>Konverter frekuensi solid-state berefisiensi tinggi yang menjembatani perbedaan antara frekuensi listrik PLN (50 Hz) dengan sistem kelistrikan kapal atau mesin impor berstandar 60 Hz secara presisi.</p>\n<h3>Gardu Sambungan Dermaga & Manajemen Kabel</h3>\n<p>Infrastruktur sambungan listrik pelabuhan lengkap mencakup transformator TM, switchgear distribusi, gulungan kabel bermotor (cable reel), pengaman interlocking, dan konektor maritim berstandar internasional IEC/IEEE 80005-1.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Frequency Conversion & Shore-to-Ship Power (Cold Ironing)</h3>\n<p>PT Multi Daya Mitra delivers turnkey shore power supply systems (Alternative Maritime Power - AMP) and static frequency converters that allow marine vessels, shipyards, and offshore platforms to run on clean shoreside grid power.</p>\n<h3>Static Frequency Converters (50 Hz / 60 Hz)</h3>\n<p>High-efficiency solid-state static frequency converters seamlessly bridge the gap between 50 Hz national grid power and 60 Hz shipboard or imported plant machinery with precise voltage and frequency regulation.</p>\n<h3>Shore Connection Substations & Cable Management</h3>\n<p>Comprehensive marine shore connection infrastructure including medium-voltage transformers, switchgear, motorized cable handling reels, safety interlock control, and explosion-protected maritime sockets compliant with IEC/IEEE 80005-1.</p>\nID: <h3>Konversi Frekuensi & Catu Daya Dermaga ke Kapal (Shore Power)</h3>\n<p>PT Multi Daya Mitra menghadirkan sistem catu daya dermaga siap pakai (Alternative Maritime Power - AMP / Cold Ironing) dan konverter frekuensi statis yang memungkinkan kapal, galangan, dan platform lepas pantai memanfaatkan listrik dermaga yang ramah lingkungan.</p>\n<h3>Konverter Frekuensi Statis (50 Hz / 60 Hz)</h3>\n<p>Konverter frekuensi solid-state berefisiensi tinggi yang menjembatani perbedaan antara frekuensi listrik PLN (50 Hz) dengan sistem kelistrikan kapal atau mesin impor berstandar 60 Hz secara presisi.</p>\n<h3>Gardu Sambungan Dermaga & Manajemen Kabel</h3>\n<p>Infrastruktur sambungan listrik pelabuhan lengkap mencakup transformator TM, switchgear distribusi, gulungan kabel bermotor (cable reel), pengaman interlocking, dan konektor maritim berstandar internasional IEC/IEEE 80005-1.</p>"}]}'::jsonb,
  '{"EN: Frequency Conversion\nID: Konversi Frekuensi":"50 Hz to 60 Hz / 60 Hz to 50 Hz Bi-directional Static Converters","EN: Standards\nID: Standar Acuan":"IEC/IEEE 80005-1 High Voltage Shore Connection (HVSC)","EN: Capacity\nID: Kapasitas Daya":"500 kVA to 10 MVA Shore Power Substations","EN: Safety Features\nID: Fitur Keselamatan":"Galvanic isolation, pilot wire interlocking, automated cable reels"}'::jsonb,
  '/uploads/mdm/medium-voltage-equipment.jpg',
  'published',
  now(),
  8,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 9. Protection, Metering & Neutral Grounding
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000739',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'protection-metering-neutral-grounding',
  'electrical-distribution/protection-metering-neutral-grounding',
  E'EN: Protection, Metering & Neutral Grounding\nID: Proteksi, Metering & Neutral Grounding',
  E'EN: Protection relays, current and voltage transformers, power meters, neutral grounding resistors, and associated monitoring systems.\nID: Relai proteksi, transformator arus dan tegangan (CT/VT), power meter, neutral grounding resistor (NGR), dan sistem pemantauan terkait.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Power Protection, Metering & Neutral Grounding Resistors</h3>\n<p>Protect valuable capital assets against electrical damage, minimize thermal stress during earth faults, and capture revenue-grade energy metrics with coordinated numerical protection and instrument transformers.</p>\n<h3>Numerical Protection Relays & Instrument Transformers (CT/VT)</h3>\n<p>Advanced digital protection relays for feeders, transformers, generators, and busbars with high-accuracy Current and Voltage Transformers (CT/VT) supporting IEC 61850 communications and optical arc flash protection.</p>\n<h3>Neutral Grounding Resistors (NGR) & Monitoring</h3>\n<p>Stainless steel grid Neutral Grounding Resistors designed to limit ground-fault currents to safe levels, protecting transformer windings and generators while ensuring reliable tripping, supported by continuous NGR health monitors.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Proteksi Daya, Pengukuran & Neutral Grounding Resistor (NGR)</h3>\n<p>Melindungi aset bernilai tinggi dari kerusakan kelistrikan, meminimalkan tegangan termal saat gangguan hubung tanah, dan menghasilkan data pengukuran daya akurat melalui koordinasi relai numerik dan transformator instrumen.</p>\n<h3>Relai Proteksi Numerik & Trafo Instrumen (CT/VT)</h3>\n<p>Relai proteksi digital canggih untuk penyulang, transformator, generator, dan busbar, didukung Current & Voltage Transformer (CT/VT) berakurasi tinggi dengan protokol IEC 61850 serta proteksi busur api optik.</p>\n<h3>Neutral Grounding Resistor (NGR) & Pemantauan Kontinu</h3>\n<p>Neutral Grounding Resistor berpelat baja antikarat yang dirancang untuk membatasi arus gangguan tanah ke tingkat aman, melindungi belitan trafo dan generator dari kerusakan fatal, dilengkapi pemantau kontinuitas NGR otomatis.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Power Protection, Metering & Neutral Grounding Resistors</h3>\n<p>Protect valuable capital assets against electrical damage, minimize thermal stress during earth faults, and capture revenue-grade energy metrics with coordinated numerical protection and instrument transformers.</p>\n<h3>Numerical Protection Relays & Instrument Transformers (CT/VT)</h3>\n<p>Advanced digital protection relays for feeders, transformers, generators, and busbars with high-accuracy Current and Voltage Transformers (CT/VT) supporting IEC 61850 communications and optical arc flash protection.</p>\n<h3>Neutral Grounding Resistors (NGR) & Monitoring</h3>\n<p>Stainless steel grid Neutral Grounding Resistors designed to limit ground-fault currents to safe levels, protecting transformer windings and generators while ensuring reliable tripping, supported by continuous NGR health monitors.</p>\nID: <h3>Proteksi Daya, Pengukuran & Neutral Grounding Resistor (NGR)</h3>\n<p>Melindungi aset bernilai tinggi dari kerusakan kelistrikan, meminimalkan tegangan termal saat gangguan hubung tanah, dan menghasilkan data pengukuran daya akurat melalui koordinasi relai numerik dan transformator instrumen.</p>\n<h3>Relai Proteksi Numerik & Trafo Instrumen (CT/VT)</h3>\n<p>Relai proteksi digital canggih untuk penyulang, transformator, generator, dan busbar, didukung Current & Voltage Transformer (CT/VT) berakurasi tinggi dengan protokol IEC 61850 serta proteksi busur api optik.</p>\n<h3>Neutral Grounding Resistor (NGR) & Pemantauan Kontinu</h3>\n<p>Neutral Grounding Resistor berpelat baja antikarat yang dirancang untuk membatasi arus gangguan tanah ke tingkat aman, melindungi belitan trafo dan generator dari kerusakan fatal, dilengkapi pemantau kontinuitas NGR otomatis.</p>"}]}'::jsonb,
  '{"EN: Protection Functions\nID: Fungsi Proteksi":"Overcurrent (50/51), Earth Fault (50N/51N), Differential (87), Arc Flash","EN: Instrument Transformers\nID: Trafo Instrumen":"Cast Resin CT & VT Class 0.2S / 0.5 / 5P20 up to 36 kV","EN: NGR Ratings\nID: Kapasitas NGR":"6.6 kV, 11 kV, 20 kV, 22 kV up to 1000A (10s / 30s / continuous)","EN: Resistor Material\nID: Material Resistor":"Stainless Steel / Nickel-Chromium high-temperature alloy"}'::jsonb,
  '/uploads/mdm/micrologic-test.jpg',
  'published',
  now(),
  9,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- 10. Substation Automation & SCADA
INSERT INTO products (
  id,
  parent_id,
  slug,
  full_path,
  title,
  summary,
  content,
  specs,
  image_url,
  status,
  published_at,
  sort_order,
  depth
) VALUES (
  '00000000-0000-0000-0000-000000000740',
  (SELECT id FROM products WHERE slug = 'electrical-distribution' LIMIT 1),
  'substation-automation-scada',
  'electrical-distribution/substation-automation-scada',
  E'EN: Substation Automation & SCADA\nID: Otomasi Gardu Induk & SCADA',
  E'EN: Substation automation systems, RTUs, communication gateways, HMIs, IED integration, and remote monitoring and control.\nID: Sistem otomasi gardu induk (SAS), RTU, gateway komunikasi, antarmuka HMI, integrasi IED, serta pemantauan dan kontrol jarak jauh.',
  '{"bilingual":true,"en":{"blocks":[{"type":"html","html":"<h3>Substation Automation Systems (SAS) & Power SCADA</h3>\n<p>Transforming traditional electrical substations into secure, digitally connected hubs featuring comprehensive real-time telemetry, automated interlocking, and remote supervisory control.</p>\n<h3>IEC 61850 Substation Digital Integration</h3>\n<p>Seamlessly integrates Intelligent Electronic Devices (IEDs), protection relays, energy meters, and tap changer controllers across high-speed optical fiber backbones supporting GOOSE and MMS messaging.</p>\n<h3>Remote Terminal Units (RTU) & Central Dispatch Gateways</h3>\n<p>Industrial-grade RTUs and protocol converters bridging substation switchgear to utility distribution control centers (PLN SCADA) or centralized plant DCS environments via IEC 60870-5-104 and DNP3 protocols.</p>"}]},"id":{"blocks":[{"type":"html","html":"<h3>Sistem Otomasi Gardu Induk (SAS) & SCADA Kelistrikan</h3>\n<p>Mentransformasi gardu induk konvensional menjadi gardu digital modern yang aman, dilengkapi telemetri real-time komprehensif, interlocking otomatis, dan kontrol operasional jarak jauh.</p>\n<h3>Integrasi Gardu Digital Berstandar IEC 61850</h3>\n<p>Menghubungkan Intelligent Electronic Device (IED), relai proteksi, meter energi, dan kontrol tap changer melalui jaringan serat optik redundan berstandar GOOSE dan MMS tanpa jeda.</p>\n<h3>Remote Terminal Unit (RTU) & Gateway Dispatch Pusat</h3>\n<p>Menyediakan RTU berstandar industri dan gateway komunikasi untuk menghubungkan switchgear gardu dengan pusat kontrol penyulang (PLN SCADA) maupun ruang kontrol terpusat pabrik (DCS).</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Substation Automation Systems (SAS) & Power SCADA</h3>\n<p>Transforming traditional electrical substations into secure, digitally connected hubs featuring comprehensive real-time telemetry, automated interlocking, and remote supervisory control.</p>\n<h3>IEC 61850 Substation Digital Integration</h3>\n<p>Seamlessly integrates Intelligent Electronic Devices (IEDs), protection relays, energy meters, and tap changer controllers across high-speed optical fiber backbones supporting GOOSE and MMS messaging.</p>\n<h3>Remote Terminal Units (RTU) & Central Dispatch Gateways</h3>\n<p>Industrial-grade RTUs and protocol converters bridging substation switchgear to utility distribution control centers (PLN SCADA) or centralized plant DCS environments via IEC 60870-5-104 and DNP3 protocols.</p>\nID: <h3>Sistem Otomasi Gardu Induk (SAS) & SCADA Kelistrikan</h3>\n<p>Mentransformasi gardu induk konvensional menjadi gardu digital modern yang aman, dilengkapi telemetri real-time komprehensif, interlocking otomatis, dan kontrol operasional jarak jauh.</p>\n<h3>Integrasi Gardu Digital Berstandar IEC 61850</h3>\n<p>Menghubungkan Intelligent Electronic Device (IED), relai proteksi, meter energi, dan kontrol tap changer melalui jaringan serat optik redundan berstandar GOOSE dan MMS tanpa jeda.</p>\n<h3>Remote Terminal Unit (RTU) & Gateway Dispatch Pusat</h3>\n<p>Menyediakan RTU berstandar industri dan gateway komunikasi untuk menghubungkan switchgear gardu dengan pusat kontrol penyulang (PLN SCADA) maupun ruang kontrol terpusat pabrik (DCS).</p>"}]}'::jsonb,
  '{"EN: Supported Protocols\nID: Protokol yang Didukung":"IEC 61850 (Ed. 1 & 2), IEC 60870-5-101/104, DNP3, Modbus TCP/RTU","EN: Cyber Security\nID: Keamanan Siber":"IEC 62443 / NERC CIP compliant secure authentication","EN: Gateway Hardware\nID: Perangkat Keras Gateway":"Substation-hardened fanless embedded computer (IEC 61850-3 / IEEE 1613)","EN: HMI & Historian\nID: HMI & Perekam Data":"Real-time dynamic single-line diagrams, event recording (SOE 1ms), and alarming"}'::jsonb,
  '/uploads/products-schneider-automation.jpg',
  'published',
  now(),
  10,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

COMMIT;
