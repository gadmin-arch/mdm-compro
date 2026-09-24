-- 022_bilingual_services_products_seed.up.sql
-- Synchronize Services & Products titles and summaries with bilingual format (EN: ...\nID: ...)

BEGIN;

-- 1. UPDATE SERVICES
UPDATE services SET
  title = E'EN: Electrical Construction & Installation\nID: Konstruksi & Instalasi Elektrikal',
  summary = E'EN: Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.\nID: Solusi terintegrasi instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, pemasangan trafo, dan terminasi kabel.'
WHERE slug = 'electrical-construction-installation';

UPDATE services SET
  title = E'EN: Substation & Transformer Installation\nID: Instalasi Gardu Induk & Transformator Daya',
  summary = E'EN: Turnkey construction of medium voltage (up to 36kV) outdoor/indoor substations, transformer placement, oil filtration, and busduct installation.\nID: Konstruksi gardu induk outdoor/indoor tegangan menengah (hingga 36kV), penempatan trafo, filtrasi minyak, dan instalasi busduct.'
WHERE slug = 'substation-transformer-installation' OR slug = 'substation-mv-switchgear-installation';

UPDATE services SET
  title = E'EN: MV & LV Switchboard Panel Assembly\nID: Perakitan Panel Switchboard MV & LV',
  summary = E'EN: Fabrication and integration of Medium Voltage cubicles, Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), and MCC.\nID: Fabrikasi dan integrasi kubikel tegangan menengah, Panel Distribusi Utama (MDP), Sub-Distribusi (SDP), dan Motor Control Center (MCC).'
WHERE slug = 'mv-lv-switchboard-assembly' OR slug = 'lv-distribution-panels-assembly';

UPDATE services SET
  title = E'EN: MV & LV Cable Installation & Termination\nID: Instalasi & Terminasi Kabel MV & LV',
  summary = E'EN: Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.\nID: Penarikan kabel tersertifikasi, pemasangan tray, terminasi heat/cold shrink, dan pengujian isolasi Hi-Pot.'
WHERE slug = 'cable-pulling-termination' OR slug = 'mv-lv-cable-installation-termination';

UPDATE services SET
  title = E'EN: Grounding & Lightning Protection System\nID: Sistem Pembumian & Proteksi Petir',
  summary = E'EN: Deep well grounding installation, exothermic CAD welding, copper tape routing, and early streamer emission (ESE) lightning protection.\nID: Instalasi pembumian deep well, pengelasan eksotermik CAD, penarikan pita tembaga, dan penangkal petir elektrostatis (ESE).'
WHERE slug = 'grounding-lightning-protection';

UPDATE services SET
  title = E'EN: Busduct & Canalis Trunking Installation\nID: Instalasi Busduct & Trunking Canalis',
  summary = E'EN: High-amperage sandwich busduct feeder erection, tap-off unit installation, and torque-checked jointing for industrial plants.\nID: Pemasangan busduct sandwich ampere tinggi, unit tap-off, dan penyambungan terverifikasi torsi untuk pabrik industri.'
WHERE slug = 'busduct-canalis-installation';

UPDATE services SET
  title = E'EN: Electrical Maintenance & Servicing\nID: Pemeliharaan & Perawatan Sistem Kelistrikan',
  summary = E'EN: Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.\nID: Layanan pemeliharaan preventif, prediktif, dan korektif komprehensif untuk trafo, kubikel MV, papan distribusi, dan circuit breaker.'
WHERE slug = 'electrical-maintenance-service';

UPDATE services SET
  title = E'EN: Transformer Maintenance & Oil Purification\nID: Pemeliharaan Trafo & Pemurnian Minyak',
  summary = E'EN: On-site transformer oil purification, vacuum dehydration, BDV breakdown testing, DGA gas analysis, and silica gel replacement.\nID: Pemurnian minyak trafo on-site, dehidrasi vakum, pengujian tegangan tembus (BDV), analisis gas DGA, dan penggantian silika gel.'
WHERE slug = 'transformer-maintenance-purification' OR slug = 'transformer-oil-treatment-dga';

UPDATE services SET
  title = E'EN: MV Cubicle & Switchgear Servicing\nID: Servis Kubikel & Switchgear Tegangan Menengah',
  summary = E'EN: Mechanism lubrication, contact resistance (Ductor), vacuum bottle integrity, and secondary protection relay testing.\nID: Pelumasan mekanisme, uji resistansi kontak (Ductor), integritas botol vakum, dan pengujian relay proteksi sekunder.'
WHERE slug = 'mv-cubicle-switchgear-servicing' OR slug = 'mv-cubicle-acb-maintenance';

UPDATE services SET
  title = E'EN: Annual Plant Shutdown Maintenance\nID: Pemeliharaan Berkala Shutdown Pabrik Tahunan',
  summary = E'EN: Total electrical system overhaul during planned facility shutdowns: busbar torque checks, insulation resistance, and contact cleaning.\nID: Overhaul total sistem kelistrikan saat shutdown pabrik: pemeriksaan torsi busbar, resistansi isolasi, dan pembersihan kontak.'
WHERE slug = 'annual-shutdown-maintenance' OR slug = 'annual-maintenance-contracts';

UPDATE services SET
  title = E'EN: Low Voltage Switchboard Maintenance\nID: Pemeliharaan Papan Hubung Tegangan Rendah',
  summary = E'EN: ACB/MCCB servicing, cradle mechanism testing, thermal scanning, and digital trip unit secondary injection calibration.\nID: Servis ACB/MCCB, pengujian mekanisme cradle, pemindaian termal, dan kalibrasi injeksi sekunder trip unit digital.'
WHERE slug = 'low-voltage-switchboard-maintenance';

UPDATE services SET
  title = E'EN: Industrial UPS & Battery Bank Maintenance\nID: Pemeliharaan UPS Industri & Bank Baterai',
  summary = E'EN: Impedance testing, conductance measurement, cell equalization, and autonomy discharge runtime testing for critical power UPS.\nID: Uji impedansi baterai, pengukuran konduktansi, ekualisasi sel, dan pengujian runtime debit untuk sistem UPS kritis.'
WHERE slug = 'ups-battery-bank-maintenance';

UPDATE services SET
  title = E'EN: Automation Solutions & Services\nID: Solusi & Layanan Otomasi Industri',
  summary = E'EN: Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.\nID: Otomasi industri, sistem SCADA (xArrow & EcoStruxure), pemrograman PLC, Pemantauan Energi (PME), dan optimasi proses manufaktur.'
WHERE slug = 'automation-solutions-services';

UPDATE services SET
  title = E'EN: SCADA & Industrial Process Automation\nID: SCADA & Otomasi Proses Industri',
  summary = E'EN: High-performance HMI/SCADA design, telemetry, alarm management, historical trending, and batch control integration.\nID: Desain HMI/SCADA performa tinggi, telemetri, manajemen alarm terpusat, tren historis, dan integrasi kontrol batch.'
WHERE slug = 'scada-process-automation' OR slug = 'scada-hmi-process-monitoring';

UPDATE services SET
  title = E'EN: PLC & Distributed Control Systems (DCS)\nID: Pemrograman PLC & Sistem Kontrol Terdistribusi (DCS)',
  summary = E'EN: Architecture design, logic programming, and commissioning for Schneider Modicon, Siemens S7, Rockwell, and Omron.\nID: Desain arsitektur, pemrograman logika kontrol, dan komisioning untuk Schneider Modicon, Siemens S7, Rockwell, dan Omron.'
WHERE slug = 'plc-dcs-programming' OR slug = 'plc-vsd-system-integration';

UPDATE services SET
  title = E'EN: Power Management System (Schneider PME)\nID: Sistem Manajemen Daya Listrik (Schneider PME)',
  summary = E'EN: Real-time energy baseline tracking, power quality event capture, peak demand shaving, and ISO 50001 compliance dashboards.\nID: Pemantauan baseline energi real-time, perekaman event kualitas daya, pemangkasan beban puncak, dan dashboard kepatuhan ISO 50001.'
WHERE slug = 'power-management-system-pme' OR slug = 'energy-management-iso50001';

UPDATE services SET
  title = E'EN: Building Automation & HVAC Control (BAS)\nID: Otomasi Gedung & Kontrol HVAC (BAS)',
  summary = E'EN: Centralized HVAC chiller plant optimization, AHU VAV control, lighting automation, and Modbus/BACnet integration.\nID: Optimasi sistem pendingin chiller HVAC, kontrol AHU VAV, otomasi tata cahaya, dan integrasi protokol Modbus/BACnet.'
WHERE slug = 'building-automation-system-bas';

UPDATE services SET
  title = E'EN: Variable Speed Drive (VFD) Solutions\nID: Solusi Inverter & Variable Speed Drive (VFD)',
  summary = E'EN: Energy-saving variable torque pump/fan control, harmonic mitigation, dynamic braking, and drive panel engineering.\nID: Penghematan energi motor pompa/fan, mitigasi harmonisa, pengereman dinamis, dan perakitan panel inverter VFD.'
WHERE slug = 'variable-speed-drive-vfd-solutions';

UPDATE services SET
  title = E'EN: Inspection, Testing & Commissioning\nID: Inspeksi, Pengujian & Commissioning',
  summary = E'EN: Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.\nID: Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.'
WHERE slug = 'inspection-testing-commissioning';

UPDATE services SET
  title = E'EN: Relay Protection Calibration & Coordination\nID: Kalibrasi Relay Proteksi & Studi Koordinasi',
  summary = E'EN: Secondary injection testing (Omicron CMC), relay tripping curves, overcurrent, earth fault, differential, and distance protection.\nID: Pengujian injeksi sekunder (Omicron CMC), kurva trip relay proteksi arus lebih, gangguan tanah, diferensial, dan jarak.'
WHERE slug = 'relay-protection-calibration' OR slug = 'relay-protection-testing-commissioning';

UPDATE services SET
  title = E'EN: Transformer Oil BDV & DGA Laboratory Testing\nID: Uji Laboratorium BDV & DGA Minyak Trafo',
  summary = E'EN: Dielectric breakdown voltage testing (IEC 60156), Karl Fischer moisture analysis, and Dissolved Gas Analysis (DGA).\nID: Uji tegangan tembus dielektrik (IEC 60156), kadar air Karl Fischer, dan Dissolved Gas Analysis (DGA).'
WHERE slug = 'transformer-oil-bdv-dga-testing';

UPDATE services SET
  title = E'EN: Infrared Thermography Electrical Audit\nID: Audit Termografi Inframerah Sistem Elektrikal',
  summary = E'EN: Calibrated FLIR thermal imaging to locate high-resistance contact joints, loose terminal bolts, and unbalanced line loading.\nID: Pemindaian termal FLIR terkalibrasi untuk mendeteksi kontak beresistansi tinggi, baut longgar, dan ketidakseimbangan beban fasa.'
WHERE slug = 'infrared-thermography-inspection' OR slug = 'thermography-predictive-maintenance';

UPDATE services SET
  title = E'EN: Hi-Pot & Insulation Resistance Diagnostics\nID: Uji Hi-Pot & Diagnostik Resistansi Isolasi',
  summary = E'EN: VLF 0.1Hz AC / DC High-Potential testing up to 80kV, polarization index (PI), and dielectric absorption ratio (DAR).\nID: Pengujian High-Potential VLF 0.1Hz AC / DC hingga 80kV, indeks polarisasi (PI), dan rasio serapan dielektrik (DAR).'
WHERE slug = 'hi-pot-insulation-resistance-test';

UPDATE services SET
  title = E'EN: Breaker Timing & Contact Resistance (Ductor)\nID: Waktu Buka-Tutup Breaker & Resistansi Kontak',
  summary = E'EN: Micro-ohm contact resistance measurement, breaker opening/closing speed, pole synchronization, and auxiliary contact check.\nID: Pengukuran resistansi kontak mikro-ohm, kecepatan buka/tutup kontak breaker, sinkronisasi fasa, dan kontak bantu.'
WHERE slug = 'breaker-timing-contact-resistance';

UPDATE services SET
  title = E'EN: Mechanical Services & Supplies\nID: Layanan Mekanikal & Pengadaan Industri',
  summary = E'EN: Industrial piping, chiller plant installation, pump overhaul, dynamic balancing, and air handling equipment.\nID: Pemipaan industri, instalasi chiller, overhaul pompa, balancing dinamis, dan perlengkapan penanganan udara pabrik.'
WHERE slug = 'mechanical-services-supplies';

UPDATE services SET
  title = E'EN: Chiller Plant & HVAC Mechanical Piping\nID: Sistem Chiller Pabrik & Pemipaan Mekanikal HVAC',
  summary = E'EN: Chilled water headers, condenser loops, pump skids, balancing valves, and polyurethane insulation cladding.\nID: Header air dingin, loop kondensor, skid pompa, katup penyeimbang, dan insulasi poliuretan berkualitas tinggi.'
WHERE slug = 'chiller-hvac-mechanical-piping';

UPDATE services SET
  title = E'EN: Industrial Pump & Valve Overhaul\nID: Overhaul Pompa & Katup Industri',
  summary = E'EN: Impeller balancing, mechanical seal replacement, laser shaft alignment, and hydro-static pressure testing.\nID: Balancing impeller, penggantian mechanical seal, penyelarasan poros laser presisi, dan uji tekanan hidrostatis.'
WHERE slug = 'pump-valve-overhaul-alignment';

UPDATE services SET
  title = E'EN: Compressed Air Ring Main Installation\nID: Instalasi Jaringan Pemipaan Udara Bertekanan',
  summary = E'EN: Aluminum / stainless steel compressed air distribution loops, receiver tank placement, air dryers, and filtration manifolds.\nID: Distribusi udara bertekanan aluminium / stainless steel, tangki penampung, pengering udara, dan manifold filtrasi.'
WHERE slug = 'air-compressor-piping-installation';

UPDATE services SET
  title = E'EN: Fire Protection Sprinkler & Hydrant System\nID: Sistem Sprinkler Proteksi Kebakaran & Hidran',
  summary = E'EN: Fire pump room installation (NFPA 20), wet pipe sprinkler grids, outdoor pillar hydrants, and Siamese connections.\nID: Instalasi ruang pompa pemadam (NFPA 20), jaringan sprinkler pipa basah, hidran pilar outdoor, dan sambungan Siamese.'
WHERE slug = 'fire-protection-sprinkler-hydrant' OR slug = 'fire-alarm-system-installation';

UPDATE services SET
  title = E'EN: Industrial Ventilation & Exhaust Ductwork\nID: Ventilasi Industri & Saluran Pembuangan Udara',
  summary = E'EN: Centrifugal exhaust blowers, spiral galvanized ducting, kitchen hood hoods, and hazardous fume extraction.\nID: Blower pembuangan sentrifugal, ducting spiral galvanis, hood industri, dan ekstraksi asap berbahaya.'
WHERE slug = 'exhaust-ventilation-ductwork';

-- 2. UPDATE PRODUCTS
UPDATE products SET
  title = E'EN: Rittal Authorized Distributor\nID: Distributor Resmi Rittal',
  summary = E'EN: Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, power distribution, and IT infrastructure systems.\nID: Distributor resmi untuk sistem enclosure industri Rittal, climate control & pendingin, distribusi daya, dan infrastruktur IT.'
WHERE slug = 'rittal-distributor';

UPDATE products SET
  title = E'EN: Rittal Enclosure Systems (VX25, AX, KX)\nID: Sistem Enclosure Rittal (VX25, AX, KX)',
  summary = E'EN: Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.\nID: Sistem enclosure besar baying resmi Rittal (VX25), enclosure kompak (AX), kotak terminal kecil (KX), dan rak server IT outdoor.'
WHERE slug = 'enclosures';

UPDATE products SET
  title = E'EN: Rittal Climate Control & Cooling (Blue e+)\nID: Sistem Pendingin & Climate Control Rittal (Blue e+)',
  summary = E'EN: Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.\nID: Unit pendingin hibrida inovatif, thermoelectric cooler, dan penukar panas air-ke-udara hemat energi hingga 75% dengan pemantauan IoT digital.'
WHERE slug = 'climate-control-cooling';

UPDATE products SET
  title = E'EN: Rittal Power Distribution (Ri4Power & RiLine)\nID: Sistem Distribusi Daya Rittal (Ri4Power & RiLine)',
  summary = E'EN: Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.\nID: Sistem distribusi daya busbar dan switchgear tegangan rendah type-tested hingga 6300A sesuai standar IEC 61439-1/-2.'
WHERE slug = 'power-distribution';

UPDATE products SET
  title = E'EN: Schneider Electric System Integrator\nID: System Integrator Resmi Schneider Electric',
  summary = E'EN: Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.\nID: System Integrator dan Solutions Partner bersertifikat penyedia otomasi industri, pemantauan energi, dan distribusi elektrikal.'
WHERE slug = 'schneider-integrator';

UPDATE products SET
  title = E'EN: Schneider Industrial Automation (Modicon & EcoStruxure)\nID: Otomasi Industri Schneider (Modicon & EcoStruxure)',
  summary = E'EN: Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.\nID: Sistem otomasi PLC/PAC lengkap beranggotakan Schneider Modicon M340, M580 ePAC, Magelis HMI, dan arsitektur EcoStruxure Plant.'
WHERE slug = 'industrial-automation';

UPDATE products SET
  title = E'EN: Power & Energy Monitoring (PME & PowerLogic)\nID: Pemantauan Daya & Energi (PME & PowerLogic)',
  summary = E'EN: Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.\nID: Power meter digital Schneider PowerLogic, ION meter, dan perangkat lunak EcoStruxure Power Monitoring Expert (PME).'
WHERE slug = 'power-energy-monitoring';

UPDATE products SET
  title = E'EN: Electrical Distribution Integration (MasterPact & Prisma)\nID: Integrasi Distribusi Elektrikal (MasterPact & Prisma)',
  summary = E'EN: MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.\nID: Circuit breaker udara MasterPact MTZ/NW, breaker cetak Compact NSX, dan integrasi switchboard type-tested Prisma.'
WHERE slug = 'electrical-distribution-integration';

UPDATE products SET
  title = E'EN: Schneider Engineering, FAT/SAT & Commissioning Support\nID: Rekayasa Schneider, Dukungan FAT/SAT & Commissioning',
  summary = E'EN: Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.\nID: Factory acceptance testing (FAT), site acceptance testing (SAT), koordinasi proteksi relay, dan commissioning bertegangan.'
WHERE slug = 'engineering-commissioning';

UPDATE products SET
  title = E'EN: Electrical Distribution\nID: Peralatan Distribusi Listrik',
  summary = E'EN: Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.\nID: Peralatan distribusi kelistrikan tegangan menengah & rendah, panel switchboard, transformator, dan sistem proteksi daya.'
WHERE slug = 'electrical-distribution';

UPDATE products SET
  title = E'EN: Automation & Control\nID: Kontrol & Otomasi Industri',
  summary = E'EN: Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.\nID: Otomasi industri, sistem PLC, visualisasi proses SCADA/HMI, dan penggerak motor (inverter/VSD).'
WHERE slug = 'automation-control';

UPDATE products SET
  title = E'EN: Enclosure & Climate Control\nID: Enclosure & Manajemen Suhu Industri',
  summary = E'EN: Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.\nID: Enclosure industri, rak server, climate control, dan sistem pendingin untuk lingkungan manufaktur yang menuntut ketahanan tinggi.'
WHERE slug = 'enclosure-climate-control';

UPDATE products SET
  title = E'EN: Power Quality\nID: Solusi Kualitas Daya Listrik',
  summary = E'EN: Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.\nID: Filter harmonisa aktif, perbaikan faktor daya, kapasitor bank, dan penganalisis kualitas daya.'
WHERE slug = 'power-quality';

COMMIT;
