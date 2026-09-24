-- 028_add_rittal_products.up.sql
-- Add 3 official Rittal products from rittal.com:
-- 1. Rittal IT Infrastructure & Data Center Solutions (VX IT & Micro DC)
-- 2. Rittal Outdoor Enclosure Systems (CS Toptec & CS New Basic)
-- 3. Rittal Automation Systems (Perforex MT & Secarex)

BEGIN;


-- INSERT OR UPDATE: rittal-distributor/it-infrastructure
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
  '00000000-0000-0000-0000-000000000771',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'it-infrastructure',
  'rittal-distributor/it-infrastructure',
  E'EN: Rittal IT Infrastructure & Data Center Solutions (VX IT & Micro DC)
ID: Infrastruktur IT & Solusi Data Center Rittal (VX IT & Micro DC)',
  E'EN: Standardized and modular IT rack systems, TX CableNet network racks, Edge Data Centers, and Smart PDU power management for scalable enterprise IT rooms.
ID: Sistem rak IT modular terstandarisasi, rak jaringan TX CableNet, Edge Data Center, dan manajemen daya Smart PDU untuk ruang IT enterprise yang andal dan terukur.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Rittal VX IT: Platform Global untuk Data Center Modern</h3>\n<p>Rittal VX IT adalah platform rak paling serbaguna di dunia untuk seluruh aplikasi infrastruktur IT, mulai dari ruang server jaringan tunggal hingga pusat data berskala besar (hyperscale). Dirancang dengan modularitas tinggi dan kemudahan instalasi cepat, VX IT memungkinkan pemasangan rel 19\", panel samping, dan manajemen kabel secara snap-in tanpa bantuan perkakas, memangkas waktu perakitan hingga 50%.</p>\n<h3>Edge Data Center & Enclosure Micro Data Center</h3>\n<p>Untuk komputasi edge terdesentralisasi, pabrik pintar industri, dan kantor cabang terpencil, Micro Data Center Rittal menghadirkan infrastruktur IT lengkap dan siap pakai yang terlindungi aman di dalam enclosure berstandar proteksi IP55 / NEMA 12. Dilengkapi sistem pendingin terintegrasi Blue e+ atau LCP, deteksi kebakaran otomatis dan pemadam gas clean-agent (DET-AC III), serta kontrol akses biometrik.</p>\n<h3>Distribusi Daya Cerdas & Manajemen Termal Presisi</h3>\n<p>Dilengkapi Smart PDU Rittal cerdas dengan pengukuran konsumsi listrik tingkat outlet individual, kapabilitas reboot jarak jauh, dan penyeimbangan fase. Untuk beban panas ekstrem, unit Rittal Liquid Cooling Package (LCP) menyalurkan pendinginan air dingin berefisiensi tinggi langsung di samping rak server, mampu mengatasi beban termal hingga 55 kW per enclosure.</p>\n<h3>Pemantauan Lingkungan Waktu Nyata CMC III</h3>\n<p>Pemantauan terus-menerus terhadap suhu lingkungan, kelembaban, tekanan udara diferensial, asap, kebocoran air, dan getaran fisik melalui sistem IoT Rittal Computer Multi Control (CMC III) yang terintegrasi langsung ke platform DCIM dan manajemen jaringan berbasis SNMP/Modbus.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Rittal VX IT: The Global Platform for Modern Data Centers</h3>\n<p>The Rittal VX IT is the world''s most versatile rack platform for all IT applications, from single network closets to high-density hyperscale data centers. Engineered for ultimate modularity and speed, the VX IT enables tool-free, snap-in installation of 19\" rails, side panels, and cable management accessories, cutting deployment time by up to 50%.</p>\n<h3>Edge Data Centers & Micro Data Center Enclosures</h3>\n<p>For decentralized edge computing, industrial smart factories, and remote branch offices, Rittal Micro Data Centers provide a fully self-contained, turnkey IT infrastructure safe inside an IP55 / NEMA 12 rated enclosure. Integrated with dedicated Blue e+ or LCP cooling, automated fire detection and clean-agent suppression (DET-AC III), and biometric access control.</p>\n<h3>Intelligent Power Distribution & Precision Thermal Management</h3>\n<p>Equipped with intelligent Rittal Smart PDUs offering individual outlet-level metering, remote rebooting, and phase balancing. For extreme heat loads, Rittal Liquid Cooling Packages (LCP) deliver high-efficiency chilled water cooling directly adjacent to rack servers, handling thermal densities up to 55 kW per enclosure.</p>\n<h3>CMC III Real-Time Environmental Monitoring</h3>\n<p>Continuous monitoring of ambient temperature, humidity, differential air pressure, smoke, water leaks, and vibration via the Rittal Computer Multi Control (CMC III) IoT system, seamlessly integrated into DCIM and SNMP/Modbus network management platforms.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Rittal VX IT: The Global Platform for Modern Data Centers</h3>\n<p>The Rittal VX IT is the world''s most versatile rack platform for all IT applications, from single network closets to high-density hyperscale data centers. Engineered for ultimate modularity and speed, the VX IT enables tool-free, snap-in installation of 19\" rails, side panels, and cable management accessories, cutting deployment time by up to 50%.</p>\n<h3>Edge Data Centers & Micro Data Center Enclosures</h3>\n<p>For decentralized edge computing, industrial smart factories, and remote branch offices, Rittal Micro Data Centers provide a fully self-contained, turnkey IT infrastructure safe inside an IP55 / NEMA 12 rated enclosure. Integrated with dedicated Blue e+ or LCP cooling, automated fire detection and clean-agent suppression (DET-AC III), and biometric access control.</p>\n<h3>Intelligent Power Distribution & Precision Thermal Management</h3>\n<p>Equipped with intelligent Rittal Smart PDUs offering individual outlet-level metering, remote rebooting, and phase balancing. For extreme heat loads, Rittal Liquid Cooling Packages (LCP) deliver high-efficiency chilled water cooling directly adjacent to rack servers, handling thermal densities up to 55 kW per enclosure.</p>\n<h3>CMC III Real-Time Environmental Monitoring</h3>\n<p>Continuous monitoring of ambient temperature, humidity, differential air pressure, smoke, water leaks, and vibration via the Rittal Computer Multi Control (CMC III) IoT system, seamlessly integrated into DCIM and SNMP/Modbus network management platforms.</p>\nID: <h3>Rittal VX IT: Platform Global untuk Data Center Modern</h3>\n<p>Rittal VX IT adalah platform rak paling serbaguna di dunia untuk seluruh aplikasi infrastruktur IT, mulai dari ruang server jaringan tunggal hingga pusat data berskala besar (hyperscale). Dirancang dengan modularitas tinggi dan kemudahan instalasi cepat, VX IT memungkinkan pemasangan rel 19\", panel samping, dan manajemen kabel secara snap-in tanpa bantuan perkakas, memangkas waktu perakitan hingga 50%.</p>\n<h3>Edge Data Center & Enclosure Micro Data Center</h3>\n<p>Untuk komputasi edge terdesentralisasi, pabrik pintar industri, dan kantor cabang terpencil, Micro Data Center Rittal menghadirkan infrastruktur IT lengkap dan siap pakai yang terlindungi aman di dalam enclosure berstandar proteksi IP55 / NEMA 12. Dilengkapi sistem pendingin terintegrasi Blue e+ atau LCP, deteksi kebakaran otomatis dan pemadam gas clean-agent (DET-AC III), serta kontrol akses biometrik.</p>\n<h3>Distribusi Daya Cerdas & Manajemen Termal Presisi</h3>\n<p>Dilengkapi Smart PDU Rittal cerdas dengan pengukuran konsumsi listrik tingkat outlet individual, kapabilitas reboot jarak jauh, dan penyeimbangan fase. Untuk beban panas ekstrem, unit Rittal Liquid Cooling Package (LCP) menyalurkan pendinginan air dingin berefisiensi tinggi langsung di samping rak server, mampu mengatasi beban termal hingga 55 kW per enclosure.</p>\n<h3>Pemantauan Lingkungan Waktu Nyata CMC III</h3>\n<p>Pemantauan terus-menerus terhadap suhu lingkungan, kelembaban, tekanan udara diferensial, asap, kebocoran air, dan getaran fisik melalui sistem IoT Rittal Computer Multi Control (CMC III) yang terintegrasi langsung ke platform DCIM dan manajemen jaringan berbasis SNMP/Modbus.</p>"}]}'::jsonb,
  '{"EN: System Architecture\nID: Arsitektur Sistem":"Rittal VX IT & TX CableNet modular server & network racks","EN: Load Capacity\nID: Kapasitas Beban":"Static load up to 18,000 N (1,800 kg) / Dynamic up to 15,000 N","EN: Height & Dimensions\nID: Ketinggian & Dimensi":"15U, 24U, 42U, 47U, 52U (Width 600/800 mm, Depth 800/1000/1200 mm)","EN: Protection Rating\nID: Tingkat Proteksi":"IP20 (vented perforated doors) / IP55 (solid sheet steel doors)","EN: Cooling & Thermal\nID: Sistem Pendinginan":"LCP (Liquid Cooling Package) up to 55 kW per rack, smart cold/hot aisle containment","EN: Power & Monitoring\nID: Daya & Pemantauan":"Smart PDU (Metered/Switched/Managed) & CMC III IoT monitoring platform"}'::jsonb,
  '/uploads/products-rittal-it-infrastructure.jpg',
  'published',
  now(),
  4,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/outdoor-enclosures
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
  '00000000-0000-0000-0000-000000000772',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'outdoor-enclosures',
  'rittal-distributor/outdoor-enclosures',
  E'EN: Rittal Outdoor Enclosure Systems (CS Toptec & CS New Basic)
ID: Sistem Enclosure Outdoor Rittal (CS Toptec & CS New Basic)',
  E'EN: Weatherproof, double-walled aluminium outdoor enclosures designed for harsh environmental conditions, telecommunications 5G sites, rail, and smart traffic infrastructure.
ID: Enclosure outdoor aluminium dinding ganda tahan cuaca ekstrem yang dirancang untuk telekomunikasi 5G, perkeretaapian, dan infrastruktur lalu lintas cerdas.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Dirancang Khusus untuk Lingkungan Luar Ruang Ekstrem</h3>\n<p>Enclosure outdoor Rittal dirancang khusus untuk melindungi sistem daya kritis, telekomunikasi, dan kontrol otomasi dari paparan cuaca berat—termasuk radiasi panas matahari tropis yang menyengat, hujan deras, badai debu, polusi industri, dan udara berkadar garam tinggi di area pesisir. Memenuhi standar internasional IEC 61969 untuk kabinet elektronik luar ruang.</p>\n<h3>Arsitektur Dinding Ganda & Efek Cerobong Alami</h3>\n<p>Seri CS Toptec menggunakan struktur aluminium berdinding ganda (twin-wall) mutakhir yang terdiri dari rangka internal dan lapisan pelindung eksternal. Rongga udara di antara dinding memanfaatkan efek cerobong alami untuk membuang panas radiasi matahari hingga lebih dari 60% dibanding kabinet logam dinding tunggal biasa, sehingga menghemat konsumsi daya pendingin secara signifikan.</p>\n<h3>Kapabilitas Penggabungan Modular CS Toptec</h3>\n<p>Dibangun di atas pola kisi modular 25 mm khas Rittal, lemari CS Toptec mendukung penggabungan (baying) multi-kompartemen di atas pondasi beton. Desain modular ini memungkinkan pemisahan fisik yang terorganisir antara kompartemen baterai cadangan, penyearah AC/DC, distribusi fiber optik, dan perangkat transmisi gelombang mikro.</p>\n<h3>Sistem Pendingin Terintegrasi & Perlindungan Anti-Vandalisme</h3>\n<p>Dapat dipadukan dengan unit pendingin outdoor Blue e+, penukar panas (heat exchanger), dan pendingin termoelektrik Rittal. Dilengkapi sistem penguncian batang multi-titik espagnolette, engsel tersembunyi di dalam, dan proteksi anti-vandalisme bersertifikasi RC 2 / RC 3 guna mencegah pembobolan fisik tanpa izin.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Engineered for Harsh Outdoor Environments</h3>\n<p>Rittal outdoor enclosures are engineered specifically to shield mission-critical power, telecommunications, and automation controls from punishing environmental conditions—including extreme tropical sun, driving rain, dust storms, industrial smog, and coastal salt fog. Designed according to IEC 61969 standards for outdoor electronic cabinets.</p>\n<h3>Double-Walled Architecture & Natural Chimney Effect</h3>\n<p>The CS Toptec series features an advanced double-walled aluminium structure consisting of an internal frame and an external protective skin. The air gap between walls harnesses the natural chimney effect to dissipate solar radiation, preventing solar heat gain by more than 60% compared to conventional single-walled metal cabinets and dramatically lowering HVAC cooling power demands.</p>\n<h3>CS Toptec Modular Baying Capability</h3>\n<p>Built upon Rittal''s signature 25 mm modular pitch, CS Toptec enclosures support seamless multi-bay expansion on concrete plinths. The modular design enables distinct physical separation between battery banks, AC/DC rectifiers, optical fiber distribution, and microwave transmission hardware.</p>\n<h3>Integrated Climate Control & Vandalism Resistance</h3>\n<p>Compatible with Rittal outdoor Blue e+ cooling units, heat exchangers, and thermoelectric coolers. Fitted with multi-point espagnolette locking mechanisms, internal hinges, and anti-vandalism features meeting RC 2 / RC 3 security ratings to prevent unauthorized physical tampering.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Engineered for Harsh Outdoor Environments</h3>\n<p>Rittal outdoor enclosures are engineered specifically to shield mission-critical power, telecommunications, and automation controls from punishing environmental conditions—including extreme tropical sun, driving rain, dust storms, industrial smog, and coastal salt fog. Designed according to IEC 61969 standards for outdoor electronic cabinets.</p>\n<h3>Double-Walled Architecture & Natural Chimney Effect</h3>\n<p>The CS Toptec series features an advanced double-walled aluminium structure consisting of an internal frame and an external protective skin. The air gap between walls harnesses the natural chimney effect to dissipate solar radiation, preventing solar heat gain by more than 60% compared to conventional single-walled metal cabinets and dramatically lowering HVAC cooling power demands.</p>\n<h3>CS Toptec Modular Baying Capability</h3>\n<p>Built upon Rittal''s signature 25 mm modular pitch, CS Toptec enclosures support seamless multi-bay expansion on concrete plinths. The modular design enables distinct physical separation between battery banks, AC/DC rectifiers, optical fiber distribution, and microwave transmission hardware.</p>\n<h3>Integrated Climate Control & Vandalism Resistance</h3>\n<p>Compatible with Rittal outdoor Blue e+ cooling units, heat exchangers, and thermoelectric coolers. Fitted with multi-point espagnolette locking mechanisms, internal hinges, and anti-vandalism features meeting RC 2 / RC 3 security ratings to prevent unauthorized physical tampering.</p>\nID: <h3>Dirancang Khusus untuk Lingkungan Luar Ruang Ekstrem</h3>\n<p>Enclosure outdoor Rittal dirancang khusus untuk melindungi sistem daya kritis, telekomunikasi, dan kontrol otomasi dari paparan cuaca berat—termasuk radiasi panas matahari tropis yang menyengat, hujan deras, badai debu, polusi industri, dan udara berkadar garam tinggi di area pesisir. Memenuhi standar internasional IEC 61969 untuk kabinet elektronik luar ruang.</p>\n<h3>Arsitektur Dinding Ganda & Efek Cerobong Alami</h3>\n<p>Seri CS Toptec menggunakan struktur aluminium berdinding ganda (twin-wall) mutakhir yang terdiri dari rangka internal dan lapisan pelindung eksternal. Rongga udara di antara dinding memanfaatkan efek cerobong alami untuk membuang panas radiasi matahari hingga lebih dari 60% dibanding kabinet logam dinding tunggal biasa, sehingga menghemat konsumsi daya pendingin secara signifikan.</p>\n<h3>Kapabilitas Penggabungan Modular CS Toptec</h3>\n<p>Dibangun di atas pola kisi modular 25 mm khas Rittal, lemari CS Toptec mendukung penggabungan (baying) multi-kompartemen di atas pondasi beton. Desain modular ini memungkinkan pemisahan fisik yang terorganisir antara kompartemen baterai cadangan, penyearah AC/DC, distribusi fiber optik, dan perangkat transmisi gelombang mikro.</p>\n<h3>Sistem Pendingin Terintegrasi & Perlindungan Anti-Vandalisme</h3>\n<p>Dapat dipadukan dengan unit pendingin outdoor Blue e+, penukar panas (heat exchanger), dan pendingin termoelektrik Rittal. Dilengkapi sistem penguncian batang multi-titik espagnolette, engsel tersembunyi di dalam, dan proteksi anti-vandalisme bersertifikasi RC 2 / RC 3 guna mencegah pembobolan fisik tanpa izin.</p>"}]}'::jsonb,
  '{"EN: Enclosure Series\nID: Seri Enclosure":"CS Toptec (bayable modular) & CS New Basic (single-wall / twin-wall)","EN: Material & Finish\nID: Material & Lapisan":"AlMg3 corrosion-resistant aluminium alloy with pure polyester UV powder coating (RAL 7035)","EN: Protection Rating\nID: Tingkat Proteksi":"IP55 / IP66 according to IEC 60529, NEMA 3R / 4 / 4X","EN: Impact Resistance\nID: Ketahanan Benturan":"IK10 according to DIN EN 50102 / IEC 62262","EN: Thermal Insulation\nID: Isolasi Termal":"Twin-wall technology (chimney effect) reducing solar radiation heat transfer by > 60%","EN: Operating Range\nID: Suhu Operasi":"-33°C to +65°C ambient operating temperature"}'::jsonb,
  '/uploads/products-rittal-outdoor-enclosures.jpg',
  'published',
  now(),
  5,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  specs = EXCLUDED.specs,
  image_url = EXCLUDED.image_url,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  depth = EXCLUDED.depth,
  updated_at = now();

-- INSERT OR UPDATE: rittal-distributor/automation-systems
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
  '00000000-0000-0000-0000-000000000773',
  (SELECT id FROM products WHERE slug = 'rittal-distributor' OR full_path = 'rittal-distributor' LIMIT 1),
  'automation-systems',
  'rittal-distributor/automation-systems',
  E'EN: Rittal Automation Systems (Perforex MT & Secarex)
ID: Sistem Otomasi Perakitan Panel Rittal (Perforex MT & Secarex)',
  E'EN: Digital CNC machining centers, automated cutting tools, and wire processing systems designed to accelerate panel building and switchgear manufacturing by up to 85%.
ID: Pusat permesinan CNC digital, mesin pemotong otomatis, dan pemrosesan kabel terotomasi yang mempercepat perakitan panel switchgear hingga 85%.',
  '{"bilingual":true,"id":{"blocks":[{"type":"html","html":"<h3>Manufaktur Switchgear Digital & Industri Perakitan Panel 4.0</h3>\n<p>Rittal Automation Systems (RAS) menjembatani rancangan rekayasa digital dengan perakitan fisik di lantai bengkel panel. Dengan menghubungkan desain panel virtual 3D dari software Eplan secara langsung ke mesin permesinan otomatis, RAS memangkas waktu produksi secara drastis, mengurangi ketergantungan tenaga kerja manual, dan menjamin nol kesalahan perakitan ulang.</p>\n<h3>Pusat Permesinan CNC Perforex MT</h3>\n<p>Seri Perforex MT merupakan standar industri untuk permesinan otomatis pada pelat pemasangan (mounting plate), pintu samping, serta bodi enclosure kubikal yang telah dirakit penuh. Dilengkapi spindle CNC berkecepatan tinggi, pengganti perkakas otomatis (auto tool changer), dan pencekaman benda kerja bermotor, Perforex melakukan pengeboran presisi, pengetapan ulir, pemotongan lubang persegi (milling), dan pembersihan geram (deburring) dalam satu siklus otomatis terpadu.</p>\n<h3>Pusat Pemotong Otomatis Secarex & Wire Terminal</h3>\n<p>Mesin pemotong Secarex AC 15 memberikan pemotongan semi-otomatis yang cepat dan rapi tanpa geram untuk rel DIN, rel C, serta ducting kabel plastik disertai pencetakan label terintegrasi. Dipadukan dengan Rittal Wire Terminal WT, seluruh proses kabel (pemotongan panjang, pengupasan isolasi, crimping ferrule, dan pengelompokan kabel) berjalan otomatis hingga 8 kali lebih cepat dibanding metode manual.</p>\n<h3>Sinkronisasi Langsung CAD/CAM Eplan Pro Panel</h3>\n<p>Kode permesinan CNC dihasilkan langsung dari digital twin pada Eplan Pro Panel tanpa perlu pemrograman manual. Toleransi, koordinat lubang, dan diameter pengeboran ditransfer secara instan melalui jaringan Ethernet, memastikan tingkat akurasi 100% dari gambar teknik hingga panel jadi di bengkel kerja.</p>"}]},"en":{"blocks":[{"type":"html","html":"<h3>Digitalized Switchgear Manufacturing & Panel Building 4.0</h3>\n<p>Rittal Automation Systems (RAS) bridges the gap between digital engineering and physical shop floor fabrication. By seamlessly connecting Eplan virtual 3D panel designs with automated machinery, RAS dramatically slashes manufacturing time, lowers manual labor overhead, and guarantees zero rework in panel workshops.</p>\n<h3>Perforex MT CNC Machining Centers</h3>\n<p>The Perforex MT series is the industry benchmark for automated machining of enclosure mounting plates, side doors, and complete cubic enclosures. With high-speed CNC spindle drives, automated tool changers, and motorized workpiece clamping, Perforex performs precise drilling, thread tapping, milling of rectangular cutouts, and edge deburring in a single continuous automated cycle.</p>\n<h3>Secarex Automated Cutting & Wire Terminal Systems</h3>\n<p>The Secarex AC 15 cutting center delivers fast, burr-free semi-automatic cutting of DIN mounting rails, C-rails, and plastic cable wiring ducts with integrated label printing. Combined with the Rittal Wire Terminal WT, wire processing (cutting, stripping, crimping, and automated wire sequencing) is fully automated, producing ready-to-wire harnesses up to 8 times faster than manual methods.</p>\n<h3>Direct Eplan Pro Panel CAD/CAM Synchronization</h3>\n<p>Machine code is generated directly from the digital twin in Eplan Pro Panel with zero manual programming. Tolerances, cutout coordinates, and drilling diameters are transferred automatically over Ethernet, ensuring 100% precision from engineering drawing to finished industrial panel.</p>"}]},"blocks":[{"type":"html","html":"EN: <h3>Digitalized Switchgear Manufacturing & Panel Building 4.0</h3>\n<p>Rittal Automation Systems (RAS) bridges the gap between digital engineering and physical shop floor fabrication. By seamlessly connecting Eplan virtual 3D panel designs with automated machinery, RAS dramatically slashes manufacturing time, lowers manual labor overhead, and guarantees zero rework in panel workshops.</p>\n<h3>Perforex MT CNC Machining Centers</h3>\n<p>The Perforex MT series is the industry benchmark for automated machining of enclosure mounting plates, side doors, and complete cubic enclosures. With high-speed CNC spindle drives, automated tool changers, and motorized workpiece clamping, Perforex performs precise drilling, thread tapping, milling of rectangular cutouts, and edge deburring in a single continuous automated cycle.</p>\n<h3>Secarex Automated Cutting & Wire Terminal Systems</h3>\n<p>The Secarex AC 15 cutting center delivers fast, burr-free semi-automatic cutting of DIN mounting rails, C-rails, and plastic cable wiring ducts with integrated label printing. Combined with the Rittal Wire Terminal WT, wire processing (cutting, stripping, crimping, and automated wire sequencing) is fully automated, producing ready-to-wire harnesses up to 8 times faster than manual methods.</p>\n<h3>Direct Eplan Pro Panel CAD/CAM Synchronization</h3>\n<p>Machine code is generated directly from the digital twin in Eplan Pro Panel with zero manual programming. Tolerances, cutout coordinates, and drilling diameters are transferred automatically over Ethernet, ensuring 100% precision from engineering drawing to finished industrial panel.</p>\nID: <h3>Manufaktur Switchgear Digital & Industri Perakitan Panel 4.0</h3>\n<p>Rittal Automation Systems (RAS) menjembatani rancangan rekayasa digital dengan perakitan fisik di lantai bengkel panel. Dengan menghubungkan desain panel virtual 3D dari software Eplan secara langsung ke mesin permesinan otomatis, RAS memangkas waktu produksi secara drastis, mengurangi ketergantungan tenaga kerja manual, dan menjamin nol kesalahan perakitan ulang.</p>\n<h3>Pusat Permesinan CNC Perforex MT</h3>\n<p>Seri Perforex MT merupakan standar industri untuk permesinan otomatis pada pelat pemasangan (mounting plate), pintu samping, serta bodi enclosure kubikal yang telah dirakit penuh. Dilengkapi spindle CNC berkecepatan tinggi, pengganti perkakas otomatis (auto tool changer), dan pencekaman benda kerja bermotor, Perforex melakukan pengeboran presisi, pengetapan ulir, pemotongan lubang persegi (milling), dan pembersihan geram (deburring) dalam satu siklus otomatis terpadu.</p>\n<h3>Pusat Pemotong Otomatis Secarex & Wire Terminal</h3>\n<p>Mesin pemotong Secarex AC 15 memberikan pemotongan semi-otomatis yang cepat dan rapi tanpa geram untuk rel DIN, rel C, serta ducting kabel plastik disertai pencetakan label terintegrasi. Dipadukan dengan Rittal Wire Terminal WT, seluruh proses kabel (pemotongan panjang, pengupasan isolasi, crimping ferrule, dan pengelompokan kabel) berjalan otomatis hingga 8 kali lebih cepat dibanding metode manual.</p>\n<h3>Sinkronisasi Langsung CAD/CAM Eplan Pro Panel</h3>\n<p>Kode permesinan CNC dihasilkan langsung dari digital twin pada Eplan Pro Panel tanpa perlu pemrograman manual. Toleransi, koordinat lubang, dan diameter pengeboran ditransfer secara instan melalui jaringan Ethernet, memastikan tingkat akurasi 100% dari gambar teknik hingga panel jadi di bengkel kerja.</p>"}]}'::jsonb,
  '{"EN: Machine Range\nID: Lini Mesin":"Perforex MT 107/2101/2201 CNC Milling, Secarex AC 15 Cutting Center, Wire Terminal WT","EN: Machining Capabilities\nID: Kemampuan Permesinan":"Milling, drilling, thread tapping, deburring, and laser cutting (flat parts & fully welded enclosures)","EN: Workpiece Compatibility\nID: Kompatibilitas Benda Kerja":"Sheet steel, stainless steel AISI 304/316, aluminium, copper busbars, and plastics","EN: Software Integration\nID: Integrasi Perangkat Lunak":"Direct seamless import from Eplan Pro Panel, DXF/DWG, and 3D CAD step files","EN: Productivity Gain\nID: Peningkatan Produktivitas":"Up to 85% faster enclosure panel machining with zero manual marking errors","EN: Max Clamping Area\nID: Bidang Cekam Maksimum":"Up to 3,800 mm x 2,300 mm (Perforex MT 2201)"}'::jsonb,
  '/uploads/products-rittal-automation-systems.jpg',
  'published',
  now(),
  6,
  1
)
ON CONFLICT (full_path) DO UPDATE SET
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
