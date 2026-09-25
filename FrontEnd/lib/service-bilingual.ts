import type { ContentNode } from "@/lib/cms"
import { extractBilingualText, combineBilingualText } from "@/lib/bilingual"

export type BilingualServiceEntry = {
  id?: string
  slug: string
  fullPath: string
  title: { en: string; id: string }
  summary: { en: string; id: string }
  content: { en: string; id: string }
  imageUrl?: string
  status?: string
  depth?: number
  sortOrder?: number
}

export const BILINGUAL_SERVICE_CATALOG: Record<string, BilingualServiceEntry> = {
  "electrical-construction-installation": {
    id: "serv-electrical-construction",
    slug: "electrical-construction-installation",
    fullPath: "electrical-construction-installation",
    depth: 0,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/construction-installation.jpg",
    title: {
      en: "Electrical Construction & Installation",
      id: "Konstruksi & Instalasi Elektrikal",
    },
    summary: {
      en: "Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.",
      id: "Solusi terintegrasi instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, pemasangan trafo, dan terminasi kabel.",
    },
    content: {
      en: `<h3>End-to-End Industrial Electrical Construction</h3>
<p>PT Multi Daya Mitra provides comprehensive electrical construction and installation services for manufacturing plants, utility substations, commercial towers, and industrial infrastructure. Supported by licensed engineers and certified field technicians, we execute complex turnkey electrical works with uncompromising precision, safety, and operational reliability.</p>
<h3>Integrated Installation Work Scope</h3>
<p>Our turnkey capabilities cover substation civil-electrical integration, medium-voltage (MV) switchgear erection, power transformer positioning and oil filling, low-voltage (LV) main distribution board assembly, high-amp busduct trunking, and certified power cabling networks. All works strictly comply with SPLN, PUIL 2011, and IEC standards to guarantee long-term operational resilience.</p>`,
      id: `<h3>Konstruksi & Instalasi Elektrikal Industri Terpadu</h3>
<p>PT Multi Daya Mitra menyediakan layanan konstruksi dan instalasi elektrikal komprehensif untuk fasilitas pabrik manufaktur, gardu induk utilitas, gedung komersial, dan infrastruktur industri. Didukung oleh insinyur berizin resmi dan teknisi lapangan tersertifikasi, kami melaksanakan proyek elektrikal turnkey dengan ketelitian tinggi, standar keselamatan kerja ketat, dan keandalan operasional jangka panjang.</p>
<h3>Lingkup Pekerjaan Instalasi Terintegrasi</h3>
<p>Kapabilitas kami mencakup integrasi sipil-elektrikal gardu induk, pemasangan switchgear tegangan menengah (TM), penempatan dan pengisian minyak transformator daya, perakitan panel distribusi utama tegangan rendah (TR), pemasangan trunking busduct ampere tinggi, dan jaringan kabel daya tersertifikasi. Seluruh pekerjaan mematuhi standar SPLN, PUIL 2011, dan IEC untuk menjamin keandalan sistem tanpa kompromi.</p>`,
    },
  },

  "electrical-construction-installation/substation-mv-switchgear-installation": {
    id: "serv-substation-installation",
    slug: "substation-mv-switchgear-installation",
    fullPath: "electrical-construction-installation/substation-mv-switchgear-installation",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/medium-voltage-equipment.jpg",
    title: {
      en: "Substation & MV Switchgear Installation",
      id: "Instalasi Gardu Induk & Switchgear Tegangan Menengah (MV)",
    },
    summary: {
      en: "Medium voltage metal-clad switchgear, power transformers, oil containment, and civil-electrical integration up to 36kV.",
      id: "Pemasangan switchgear metal-clad tegangan menengah, transformator daya, bak penampung oli, dan integrasi sipil-elektrikal hingga 36kV.",
    },
    content: {
      en: `<h3>Medium Voltage Substation EPC Services</h3>
<p>Complete engineering, procurement, and construction (EPC) services for medium voltage outdoor and indoor substations up to 36 kV. We coordinate the seamless installation of primary utility incoming bays, step-down power transformers, and metal-clad switchgear assemblies.</p>
<h3>MV Switchgear & Transformer Erection</h3>
<p>Installation and alignment of air-insulated (AIS) and gas-insulated (GIS) switchgear, vacuum circuit breakers (VCB), transformer placement over oil-containment sumps, silica gel breathers, and busduct connections compliant with IEC 62271-200 and SPLN standards.</p>
<h3>Testing, Interlocking & Energization</h3>
<p>Rigorous pre-commissioning verification including CT/PT polarity and ratio testing, breaker timing analysis, mechanical safety interlock checks, and coordinated energization protocols in collaboration with regional utility authorities.</p>`,
      id: `<h3>Layanan EPC Gardu Induk Tegangan Menengah</h3>
<p>Layanan rekayasa teknik, pengadaan, dan konstruksi (EPC) lengkap untuk gardu induk outdoor dan indoor tegangan menengah hingga 36 kV. Kami mengoordinasikan instalasi penyulang utama PLN, transformator daya penurun tegangan, dan rangkaian panel kubikel metal-clad secara terpadu.</p>
<h3>Pemasangan Switchgear MV & Transformator Daya</h3>
<p>Pemasangan dan perataan kubikel berinsulasi udara (AIS) maupun gas (GIS), vacuum circuit breaker (VCB), penempatan transformator di atas bak penampung oli darurat, instalasi breather silika gel, dan koneksi busduct sesuai standar IEC 62271-200 dan SPLN.</p>
<h3>Pengujian, Interlock & Tahapan Energize</h3>
<p>Verifikasi pra-komisioning menyeluruh mencakup rasio dan polaritas CT/PT, uji waktu pemutusan breaker, pemeriksaan interlock mekanik/listrik keselamatan, serta protokol energize bertegangan bekerja sama dengan otoritas utilitas ketenagalistrikan.</p>`,
    },
  },

  "electrical-construction-installation/lv-distribution-panels-assembly": {
    id: "serv-lv-panel-assembly",
    slug: "lv-distribution-panels-assembly",
    fullPath: "electrical-construction-installation/lv-distribution-panels-assembly",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/mdm/circuit-breaker.jpg",
    title: {
      en: "LV Panels Assembly (MDP, SDP, ATS & Sync)",
      id: "Perakitan Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)",
    },
    summary: {
      en: "Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).",
      id: "Panel Distribusi Utama (MDP), Panel Sub-Distribusi, panel sinkronisasi ATS/AMF, dan Motor Control Center (MCC).",
    },
    content: {
      en: `<h3>Custom Engineered Low Voltage Switchboards</h3>
<p>Custom electrical distribution and control panel engineering for reliable power routing, automated generator synchronization, and motor control across industrial manufacturing facilities up to 6300A.</p>
<h3>Main & Sub-Distribution Architecture</h3>
<p>Fabricated using 99.9% Cu-ETP high-purity copper busbars, type-tested enclosure frameworks (up to Form 4b segregation), and intelligent circuit breakers (MasterPact MTZ, Compact NSX) with embedded energy metering and communication modules.</p>
<h3>ATS / AMF Generator Synchronization</h3>
<p>Automatic Transfer Switch (ATS) and Automatic Mains Failure (AMF) synchronization boards engineered with digital multi-generator controllers, motorized changeover switches, and automatic load-shedding algorithms for zero-interruption plant uptime.</p>`,
      id: `<h3>Panel Distribusi Tegangan Rendah Rekayasa Khusus</h3>
<p>Rekayasa teknik dan fabrikasi panel distribusi daya tegangan rendah untuk penyaluran tenaga listrik yang andal, sinkronisasi genset otomatis, dan kontrol motor industri hingga 6300A.</p>
<h3>Arsitektur Distribusi Utama (MDP) & Sub-Distribusi (SDP)</h3>
<p>Dirakit menggunakan busbar tembaga murni 99,9% Cu-ETP, struktur enclosure bersertifikasi type-tested (hingga pemisahan internal Form 4b), dan circuit breaker cerdas (MasterPact MTZ, Compact NSX) dengan modul pengukuran energi dan komunikasi data terintegrasi.</p>
<h3>Panel ATS / AMF & Sinkronisasi Generator</h3>
<p>Panel Automatic Transfer Switch (ATS) dan Automatic Mains Failure (AMF) yang dirancang dengan kontroler multi-genset digital, motorized changeover switch, serta logika pelepasan beban otomatis (load shedding) demi keandalan operasional fasilitas tanpa henti.</p>`,
    },
  },

  "electrical-construction-installation/mv-lv-cable-installation-termination": {
    id: "serv-cabling-termination",
    slug: "mv-lv-cable-installation-termination",
    fullPath: "electrical-construction-installation/mv-lv-cable-installation-termination",
    depth: 1,
    sortOrder: 3,
    imageUrl: "/uploads/mdm/electrical-equipment.jpg",
    title: {
      en: "MV & LV Cable Installation & Termination",
      id: "Instalasi & Terminasi Kabel MV & LV",
    },
    summary: {
      en: "Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.",
      id: "Penarikan kabel tersertifikasi, pemasangan tray, terminasi heat-shrink/cold-shrink, dan pengujian isolasi Hi-Pot.",
    },
    content: {
      en: `<h3>Certified Power Cable Installation & Jointing</h3>
<p>Certified MV/LV cable pulling, tray routing, jointing, and termination services for industrial power distribution networks. Handled exclusively by certified jointer technicians adhering to strict bending radiuses and tension limits.</p>
<h3>Heat-Shrink & Cold-Shrink Terminations</h3>
<p>Execution of indoor and outdoor cable terminations and straight-through joints using premium 3M and Raychem kits, ensuring continuous moisture sealing, stress-control grading, and high dielectric strength.</p>
<h3>VLF & DC Hi-Pot Verification Testing</h3>
<p>Every installed feeder is subjected to Very Low Frequency (VLF) AC withstand testing, sheath integrity insulation resistance checks, and phase continuity verification before being signed off for live energization.</p>`,
      id: `<h3>Instalasi & Terminasi Kabel Daya Tersertifikasi</h3>
<p>Layanan penarikan kabel TM/TR, pemasangan jalur cable tray, penyambungan (jointing), dan terminasi untuk jaringan distribusi tenaga listrik industri. Dikerjakan khusus oleh teknisi jointer bersertifikasi dengan mematuhi radius tekuk dan batas tegangan tarik standar.</p>
<h3>Terminasi Heat-Shrink & Cold-Shrink</h3>
<p>Pengerjaan terminasi kabel indoor/outdoor serta straight-through joint menggunakan kit berkualitas premium dari 3M dan Raychem, menjamin kerapatan kedap air, pengendalian gradien medan listrik (stress control), dan kekuatan dielektrik tinggi.</p>
<h3>Pengujian Verifikasi Hi-Pot VLF & DC</h3>
<p>Setiap kabel penyulang yang telah terpasang diuji ketahanan isolasinya menggunakan alat uji tegangan tinggi Very Low Frequency (VLF), uji ketahanan selubung luar (sheath test), serta verifikasi kontinuitas fasa sebelum serah terima energize.</p>`,
    },
  },

  "electrical-construction-installation/fire-alarm-system-installation": {
    id: "serv-fire-alarm-install",
    slug: "fire-alarm-system-installation",
    fullPath: "electrical-construction-installation/fire-alarm-system-installation",
    depth: 1,
    sortOrder: 4,
    imageUrl: "/uploads/PM-Fire-Alarm-1.jpg",
    title: {
      en: "Fire Alarm System Engineering & Installation",
      id: "Rekayasa & Instalasi Sistem Fire Alarm",
    },
    summary: {
      en: "Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.",
      id: "Jaringan fire alarm addressable terintegrasi, detektor multi-sensor, aspirating smoke detection, dan sistem pemadam clean agent.",
    },
    content: {
      en: `<h3>Turnkey Industrial Fire Safety Engineering</h3>
<p>Design, installation, and commissioning of integrated fire detection and alarm architectures compliant with NFPA 72, NFPA 2001, and Indonesian building safety codes. Engineered to deliver early warning and rapid containment in high-risk industrial environments.</p>
<h3>Addressable Detection & Smoke Aspiration</h3>
<p>Deployment of intelligent addressable panels, multi-criteria optical/thermal detectors, beam smoke sensors, and aspirating smoke detection (VESDA) systems capable of detecting smoldering combustion in server rooms, cable vaults, and high-ceiling warehouses.</p>
<h3>Clean Agent Suppression & BMS Interlock</h3>
<p>Automated fire suppression systems utilizing FM-200, Novec 1230, or inert gases, complete with acoustic-visual sounders, door-release interlocks, HVAC damper shutoff, and Building Management System (BMS) supervisory alerting.</p>`,
      id: `<h3>Rekayasa Sistem Keselamatan Kebakaran Industri Turnkey</h3>
<p>Perancangan, instalasi, dan komisioning arsitektur deteksi dan alarm kebakaran terintegrasi sesuai standar NFPA 72, NFPA 2001, dan regulasi keselamatan gedung nasional. Dirancang untuk memberikan peringatan dini dan respons cepat pada fasilitas industri berisiko tinggi.</p>
<h3>Deteksi Addressable & Sistem Aspirasi Asap</h3>
<p>Pemasangan panel addressable pintar, detektor asap optik/panas multi-kriteria, beam smoke sensor, serta sistem aspirasi asap dini (VESDA) yang mampu mendeteksi partikel asap sebelum terbentuk kobaran api di ruang server, terowongan kabel, dan gudang berplafon tinggi.</p>
<h3>Pemadam Gas Clean Agent & Interlock BMS</h3>
<p>Sistem pemadaman otomatis menggunakan gas clean agent seperti FM-200, Novec 1230, atau gas inert, dilengkapi sirine-strobo evakuasi, interlock pelepas pintu darurat, penutupan damper HVAC otomatis, serta integrasi pemantauan ke sistem BMS gedung.</p>`,
    },
  },

  "electrical-maintenance-service": {
    id: "serv-electrical-maintenance",
    slug: "electrical-maintenance-service",
    fullPath: "electrical-maintenance-service",
    depth: 0,
    sortOrder: 2,
    imageUrl: "/uploads/mdm/maintenance-contract.jpg",
    title: {
      en: "Electrical Maintenance & Servicing",
      id: "Pemeliharaan & Perawatan Sistem Kelistrikan",
    },
    summary: {
      en: "Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.",
      id: "Layanan pemeliharaan preventif, prediktif, dan korektif komprehensif untuk trafo, kubikel MV, papan distribusi, dan circuit breaker.",
    },
    content: {
      en: `<h3>Proactive Electrical Asset Lifecycle Management</h3>
<p>PT Multi Daya Mitra delivers comprehensive preventive, predictive, and condition-based maintenance programs designed to eliminate unscheduled outages, optimize energy efficiency, and extend the operating life of critical electrical equipment.</p>
<h3>Multi-Discipline Servicing Scope</h3>
<p>Our experienced service engineering teams inspect, service, and calibrate oil and dry-type transformers, medium voltage cubicles, vacuum circuit breakers, low-voltage switchboards, capacitor banks, and protection relays using industry-standard calibrated test equipment.</p>`,
      id: `<h3>Manajemen Pemeliharaan Aset Kelistrikan Proaktif</h3>
<p>PT Multi Daya Mitra menyediakan program pemeliharaan preventif, prediktif, dan berbasis kondisi (condition-based maintenance) yang dirancang untuk mencegah terjadinya downtime mendadak, mengoptimalkan efisiensi energi, serta memperpanjang umur pakai peralatan listrik utama pabrik.</p>
<h3>Cakupan Servis Multi-Disiplin</h3>
<p>Tim insinyur pemeliharaan kami yang berpengalaman menginspeksi, menyervis, dan mengalibrasi transformator tipe minyak maupun kering, kubikel tegangan menengah, vacuum circuit breaker, panel distribusi tegangan rendah, kapasitor bank, serta relai proteksi dengan instrumen uji terkalibrasi internasional.</p>`,
    },
  },

  "electrical-maintenance-service/transformer-oil-treatment-dga": {
    id: "serv-transformer-oil-dga",
    slug: "transformer-oil-treatment-dga",
    fullPath: "electrical-maintenance-service/transformer-oil-treatment-dga",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/micrologic-test.jpg",
    title: {
      en: "Transformer Oil Treatment, BDV & DGA",
      id: "Penanganan Minyak Trafo, Uji BDV & Analisis DGA",
    },
    summary: {
      en: "On-site oil purification, vacuum degassing, breakdown voltage (BDV) dielectric testing, and Dissolved Gas Analysis (DGA).",
      id: "Pemurnian minyak trafo on-site, degasifikasi vakum, pengujian tegangan tembus (BDV), dan Dissolved Gas Analysis (DGA).",
    },
    content: {
      en: `<h3>High-Vacuum Transformer Oil Purification & Dehydration</h3>
<p>On-site transformer oil filtration, vacuum dehydration, and degassing to remove dissolved moisture, sludge particles, and trapped gases, restoring transformer oil breakdown voltage to IEEE and IEC standards without draining the core.</p>
<h3>Breakdown Voltage (BDV) & Dielectric Testing</h3>
<p>Dielectric breakdown testing using calibrated automated oil testers to measure dielectric withstand strength (kV), acidity, interfacial tension (IFT), and power factor dissipation (tan delta).</p>
<h3>Dissolved Gas Analysis (DGA) & Condition Assessment</h3>
<p>Laboratory Dissolved Gas Analysis (DGA) identifying fault gas concentrations (Hydrogen, Methane, Ethylene, Acetylene, Carbon Monoxide) to diagnose active thermal hotspots, partial discharges, or internal arcing faults before catastrophic transformer failure.</p>`,
      id: `<h3>Pemurnian & Dehidrasi Minyak Trafo Vakum Tinggi</h3>
<p>Layanan filtrasi, dehidrasi vakum, dan degasifikasi minyak transformator on-site untuk menghilangkan kadar air terlarut, partikel lumpur, dan gelembung gas, memulihkan tegangan tembus minyak sesuai standar IEEE dan IEC tanpa perlu membongkar tangki.</p>
<h3>Pengujian Tegangan Tembus (BDV) & Dielektrik</h3>
<p>Pengujian breakdown voltage menggunakan alat uji minyak otomatis terkalibrasi untuk mengukur kekuatan dielektrik (kV), tingkat keasaman, tegangan antarmuka (IFT), dan faktor disipasi daya (tan delta).</p>
<h3>Analisis Gas Terlarut (DGA) & Penilaian Kondisi Trafo</h3>
<p>Pengujian laboratorium Dissolved Gas Analysis (DGA) untuk mengukur konsentrasi gas gangguan (Hidrogen, Metana, Etilen, Asetilen, Karbon Monoksida) guna mendiagnosis gejala overheating, partial discharge, atau busur api internal sebelum trafo mengalami kerusakan fatal.</p>`,
    },
  },

  "electrical-maintenance-service/mv-cubicle-acb-maintenance": {
    id: "serv-mv-acb-maintenance",
    slug: "mv-cubicle-acb-maintenance",
    fullPath: "electrical-maintenance-service/mv-cubicle-acb-maintenance",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/mdm/preventive-maintenance.jpg",
    title: {
      en: "MV Cubicle & ACB Maintenance (Trip Testing)",
      id: "Pemeliharaan Kubikel MV & ACB (Pengujian Trip)",
    },
    summary: {
      en: "Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.",
      id: "Servis preventif switchgear tegangan menengah, uji resistansi kontak (Ductor), uji isolasi, dan injeksi sekunder ACB.",
    },
    content: {
      en: `<h3>Preventive Maintenance for MV Cubicles & Switchgear</h3>
<p>Comprehensive preventive servicing and mechanical overhaul for medium voltage switchgear and low voltage air circuit breakers (ACB), maintaining switching reliability and minimizing unexpected tripping.</p>
<h3>Contact Resistance & Insulation Resistance Testing</h3>
<p>Micro-ohmmeter contact resistance measurement (Ductor testing) across main breaker contacts and busbar joints, combined with high-voltage Megger insulation resistance and polarization index (PI) checks.</p>
<h3>ACB Secondary Injection & Trip Mechanism Calibration</h3>
<p>Secondary current injection testing on electronic and microprocessor trip units (Schneider MicroLogic, ABB Ekip) to verify long-time, short-time, instantaneous, and ground-fault trip timing curves against original design settings.</p>`,
      id: `<h3>Pemeliharaan Preventif Kubikel TM & Switchgear</h3>
<p>Layanan servis preventif komprehensif dan overhaul mekanik untuk kubikel tegangan menengah serta Air Circuit Breaker (ACB) tegangan rendah, menjaga keandalan manuver sakelar dan meminimalkan insiden trip tak terduga.</p>
<h3>Pengujian Resistansi Kontak (Ductor) & Tahanan Isolasi</h3>
<p>Pengukuran resistansi kontak mikro-ohm (uji Ductor) pada kontak utama breaker dan sambungan busbar, dipadukan dengan pengujian tahanan isolasi tegangan tinggi (Megger) serta perhitungan indeks polarisasi (PI).</p>
<h3>Injeksi Sekunder ACB & Kalibrasi Mekanisme Trip</h3>
<p>Pengujian injeksi arus sekunder pada unit trip elektronik dan mikroprosesor (Schneider MicroLogic, ABB Ekip) untuk memverifikasi kurva waktu trip beban lebih (long-time), hubung singkat (short-time/instantaneous), dan gangguan tanah (ground-fault) sesuai koordinasi proteksi.</p>`,
    },
  },

  "electrical-maintenance-service/thermography-predictive-maintenance": {
    id: "serv-thermography",
    slug: "thermography-predictive-maintenance",
    fullPath: "electrical-maintenance-service/thermography-predictive-maintenance",
    depth: 1,
    sortOrder: 3,
    imageUrl: "/uploads/mdm/infrared-thermograph.jpg",
    title: {
      en: "Infrared Thermography & Predictive Maintenance",
      id: "Termografi Inframerah & Pemeliharaan Prediktif",
    },
    summary: {
      en: "Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, overloaded phases, and deteriorating contacts under full load.",
      id: "Pemindaian termal non-kontak FLIR untuk mendeteksi hot spot, sambungan busbar longgar, fase beban berlebih, dan degradasi kontak saat operasi penuh.",
    },
    content: {
      en: `<h3>Non-Destructive Thermal Anomaly Detection</h3>
<p>High-resolution infrared thermographic inspection conducted under live electrical operating conditions using calibrated FLIR industrial cameras, identifying thermal abnormalities before they cause equipment breakdown or fire hazards.</p>
<h3>Loose Connections, Phase Imbalances & Overloading</h3>
<p>Detect high-resistance electrical connections, oxidation on cable terminations, phase load imbalances, deteriorating circuit breaker contacts, and defective capacitor bank elements under normal production loads.</p>
<h3>Standardized ISO/ASNT Reporting & Severity Classification</h3>
<p>Delivered by certified Level II infrared thermographers, each inspection report includes thermal radiometric images, visual reference photos, delta-T temperature differential calculations, and prioritized corrective action recommendations.</p>`,
      id: `<h3>Deteksi Anomali Termal Non-Destruktif</h3>
<p>Inspeksi termografi inframerah beresolusi tinggi yang dilakukan langsung saat sistem beroperasi bertegangan penuh menggunakan kamera termal industri FLIR terkalibrasi, mendeteksi kenaikan suhu abnormal sebelum menimbulkan kerusakan fatal atau kebakaran.</p>
<h3>Sambungan Longgar, Ketidakseimbangan Fasa & Beban Lebih</h3>
<p>Mendeteksi resistansi kontak tinggi akibat sambungan baut longgar, oksidasi pada sepatu kabel, ketidakseimbangan beban antar fasa, keausan kontak circuit breaker, serta kerusakan elemen kapasitor bank saat pabrik beroperasi normal.</p>
<h3>Pelaporan Standar ISO/ASNT & Klasifikasi Tingkat Bahaya</h3>
<p>Dikerjakan oleh termografer bersertifikasi Level II internasional, setiap laporan inspeksi menyajikan foto radiometrik termal, foto visual acuan, perhitungan selisih suhu (delta-T), serta rekomendasi tindakan perbaikan sesuai skala prioritas.</p>`,
    },
  },

  "electrical-maintenance-service/annual-maintenance-contracts": {
    id: "serv-amc-contracts",
    slug: "annual-maintenance-contracts",
    fullPath: "electrical-maintenance-service/annual-maintenance-contracts",
    depth: 1,
    sortOrder: 4,
    imageUrl: "/uploads/mdm/maintenance-contract.jpg",
    title: {
      en: "Annual Maintenance Contracts (AMC) & 24/7 SLA",
      id: "Kontrak Pemeliharaan Tahunan (AMC) & SLA Siaga 24/7",
    },
    summary: {
      en: "Customized long-term service level agreements providing scheduled plant shutdowns, emergency call-outs, and spare parts management.",
      id: "Perjanjian tingkat layanan jangka panjang terpadu dengan shutdown terjadwal, respon darurat cepat, dan manajemen suku cadang.",
    },
    content: {
      en: `<h3>Guaranteed Plant Availability with Tailored AMC Plans</h3>
<p>Comprehensive service level agreements (SLA) engineered for continuous process facilities, data centers, and industrial factories, providing routine scheduled servicing, rapid-response emergency breakdown callouts, and lifecycle spares planning.</p>
<h3>Planned Annual Shutdown Execution</h3>
<p>Complete multi-team management during scheduled annual plant turnarounds, including total substation cleaning, busbar torque auditing, contact polishing, breaker mechanism lubrication, and full secondary injection calibration.</p>
<h3>24/7 Emergency Support & Strategic Spare Inventory</h3>
<p>Dedicated technical hotline and rapid mobilization response for critical electrical disruptions, supported by consignment spare parts management for circuit breakers, relays, and vital electrical components.</p>`,
      id: `<h3>Jaminan Ketersediaan Pabrik dengan Paket AMC Terencana</h3>
<p>Perjanjian tingkat layanan (SLA) komprehensif yang dirancang untuk fasilitas manufaktur berkelanjutan, pusat data, dan pabrik industri berat, menyediakan servis berkala terjadwal, respons darurat cepat saat gangguan, serta perencanaan suku cadang strategis.</p>
<h3>Eksekusi Pemeliharaan Rutin Shutdown Tahunan</h3>
<p>Pengelolaan tim teknis terpadu saat periode shutdown tahunan pabrik, mencakup pembersihan total gardu induk, audit torsi baut busbar, pemolesan kontak, pelumasan mekanisme mekanik breaker, dan kalibrasi injeksi sekunder menyeluruh.</p>
<h3>Dukungan Darurat 24/7 & Manajemen Suku Cadang</h3>
<p>Hotline teknis khusus dengan waktu respons mobilisasi cepat untuk menangani insiden kelistrikan kritis, didukung penyediaan suku cadang konsinyasi untuk circuit breaker, relai proteksi, dan komponen listrik vital lainnya.</p>`,
    },
  },

  "automation-solutions-services": {
    id: "serv-automation-solutions",
    slug: "automation-solutions-services",
    fullPath: "automation-solutions-services",
    depth: 0,
    sortOrder: 3,
    imageUrl: "/uploads/mdm/industrial-automation.jpg",
    title: {
      en: "Automation Solutions & Services",
      id: "Solusi & Layanan Otomasi Industri",
    },
    summary: {
      en: "Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.",
      id: "Otomasi industri, sistem SCADA (xArrow & EcoStruxure), pemrograman PLC, Pemantauan Energi (PME), dan optimasi proses manufaktur.",
    },
    content: {
      en: `<h3>Turnkey Industrial Automation & Process Control</h3>
<p>PT Multi Daya Mitra delivers integrated automation solutions that bridge field instrumentation, PLC control architectures, supervisory SCADA networks, and enterprise energy reporting into a unified, high-reliability platform.</p>
<h3>Certified System Integration Excellence</h3>
<p>As authorized solutions partners for xArrow SCADA and certified Schneider Electric system integrators, we provide custom software development, FAT/SAT testing, control cabinet assembly, and on-site commissioning across Indonesia.</p>`,
      id: `<h3>Otomasi Industri & Kontrol Proses Siap Pakai (Turnkey)</h3>
<p>PT Multi Daya Mitra menghadirkan solusi otomasi terintegrasi yang menjembatani instrumentasi lapangan, arsitektur kontrol PLC, jaringan supervisi SCADA, dan pelaporan efisiensi energi korporat ke dalam satu platform terpadu yang sangat andal.</p>
<h3>Keunggulan Integrator Sistem Tersertifikasi</h3>
<p>Sebagai mitra solusi resmi xArrow SCADA dan System Integrator Schneider Electric tersertifikasi, kami melayani pengembangan perangkat lunak kustom, pengujian FAT/SAT, perakitan kabinet kontrol, serta komisioning lapangan di seluruh Indonesia.</p>`,
    },
  },

  "automation-solutions-services/scada-hmi-process-monitoring": {
    id: "serv-scada-hmi",
    slug: "scada-hmi-process-monitoring",
    fullPath: "automation-solutions-services/scada-hmi-process-monitoring",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/xarrow.jpg",
    title: {
      en: "SCADA Systems, HMI & Centralized Telemetry",
      id: "Sistem SCADA, HMI & Telemetri Terpusat",
    },
    summary: {
      en: "Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.",
      id: "Kontrol pengawasan pabrik terpusat, tampilan mimic dinamis, pencatatan alarm, tren historis, dan telemetri industri.",
    },
    content: {
      en: `<h3>Plant-Wide Supervisory Control & Data Acquisition</h3>
<p>Full-scope SCADA and HMI engineering providing operators and plant managers with real-time operational visibility, animated process flowcharts, centralized setpoint management, and historical data logging.</p>
<h3>Multi-Protocol Telemetry & IoT Architecture</h3>
<p>Integration across diverse field communication standards including OPC UA, Modbus TCP/RTU, Profinet, MQTT, and BACnet, establishing unified communication between legacy machines and modern IIoT architectures.</p>
<h3>Alarm Management, Batch Recipes & Auditing</h3>
<p>Intelligent alarm classification with SMS/WhatsApp/email dispatch, automated batch recipe execution, and tamper-evident audit logging conforming to international industry quality guidelines.</p>`,
      id: `<h3>Sistem Supervisi & Akuisisi Data (SCADA) Seluruh Pabrik</h3>
<p>Rekayasa sistem SCADA dan antarmuka HMI menyeluruh yang menyajikan visibilitas operasional real-time bagi operator dan manajemen pabrik, diagram alir proses beranimasi interaktif, pengaturan setpoint terpusat, serta pencatatan data historis.</p>
<h3>Telemetri Multi-Protokol & Arsitektur IoT</h3>
<p>Integrasi di berbagai standar komunikasi industri termasuk OPC UA, Modbus TCP/RTU, Profinet, MQTT, dan BACnet, menyatukan komunikasi antara mesin manufaktur konvensional dan arsitektur IIoT modern.</p>
<h3>Manajemen Alarm Cerdas, Resep Batch & Audit Trail</h3>
<p>Klasifikasi prioritas alarm dengan pengiriman notifikasi instan melalui SMS/WhatsApp/email, otomatisasi eksekusi resep batch produksi, serta perekaman jejak audit antipemalsuan sesuai standar regulasi kualitas industri.</p>`,
    },
  },

  "automation-solutions-services/energy-management-iso50001": {
    id: "serv-energy-management",
    slug: "energy-management-iso50001",
    fullPath: "automation-solutions-services/energy-management-iso50001",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/PMS-Network_001.jpg",
    title: {
      en: "Energy Management Systems (EMS & ISO 50001)",
      id: "Sistem Manajemen Energi (EMS & ISO 50001)",
    },
    summary: {
      en: "Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.",
      id: "Pemantauan daya real-time, baseline energi otomatis, pelacakan beban puncak, dan pelaporan kepatuhan standar ESG.",
    },
    content: {
      en: `<h3>Digital Energy Monitoring & ISO 50001 Compliance</h3>
<p>Implementation of enterprise Energy Management Systems (EMS) powered by Schneider EcoStruxure Power Monitoring Expert (PME), enabling industrial plants to visualize energy flows, identify waste, and establish ISO 50001 energy baselines.</p>
<h3>Sub-Billing & Departmental Cost Allocation</h3>
<p>Automated electrical consumption metering by production line, tenant, or process area, generating precise cost allocation reports and verifying energy efficiency return-on-investment (ROI).</p>
<h3>ESG Scope 2 Carbon Accounting & Peak Shaving</h3>
<p>Continuous calculation of Scope 2 greenhouse gas emissions, automatic notifications for approaching PLN peak-demand penalty thresholds, and automated load shedding to avoid excess demand charges.</p>`,
      id: `<h3>Pemantauan Energi Digital & Kepatuhan ISO 50001</h3>
<p>Penerapan Sistem Manajemen Energi (EMS) terintegrasi berbasis Schneider EcoStruxure Power Monitoring Expert (PME), memungkinkan fasilitas industri memvisualisasikan konsumsi daya, mengeliminasi pemborosan, dan menetapkan baseline energi sesuai ISO 50001.</p>
<h3>Sub-Billing & Alokasi Biaya Departemen Otomatis</h3>
<p>Pengukuran konsumsi listrik mendalam berdasarkan lini produksi, mesin tertentu, atau penyewa (tenant), menghasilkan laporan pembebanan biaya akurat dan memvalidasi laba atas investasi (ROI) program efisiensi energi.</p>
<h3>Penghitungan Karbon ESG Scope 2 & Manajemen Beban Puncak</h3>
<p>Perhitungan emisi gas rumah kaca Scope 2 secara berkelanjutan, peringatan dini otomatis saat pemakaian mendekati ambang denda kVA puncak PLN, serta otomasi pelepasan beban untuk meminimalkan tagihan listrik bulanan.</p>`,
    },
  },

  "automation-solutions-services/plc-vsd-system-integration": {
    id: "serv-plc-vsd",
    slug: "plc-vsd-system-integration",
    fullPath: "automation-solutions-services/plc-vsd-system-integration",
    depth: 1,
    sortOrder: 3,
    imageUrl: "/uploads/products-schneider-automation.jpg",
    title: {
      en: "PLC Programming & Variable Speed Drive (VSD) Integration",
      id: "Pemrograman PLC & Integrasi Variable Speed Drive (VSD)",
    },
    summary: {
      en: "Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.",
      id: "Rekayasa logika PLC kustom, perakitan panel kontrol, penyetelan inverter Altivar/Danfoss/ABB, dan kontrol gerak presisi.",
    },
    content: {
      en: `<h3>Custom Industrial PLC Programming & System Integration</h3>
<p>Turnkey PLC control system design, programming, panel assembly, and commissioning covering Modicon (M580/M340/M241), Siemens S7 (1200/1500), and Rockwell Allen-Bradley platforms for automated industrial processes.</p>
<h3>Variable Speed Drive (VSD) & Inverter Tuning</h3>
<p>Integration of variable frequency drives (VFD) and soft starters (Schneider Altivar, Danfoss, ABB) for pumps, fans, compressors, and conveying machinery, delivering optimal torque control and significant energy savings.</p>
<h3>Safety PLCs & Fail-Safe Architecture</h3>
<p>Engineering SIL 3 / PLe compliant machine safety systems, emergency stop loops, light curtain interlocks, and two-hand safety monitoring for complete machinery risk mitigation.</p>`,
      id: `<h3>Pemrograman PLC Industri Kustom & Integrasi Sistem</h3>
<p>Perancangan sistem kendali PLC siap pakai, pemrograman logika, perakitan panel kabinet, dan komisioning untuk platform Modicon (M580/M340/M241), Siemens S7 (1200/1500), dan Rockwell Allen-Bradley di berbagai proses industri.</p>
<h3>Penyetelan Inverter & Variable Speed Drive (VSD)</h3>
<p>Integrasi inverter frekuensi variabel (VFD) dan soft starter (Schneider Altivar, Danfoss, ABB) untuk pompa, fan/blower, kompresor, dan konveyor industri, menghasilkan kontrol torsi presisi dan penghematan daya listrik signifikan.</p>
<h3>Safety PLC & Arsitektur Kendali Fail-Safe</h3>
<p>Rekayasa sistem keselamatan mesin berstandar SIL 3 / PLe, rangkaian tombol darurat (emergency stop), tirai cahaya optik (light curtain), dan pengaman dua tangan demi perlindungan total operator dari bahaya mekanikal.</p>`,
    },
  },

  "inspection-testing-commissioning": {
    id: "serv-inspection-testing",
    slug: "inspection-testing-commissioning",
    fullPath: "inspection-testing-commissioning",
    depth: 0,
    sortOrder: 4,
    imageUrl: "/uploads/mdm/testing-measurement.jpg",
    title: {
      en: "Inspection, Testing & Commissioning",
      id: "Inspeksi, Pengujian & Commissioning",
    },
    summary: {
      en: "Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.",
      id: "Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.",
    },
    content: {
      en: `<h3>Advanced Testing & Commissioning Services</h3>
<p>Comprehensive electrical testing, diagnostic inspection, and commissioning services to verify the safety, protection coordination, and operational integrity of industrial power systems before live handover.</p>
<h3>World-Class Calibrated Testing Fleet</h3>
<p>Our engineers utilize calibrated Omicron CMC 356 relay testers, Fluke 435-II Class A power analyzers, Megger insulation testers, EA Technology PD scanners, and FLIR thermal imagers to produce certified engineering test reports.</p>`,
      id: `<h3>Layanan Pengujian & Komisioning Tingkat Lanjut</h3>
<p>Layanan pengujian elektrikal, inspeksi diagnostik, dan komisioning komprehensif untuk memverifikasi keselamatan, koordinasi proteksi, dan keandalan operasional sistem kelistrikan industri sebelum serah terima resmi.</p>
<h3>Armada Alat Uji Terkalibrasi Kelas Dunia</h3>
<p>Insinyur kami mengoperasikan unit uji relai Omicron CMC 356 terkalibrasi, penganalisis kualitas daya Fluke 435-II Kelas A, Megger insulasi tegangan tinggi, pemindai PD EA Technology, dan kamera termal FLIR untuk menghasilkan laporan teknis resmi terakreditasi.</p>`,
    },
  },

  "inspection-testing-commissioning/power-quality-analysis-study": {
    id: "serv-power-quality-study",
    slug: "power-quality-analysis-study",
    fullPath: "inspection-testing-commissioning/power-quality-analysis-study",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/power-quality.jpg",
    title: {
      en: "Power Quality Analysis & Harmonics Study",
      id: "Analisis Kualitas Daya & Studi Harmonisa",
    },
    summary: {
      en: "Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, transient detection, and mitigation design.",
      id: "Perekaman kualitas daya Kelas A, audit distorsi harmonisa (THD), fluktuasi tegangan, deteksi transien, dan perancangan filter mitigasi.",
    },
    content: {
      en: `<h3>Class A Precision Power Quality Auditing</h3>
<p>Comprehensive power quality logging and analysis in accordance with IEC 61000-4-30 Class A and IEEE 519 standards using precision multi-channel analyzers to audit electrical disturbances under real operating conditions.</p>
<h3>Harmonic Distortion (THD) & Resonance Analysis</h3>
<p>Measurement of Total Harmonic Voltage Distortion (THDv) and Current Distortion (THDi) up to the 50th order, identifying resonance risks, overheated neutral conductors, and capacitor bank failures.</p>
<h3>Voltage Sag, Swell, Flicker & Transient Capture</h3>
<p>High-speed waveform capture recording sub-cycle voltage sags, swells, flicker, and switching transients that trigger sensitive PLC resets, VSD lockouts, and precision manufacturing defects.</p>`,
      id: `<h3>Audit Kualitas Daya Presisi Tinggi Standar Kelas A</h3>
<p>Perekaman dan analisis kualitas daya listrik komprehensif sesuai standar IEC 61000-4-30 Kelas A dan IEEE 519 menggunakan penganalisis multi-kanal presisi guna mengaudit gangguan kelistrikan saat operasi pabrik berlangsung.</p>
<h3>Analisis Distorsi Harmonisa (THD) & Risiko Resonansi</h3>
<p>Pengukuran distorsi harmonisa tegangan total (THDv) dan arus (THDi) hingga orde ke-50, mengidentifikasi bahaya resonansi sistem, pemanasan berlebih pada kawat netral, serta kerusakan fatal pada bank kapasitor.</p>
<h3>Tangkapan Fluktuasi Tegangan (Sag/Swell), Kedip & Transien</h3>
<p>Perekaman bentuk gelombang kecepatan tinggi untuk menangkap lonjakan tegangan (swell), penurunan sesaat (sag), kedipan (flicker), dan transien switching yang sering menyebabkan reset mendadak pada PLC, trip inverter VSD, serta cacat produksi.</p>`,
    },
  },

  "inspection-testing-commissioning/partial-discharge-pd-scan": {
    id: "serv-pd-scan",
    slug: "partial-discharge-pd-scan",
    fullPath: "inspection-testing-commissioning/partial-discharge-pd-scan",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/mdm/partial-discharge.jpg",
    title: {
      en: "Partial Discharge (PD) Scan & Insulation Diagnostics",
      id: "Pemindaian Partial Discharge (PD) & Diagnostik Isolasi",
    },
    summary: {
      en: "Non-invasive TEV (Transient Earth Voltage), acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.",
      id: "Sensor non-invasif TEV, ultrasonik akustik, dan HFCT untuk pemindaian PD switchgear dan kabel bertegangan langsung.",
    },
    content: {
      en: `<h3>Non-Invasive On-Line Partial Discharge Detection</h3>
<p>Early-stage detection of insulation deterioration in live medium and high-voltage assets (switchgear, transformers, cables, and busducts) without requiring plant power shutdowns.</p>
<h3>Multi-Sensor Measurement (TEV, Acoustic & HFCT)</h3>
<p>Simultaneous utilization of Transient Earth Voltage (TEV) sensors for internal voids, ultrasonic acoustic probes for surface tracking, and High-Frequency Current Transformers (HFCT) for cable termination PD activity.</p>
<h3>Condition-Based Maintenance Action Plans</h3>
<p>PD phase-resolved pulse analysis (PRPD) to classify discharge mechanisms (corona, surface, internal cavity), determine fault severity, and recommend scheduled repair before dielectric breakdown occurs.</p>`,
      id: `<h3>Deteksi Partial Discharge Bertegangan Non-Invasif (On-Line)</h3>
<p>Deteksi dini gejala degradasi isolasi pada aset tegangan menengah dan tinggi (switchgear, transformator, kabel daya, dan busduct) saat beroperasi tanpa memerlukan penghentian suplai listrik pabrik.</p>
<h3>Pengukuran Multi-Sensor (TEV, Akustik & HFCT)</h3>
<p>Pemanfaatan sensor Transient Earth Voltage (TEV) untuk mendeteksi rongga internal, sensor ultrasonik akustik untuk gejala perambatan permukaan (surface tracking), serta High-Frequency Current Transformer (HFCT) untuk kabel daya.</p>
<h3>Rencana Tindakan Pemeliharaan Berbasis Kondisi</h3>
<p>Analisis bentuk pulsa fase (PRPD) untuk mengklasifikasikan jenis lucutan (korona, permukaan, rongga dalam), menentukan tingkat keparahan anomali, dan menyusun rekomendasi perbaikan terencana sebelum terjadi ledakan dielektrik.</p>`,
    },
  },

  "inspection-testing-commissioning/relay-protection-testing-commissioning": {
    id: "serv-relay-protection",
    slug: "relay-protection-testing-commissioning",
    fullPath: "inspection-testing-commissioning/relay-protection-testing-commissioning",
    depth: 1,
    sortOrder: 3,
    imageUrl: "/uploads/mdm/secondary-injector.jpg",
    title: {
      en: "Protection Relay Testing (Secondary Injection)",
      id: "Pengujian Relay Proteksi (Injeksi Sekunder)",
    },
    summary: {
      en: "3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.",
      id: "Pengujian injeksi sekunder 3-fase & 6-fase menggunakan unit Omicron CMC untuk relay proteksi arus lebih, diferensial, dan jarak.",
    },
    content: {
      en: `<h3>Certified Protection Relay Secondary Injection Testing</h3>
<p>Comprehensive parameterization, timing curve verification, and secondary injection testing for electromechanical, static, and numerical protection relays compliant with IEC 60255 standards.</p>
<h3>Omicron Multi-Phase Automated Injection Sets</h3>
<p>Utilizing high-precision Omicron CMC 356 test sets to inject calibrated voltages and currents, verifying trip thresholds, operating times, and pick-up/drop-off ratios across 50/51 (overcurrent), 50N/51N (earth fault), 87 (differential), and 21 (distance) protection schemes.</p>
<h3>Coordination & Arc-Flash Clearing Time Verification</h3>
<p>Verification of discrimination margins against upstream utility protection and downstream circuit breakers, ensuring selective tripping that isolates localized faults without causing blackouts across adjacent plant sections.</p>`,
      id: `<h3>Pengujian Injeksi Sekunder Relai Proteksi Tersertifikasi</h3>
<p>Layanan parameterisasi, verifikasi kurva waktu karakteristik, dan pengujian injeksi sekunder komprehensif untuk relai proteksi elektromekanik, statik, maupun numerik digital sesuai standar IEC 60255.</p>
<h3>Alat Uji Injeksi Otomatis Multi-Fase Omicron</h3>
<p>Menggunakan unit uji presisi tinggi Omicron CMC 356 untuk menyuntikkan arus dan tegangan terkalibrasi, memverifikasi nilai ambang batas trip, waktu respons, serta rasio pick-up/drop-off pada fungsi proteksi 50/51 (arus lebih), 50N/51N (gangguan tanah), 87 (diferensial), dan 21 (jarak).</p>
<h3>Verifikasi Koordinasi Proteksi & Waktu Pemutusan Arc-Flash</h3>
<p>Validasi margin diskriminasi selektivitas proteksi terhadap gardu induk PLN di sisi hulu dan breaker hilir, memastikan pemutusan gangguan berlangsung selektif dan melokalisir trip tanpa memadamkan bagian pabrik lainnya.</p>`,
    },
  },

  "mechanical-services-supplies": {
    id: "serv-mechanical-supplies",
    slug: "mechanical-services-supplies",
    fullPath: "mechanical-services-supplies",
    depth: 0,
    sortOrder: 5,
    imageUrl: "/uploads/mdm/electrical-services.jpg",
    title: {
      en: "Mechanical Services & General Supplies",
      id: "Layanan Mekanikal & Pengadaan Industri",
    },
    summary: {
      en: "Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.",
      id: "Pemeliharaan mekanikal industri, sistem konveyor, separator magnetik, pintu industri berkecepatan tinggi, vacuum lifter, dan servis motor/generator.",
    },
    content: {
      en: `<h3>Industrial Mechanical Services & Specialized Supplies</h3>
<p>PT Multi Daya Mitra provides comprehensive mechanical maintenance, equipment overhauls, and engineered supply solutions to maximize plant machinery uptime, material handling efficiency, and operational safety.</p>
<h3>Equipment Servicing & Dynamic Balancing</h3>
<p>Our scope covers industrial conveyor systems, magnetic separators, high-speed spiral doors, vacuum lifting devices, and rotating machinery overhaul including dynamic rotor balancing and motor stator insulation rewinding.</p>`,
      id: `<h3>Layanan Mekanikal Industri & Pengadaan Khusus</h3>
<p>PT Multi Daya Mitra menyediakan layanan pemeliharaan mekanikal komprehensif, overhaul peralatan industri, dan solusi pengadaan rekayasa guna memaksimalkan waktu operasional mesin, efisiensi penanganan material, dan keselamatan kerja pabrik.</p>
<h3>Perawatan Peralatan & Balancing Dinamis</h3>
<p>Cakupan kami meliputi sistem konveyor industri, separator magnetik pemisah logam, pintu otomatis berkecepatan tinggi (high-speed door), peralatan vacuum lifter, serta overhaul mesin berputar mencakup balancing dinamis rotor dan pelapisan ulang isolasi stator motor.</p>`,
    },
  },

  "mechanical-services-supplies/industrial-mechanical-supplies-services": {
    id: "serv-mechanical-supplies-items",
    slug: "industrial-mechanical-supplies-services",
    fullPath: "mechanical-services-supplies/industrial-mechanical-supplies-services",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/construction-installation.jpg",
    title: {
      en: "Conveyor Systems, Magnetic Separators & Industrial Supplies",
      id: "Sistem Konveyor, Separator Magnetik & Perlengkapan Industri",
    },
    summary: {
      en: "Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.",
      id: "Pengadaan, instalasi, dan servis lini konveyor, pemisah logam magnetik, sectional door, dan peralatan vacuum lifter.",
    },
    content: {
      en: `<h3>Material Handling & Mechanical Infrastructure Supplies</h3>
<p>End-to-end engineering, procurement, installation, and maintenance of industrial conveyor networks, magnetic separation systems, vacuum lifters, and rapid-roll sectional doors designed for demanding manufacturing plants.</p>
<h3>Conveyor Systems & Overband Magnetic Separators</h3>
<p>Custom belt and roller conveyors engineered for bulk material transfer, paired with permanent and electromagnetic overband cross-belt separators to extract tramp metal contaminants and protect downstream crushers and mills.</p>
<h3>Industrial Cleanroom & High-Speed Sectional Doors</h3>
<p>Installation of high-speed PVC roll-up doors, insulated sectional doors, and ergonomic vacuum lifting equipment for rapid warehouse logistics and temperature-controlled cleanroom environments.</p>`,
      id: `<h3>Pengadaan Infrastruktur Mekanikal & Penanganan Material</h3>
<p>Layanan menyeluruh perancangan, pengadaan, instalasi, dan pemeliharaan jaringan konveyor industri, sistem pemisah magnetik (magnetic separator), peralatan vacuum lifter, serta pintu rolling door industri berkecepatan tinggi.</p>
<h3>Sistem Konveyor & Pemisah Logam Magnetik (Overband)</h3>
<p>Konveyor sabuk (belt) dan roller khusus untuk pengangkutan material curah, dipadukan dengan separator magnetik overband permanen maupun elektromagnetik guna menyaring kontaminan logam dan melindungi mesin penggiling hilir.</p>
<h3>Pintu Sectional Kecepatan Tinggi & Ruang Bersih (Cleanroom)</h3>
<p>Pemasangan pintu PVC roll-up kecepatan tinggi, pintu sectional berinsulasi termal, serta alat angkat vacuum ergonomis untuk mempercepat arus logistik gudang dan menjaga kestabilan suhu ruang produksi berstandar higienis.</p>`,
    },
  },

  "mechanical-services-supplies/motor-generator-servicing-overhaul": {
    id: "serv-motor-overhaul",
    slug: "motor-generator-servicing-overhaul",
    fullPath: "mechanical-services-supplies/motor-generator-servicing-overhaul",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/mdm/electrical-services.jpg",
    title: {
      en: "Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)",
      id: "Overhaul Motor & Generator (Pelapisan Ulang Isolasi & Balancing Dinamis)",
    },
    summary: {
      en: "Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.",
      id: "Servis elektromotor, motor MV, generator, pelapisan ulang isolasi kumparan, analisis vibrasi, dan rekondisi rotor.",
    },
    content: {
      en: `<h3>Comprehensive Overhaul for Rotating Machinery</h3>
<p>Precision mechanical and electrical maintenance for low and medium voltage electric motors, heavy industrial drives, and generator sets to restore OEM performance and eliminate mechanical vibration.</p>
<h3>Stator Rewinding & Vacuum Pressure Impregnation (VPI)</h3>
<p>Complete stator and rotor winding rehabilitation, class H insulation recoating, vacuum varnishing, and baking to restore dielectric strength, prevent partial discharge, and resist harsh industrial humidity.</p>
<h3>On-Site & Workshop Dynamic Rotor Balancing</h3>
<p>ISO 1940 standard precision dynamic balancing of rotors, fans, impellers, and couplings to eliminate destructive centrifugal vibration, reducing bearing wear and extending machine lifespan.</p>`,
      id: `<h3>Layanan Overhaul Komprehensif Mesin Berputar</h3>
<p>Pemeliharaan mekanik dan elektrikal presisi untuk motor listrik tegangan rendah dan menengah, motor industri berat, serta unit generator guna memulihkan kinerja spesifikasi awal pabrikan dan meniadakan vibrasi mekanikal.</p>
<h3>Rewinding Kumparan Stator & Perendaman Pernis Vakum (VPI)</h3>
<p>Rekondisi kumparan stator dan rotor, pelapisan ulang isolasi termal Kelas H, proses varnishing vakum, dan pengeringan oven untuk memulihkan ketahanan dielektrik serta mencegah kebocoran arus di lingkungan lembap industri.</p>
<h3>Balancing Dinamis Rotor di Lapangan & Workshop</h3>
<p>Balancing dinamis presisi standar ISO 1940 untuk poros rotor, blower impeller, dan kopling transmisi guna mengeliminasi getaran sentrifugal destruktif, memperpanjang usia bearing, dan meningkatkan keandalan motor.</p>`,
    },
  },

  "grounding-lightning-protection": {
    id: "serv-grounding-lightning",
    slug: "grounding-lightning-protection",
    fullPath: "electrical-construction-installation/grounding-lightning-protection",
    depth: 1,
    sortOrder: 5,
    imageUrl: "/uploads/mdm/construction-installation.jpg",
    title: {
      en: "Grounding & Lightning Protection System",
      id: "Sistem Pembumian & Proteksi Petir",
    },
    summary: {
      en: "Deep well grounding installation, exothermic CAD welding, copper tape routing, and early streamer emission (ESE) lightning protection.",
      id: "Instalasi pembumian deep well, pengelasan eksotermik CAD, penarikan pita tembaga, dan penangkal petir elektrostatis (ESE).",
    },
    content: {
      en: `<h3>Industrial Grounding & Lightning Safety Engineering</h3>
<p>Comprehensive engineering and certified installation of grounding earthing networks and external lightning protection systems adhering to PUIL 2011, SNI 03-7015, and NFPA 780 standards to safeguard critical industrial facilities and personnel.</p>
<h3>Deep Well Grounding & CAD Exothermic Welding</h3>
<p>Deep drilled copper grounding rods, low-resistance soil enhancement materials (Bentonite / conductive cement), and molecular exothermic CAD welding joints achieving system resistance below 1 Ohm.</p>
<h3>Early Streamer Emission (ESE) & Faraday Cage Protection</h3>
<p>Turnkey erection of electrostatic ESE air terminals, non-inductive down-conductors, lightning surge strike counters, and surge protective devices (SPD) across distribution switchboards.</p>`,
      id: `<h3>Rekayasa Proteksi Petir & Pembumian Industri</h3>
<p>Rekayasa teknik dan instalasi tersertifikasi untuk jaringan pembumian (grounding) dan sistem penangkal petir eksternal sesuai standar PUIL 2011, SNI 03-7015, dan NFPA 780 demi melindungi aset industri vital serta keselamatan personil.</p>
<h3>Pembumian Deep Well & Pengelasan Eksotermik CAD</h3>
<p>Pengeboran deep well dengan batang tembaga murni, bahan peningkat konduktivitas tanah (Bentonite / semen konduktif), serta penyambungan molekuler exothermic CAD weld guna mencapai nilai tahanan tanah di bawah 1 Ohm.</p>
<h3>Penangkal Petir Elektrostatis (ESE) & Sangkar Faraday</h3>
<p>Pemasangan penangkal petir elektrostatis ESE beradius proteksi luas, konduktor penyalur petir non-induktif, penghitung sambaran petir (strike counter), dan arrester proteksi surja (SPD) pada panel listrik.</p>`,
    },
  },

  "busduct-canalis-installation": {
    id: "serv-busduct-canalis",
    slug: "busduct-canalis-installation",
    fullPath: "electrical-construction-installation/busduct-canalis-installation",
    depth: 1,
    sortOrder: 6,
    imageUrl: "/uploads/mdm/construction-installation.jpg",
    title: {
      en: "Busduct & Canalis Trunking Installation",
      id: "Instalasi Busduct & Trunking Canalis",
    },
    summary: {
      en: "High-amperage sandwich busduct feeder erection, tap-off unit installation, and torque-checked jointing for industrial plants.",
      id: "Pemasangan busduct sandwich ampere tinggi, unit tap-off, dan penyambungan terverifikasi torsi untuk pabrik industri.",
    },
    content: {
      en: `<h3>High-Capacity Industrial Power Busduct Systems</h3>
<p>Precision installation, suspension, and commissioning of compact sandwich copper and aluminum busduct systems from 630A up to 6300A, providing high-efficiency, space-saving power distribution across multi-story buildings and factory floors.</p>
<h3>Torque-Controlled Jointing & Fire Barriers</h3>
<p>Installation of double-headed torque indicator bolts, joint packs with silver-plated contact surfaces, integrated fire-stop barriers at floor/wall penetrations, and flexible expansion joints.</p>
<h3>Tap-Off Units & Commissioning Testing</h3>
<p>Mounting of plug-in tap-off units with MCCB protection, phase sequence verification, micro-ohm joint resistance measurement, and high-voltage insulation resistance testing.</p>`,
      id: `<h3>Sistem Busduct Distribusi Tenaga Listrik Kapasitas Tinggi</h3>
<p>Instalasi presisi, penggantungan (hanger), dan komisioning sistem busduct sandwich tembaga dan aluminium dari 630A hingga 6300A, menghadirkan penyaluran energi hemat ruang dan berdaya hantar tinggi untuk fasilitas bertingkat dan lantai pabrik.</p>
<h3>Penyambungan Terkontrol Torsi & Fire Barrier</h3>
<p>Pemasangan baut sambungan berindikator torsi ganda (torque shear bolts), pelat kontak berlapis perak, sekat penahan api (fire barrier) pada penetrasi dinding/lantai, serta sambungan ekspansi fleksibel.</p>
<h3>Unit Tap-Off & Pengujian Komisioning</h3>
<p>Pemasangan unit tap-off plug-in berproteksi MCCB, verifikasi urutan fasa, pengukuran resistansi sambungan mikro-ohm, serta uji ketahanan isolasi tegangan tinggi.</p>`,
    },
  },

  "low-voltage-switchboard-maintenance": {
    id: "serv-lv-switchboard-maint",
    slug: "low-voltage-switchboard-maintenance",
    fullPath: "electrical-maintenance-service/low-voltage-switchboard-maintenance",
    depth: 1,
    sortOrder: 5,
    imageUrl: "/uploads/mdm/circuit-breaker.jpg",
    title: {
      en: "Low Voltage Switchboard Maintenance",
      id: "Pemeliharaan Papan Hubung Tegangan Rendah",
    },
    summary: {
      en: "ACB/MCCB servicing, cradle mechanism testing, thermal scanning, and digital trip unit secondary injection calibration.",
      id: "Servis ACB/MCCB, pengujian mekanisme cradle, pemindaian termal, dan kalibrasi injeksi sekunder trip unit digital.",
    },
    content: {
      en: `<h3>Low Voltage Switchboard Overhaul & Servicing</h3>
<p>Routine preventive servicing and mechanical reconditioning of Main Distribution Panels (MDP), Sub-Distribution Boards, and Motor Control Centers (MCC) up to 1000V.</p>
<h3>Circuit Breaker Diagnostics & Secondary Injection</h3>
<p>MicroLogic / digital trip unit calibration via secondary injection, contact wear inspection, cradle racking mechanism lubrication, and dielectric tests.</p>
<h3>Busbar Joint Retorquing & De-dusting</h3>
<p>Complete panel busbar retorquing, infrared thermographic verification, anti-tracking insulation barrier cleaning, and auxiliary relay testing.</p>`,
      id: `<h3>Overhaul & Pemeliharaan Panel Distribusi Tegangan Rendah</h3>
<p>Servis preventif rutin dan rekondisi mekanikal untuk Panel Distribusi Utama (LVMDP), Sub-Distribusi (SDP), dan Motor Control Center (MCC) hingga 1000V.</p>
<h3>Diagnostik Circuit Breaker & Injeksi Sekunder</h3>
<p>Kalibrasi trip unit digital / MicroLogic dengan alat uji injeksi sekunder, inspeksi keausan kontak utama, pelumasan mekanisme draw-out cradle, dan uji dielektrik.</p>
<h3>Pemeriksaan Torsi Busbar & Pembersihan Kompartemen</h3>
<p>Pengencangan torsi baut busbar panel, verifikasi termografi inframerah, pembersihan isolator pencegah tracking arus bocor, serta pengujian relai bantu.</p>`,
    },
  },

  "ups-battery-bank-maintenance": {
    id: "serv-ups-battery-maint",
    slug: "ups-battery-bank-maintenance",
    fullPath: "electrical-maintenance-service/ups-battery-bank-maintenance",
    depth: 1,
    sortOrder: 6,
    imageUrl: "/uploads/mdm/circuit-breaker.jpg",
    title: {
      en: "Industrial UPS & Battery Bank Maintenance",
      id: "Pemeliharaan UPS Industri & Bank Baterai",
    },
    summary: {
      en: "Impedance testing, conductance measurement, cell equalization, and autonomy discharge runtime testing for critical power UPS.",
      id: "Uji impedansi baterai, pengukuran konduktansi, ekualisasi sel, dan pengujian runtime debit untuk sistem UPS kritis.",
    },
    content: {
      en: `<h3>Industrial UPS Systems & Battery Bank Maintenance</h3>
<p>Lifecycle testing, preventive servicing, and runtime capacity verification for industrial Uninterruptible Power Supply (UPS) units and VRLA / Ni-Cd battery banks ensuring mission-critical continuity.</p>
<h3>Cell Impedance & Conductance Testing</h3>
<p>Internal cell resistance and conductance measurements using calibrated Fluke battery analyzers to detect deteriorating cells before bank-wide failure.</p>
<h3>Full-Load Discharge & Thermal Runaway Prevention</h3>
<p>Controlled dummy-load discharge testing, cell equalization charge balancing, DC bus ripple voltage measurement, and temperature-compensated charging checks.</p>`,
      id: `<h3>Pemeliharaan Sistem UPS Industri & Bank Baterai</h3>
<p>Pengujian siklus hidup, servis preventif berkala, dan verifikasi kapasitas runtime untuk unit Uninterruptible Power Supply (UPS) industri dan bank baterai VRLA / Ni-Cd guna menjamin kontinuitas daya kritis.</p>
<h3>Pengujian Impedansi & Konduktansi Sel Baterai</h3>
<p>Pengukuran resistansi internal dan konduktansi tiap sel baterai menggunakan battery analyzer Fluke terkalibrasi untuk mendeteksi sel yang mulai rusak sebelum merusak seluruh rangkaian.</p>
<h3>Uji Pelepasan Beban Penuh & Pencegahan Thermal Runaway</h3>
<p>Uji pelepasan beban terkontrol menggunakan dummy load, penyeimbangan muatan sel (equalization), pengukuran riak tegangan DC bus, dan verifikasi kompensasi suhu pengisian daya.</p>`,
    },
  },

  "building-automation-system-bas": {
    id: "serv-bas-automation",
    slug: "building-automation-system-bas",
    fullPath: "automation-solutions-services/building-automation-system-bas",
    depth: 1,
    sortOrder: 5,
    imageUrl: "/uploads/mdm/automation-control.jpg",
    title: {
      en: "Building Automation & HVAC Control (BAS)",
      id: "Otomasi Gedung & Kontrol HVAC (BAS)",
    },
    summary: {
      en: "Centralized HVAC chiller plant optimization, AHU VAV control, lighting automation, and Modbus/BACnet integration.",
      id: "Optimasi sistem pendingin chiller HVAC, kontrol AHU VAV, otomasi tata cahaya, dan integrasi protokol Modbus/BACnet.",
    },
    content: {
      en: `<h3>Intelligent Building Automation Systems (BAS / BMS)</h3>
<p>Integrated Building Management Systems engineering optimizing HVAC, central chiller plants, lighting, and indoor air quality across commercial buildings and industrial cleanrooms.</p>
<h3>Chiller Plant Optimization & VAV AHU Controls</h3>
<p>Automated delta-T staging algorithms for water chillers, variable primary flow pump sequencing, dynamic cooling tower fan VFD control, and CO2-demand ventilation.</p>
<h3>BACnet / Modbus Open Protocol Integration</h3>
<p>Unified supervisory software connecting multi-vendor field controllers, smart energy meters, fire alarm interfaces, and elevator status into a centralized command dashboard.</p>`,
      id: `<h3>Sistem Otomasi Gedung Pintar (BAS / BMS)</h3>
<p>Rekayasa Sistem Manajemen Gedung (BMS) terpadu untuk mengoptimalkan kinerja HVAC, sistem chiller sentral, tata cahaya cerdas, dan kualitas udara ruangan pada gedung komersial serta cleanroom industri.</p>
<h3>Optimasi Sentral Chiller & Kontrol AHU VAV</h3>
<p>Algoritma otomatis delta-T staging untuk chiller air, sekuensial pompa aliran primer variabel, kontrol VFD kipas cooling tower dinamis, serta ventilasi kebutuhan udara berbasis sensor CO2.</p>
<h3>Integrasi Protokol Terbuka BACnet & Modbus</h3>
<p>Perangkat lunak supervisi terpadu yang menghubungkan kontroler lapangan multi-vendor, power meter digital, antarmuka alarm kebakaran, dan pemantauan lift ke satu dasbor komando terpusat.</p>`,
    },
  },
}

/**
 * Historical and alternative slug aliases mapped to canonical catalog paths.
 */
export const LEGACY_SERVICE_ALIASES: Record<string, string> = {
  // Substation
  "substation-transformer-installation": "electrical-construction-installation/substation-mv-switchgear-installation",
  "electrical-construction-installation/substation-transformer-installation": "electrical-construction-installation/substation-mv-switchgear-installation",

  // LV Panels
  "mv-lv-switchboard-assembly": "electrical-construction-installation/lv-distribution-panels-assembly",
  "electrical-construction-installation/mv-lv-switchboard-assembly": "electrical-construction-installation/lv-distribution-panels-assembly",
  "low-voltage-distribution-panels": "electrical-construction-installation/lv-distribution-panels-assembly",

  // Cable
  "cable-pulling-termination": "electrical-construction-installation/mv-lv-cable-installation-termination",
  "electrical-construction-installation/cable-pulling-termination": "electrical-construction-installation/mv-lv-cable-installation-termination",

  // Fire Alarm & Protection
  "fire-alarm": "electrical-construction-installation/fire-alarm-system-installation",
  "fire-alarm-services": "electrical-construction-installation/fire-alarm-system-installation",
  "fire-alarm-systems": "electrical-construction-installation/fire-alarm-system-installation",
  "fire-protection-sprinkler-hydrant": "electrical-construction-installation/fire-alarm-system-installation",
  "electrical-construction-installation/fire-protection-sprinkler-hydrant": "electrical-construction-installation/fire-alarm-system-installation",

  // Transformer
  "transformer-maintenance-purification": "electrical-maintenance-service/transformer-oil-treatment-dga",
  "transformer-oil-bdv-dga-testing": "electrical-maintenance-service/transformer-oil-treatment-dga",
  "electrical-maintenance-service/transformer-maintenance-purification": "electrical-maintenance-service/transformer-oil-treatment-dga",
  "electrical-maintenance-service/transformer-oil-bdv-dga-testing": "electrical-maintenance-service/transformer-oil-treatment-dga",

  // MV Cubicle & Breaker
  "mv-cubicle-switchgear-servicing": "electrical-maintenance-service/mv-cubicle-acb-maintenance",
  "breaker-timing-contact-resistance": "electrical-maintenance-service/mv-cubicle-acb-maintenance",
  "electrical-maintenance-service/mv-cubicle-switchgear-servicing": "electrical-maintenance-service/mv-cubicle-acb-maintenance",
  "electrical-maintenance-service/breaker-timing-contact-resistance": "electrical-maintenance-service/mv-cubicle-acb-maintenance",

  // Thermography
  "infrared-thermography-inspection": "electrical-maintenance-service/thermography-predictive-maintenance",
  "electrical-maintenance-service/infrared-thermography-inspection": "electrical-maintenance-service/thermography-predictive-maintenance",

  // Shutdown & AMC
  "annual-shutdown-maintenance": "electrical-maintenance-service/annual-maintenance-contracts",
  "electrical-maintenance-service/annual-shutdown-maintenance": "electrical-maintenance-service/annual-maintenance-contracts",

  // SCADA
  "scada-process-automation": "automation-solutions-services/scada-hmi-process-monitoring",
  "automation-solutions-services/scada-process-automation": "automation-solutions-services/scada-hmi-process-monitoring",

  // Energy
  "power-management-system-pme": "automation-solutions-services/energy-management-iso50001",
  "automation-solutions-services/power-management-system-pme": "automation-solutions-services/energy-management-iso50001",

  // PLC & VFD
  "plc-dcs-programming": "automation-solutions-services/plc-vsd-system-integration",
  "variable-speed-drive-vfd-solutions": "automation-solutions-services/plc-vsd-system-integration",
  "automation-solutions-services/plc-dcs-programming": "automation-solutions-services/plc-vsd-system-integration",
  "automation-solutions-services/variable-speed-drive-vfd-solutions": "automation-solutions-services/plc-vsd-system-integration",

  // Testing & Commissioning
  "relay-protection-calibration": "inspection-testing-commissioning/relay-protection-testing-commissioning",
  "inspection-testing-commissioning/relay-protection-calibration": "inspection-testing-commissioning/relay-protection-testing-commissioning",
  "hi-pot-insulation-resistance-test": "inspection-testing-commissioning/partial-discharge-pd-scan",
  "inspection-testing-commissioning/hi-pot-insulation-resistance-test": "inspection-testing-commissioning/partial-discharge-pd-scan",

  // Mechanical
  "mechanical-services-general-supplies": "mechanical-services-supplies",
  "chiller-hvac-mechanical-piping": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "pump-valve-overhaul-alignment": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "air-compressor-piping-installation": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "exhaust-ventilation-ductwork": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "mechanical-services-supplies/chiller-hvac-mechanical-piping": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "mechanical-services-supplies/pump-valve-overhaul-alignment": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "mechanical-services-supplies/air-compressor-piping-installation": "mechanical-services-supplies/industrial-mechanical-supplies-services",
  "mechanical-services-supplies/exhaust-ventilation-ductwork": "mechanical-services-supplies/industrial-mechanical-supplies-services",

  // Root level legacy
  "electrical-services": "electrical-construction-installation",
  "electrical-engineering": "electrical-construction-installation",
  "maintenance": "electrical-maintenance-service",
  "automation": "automation-solutions-services",
  "industrial-automation": "automation-solutions-services",
  "testing-measurement": "inspection-testing-commissioning",
  "tools-testing-measurement": "inspection-testing-commissioning",
}

/**
 * Finds the bilingual catalog entry for a service path, slug, or title.
 */
export function findBilingualServiceEntry(fullPathOrSlug: string, titleHint?: string): BilingualServiceEntry | undefined {
  if (!fullPathOrSlug && !titleHint) return undefined
  const clean = (fullPathOrSlug || "").replace(/^\/+|\/+$/g, "")
  const slug = clean.split("/").pop() || clean

  // 1. Direct path/slug match
  if (clean && BILINGUAL_SERVICE_CATALOG[clean]) {
    return BILINGUAL_SERVICE_CATALOG[clean]
  }
  if (slug && BILINGUAL_SERVICE_CATALOG[slug]) {
    return BILINGUAL_SERVICE_CATALOG[slug]
  }

  // 2. Alias resolution
  const aliasTarget = LEGACY_SERVICE_ALIASES[clean] || LEGACY_SERVICE_ALIASES[slug]
  if (aliasTarget && BILINGUAL_SERVICE_CATALOG[aliasTarget]) {
    return BILINGUAL_SERVICE_CATALOG[aliasTarget]
  }

  // 3. Substring/suffix match in catalog
  const match = Object.values(BILINGUAL_SERVICE_CATALOG).find(
    (entry) => entry.slug === slug || entry.fullPath === clean || entry.fullPath.endsWith(`/${slug}`)
  )
  if (match) return match

  // 4. Title match
  if (titleHint) {
    const extracted = extractBilingualText(titleHint)
    const normEn = (extracted.en || titleHint).toLowerCase().trim()
    const normId = (extracted.id || titleHint).toLowerCase().trim()
    const titleMatch = Object.values(BILINGUAL_SERVICE_CATALOG).find((entry) => {
      const entryEn = entry.title.en.toLowerCase()
      const entryId = entry.title.id.toLowerCase()
      return (
        entryEn === normEn ||
        entryId === normId ||
        normEn.includes(entryEn) ||
        normId.includes(entryId) ||
        entryEn.includes(normEn)
      )
    })
    if (titleMatch) return titleMatch
  }

  return undefined
}

/**
 * Enriches a service node with complete bilingual translations.
 * Guarantees that neither ID nor EN title or summary is ever empty.
 */
export function enrichServiceWithBilingual(
  node: ContentNode | null | undefined,
  fullPathOrSlug: string
): ContentNode | null {
  const entry = findBilingualServiceEntry(fullPathOrSlug, node?.title)
  if (!node && !entry) return null

  if (!entry) {
    if (!node) return null
    // Fallback: extract and complete bilingual text from node itself
    const titleExt = extractBilingualText(node.title)
    const summaryExt = extractBilingualText(node.summary)
    const finalTitle = combineBilingualText(titleExt) || node.title
    const finalSummary = combineBilingualText(summaryExt) || (node.summary ?? "")

    return {
      ...node,
      title: finalTitle,
      summary: finalSummary,
      content: node.content ?? {
        bilingual: true,
        id: { blocks: [{ type: "paragraph", text: finalSummary }] },
        en: { blocks: [{ type: "paragraph", text: finalSummary }] },
        blocks: [{ type: "paragraph", text: finalSummary }],
      },
    }
  }

  const baseNode: ContentNode = node ?? {
    id: entry.id ?? `serv-${entry.slug}`,
    slug: entry.slug,
    fullPath: entry.fullPath,
    title: "",
    summary: "",
    imageUrl: entry.imageUrl,
    status: entry.status ?? "published",
    sortOrder: entry.sortOrder ?? 1,
    depth: entry.depth ?? 0,
    children: [],
  }

  // Preserve any custom node bilingual translations ONLY if explicitly provided with bilingual markers
  let titleString = `EN: ${entry.title.en}\nID: ${entry.title.id}`
  if (node?.title) {
    const hasExplicitBilingual = /(?:EN\s*:|\[EN\])/i.test(node.title) && /(?:ID\s*:|\[ID\])/i.test(node.title)
    if (hasExplicitBilingual) {
      const customTitle = extractBilingualText(node.title)
      if (customTitle.id && customTitle.en) {
        titleString = combineBilingualText(customTitle)
      }
    }
  }

  let summaryString = `EN: ${entry.summary.en}\nID: ${entry.summary.id}`
  if (node?.summary) {
    const hasExplicitBilingual = /(?:EN\s*:|\[EN\])/i.test(node.summary) && /(?:ID\s*:|\[ID\])/i.test(node.summary)
    if (hasExplicitBilingual) {
      const customSummary = extractBilingualText(node.summary)
      if (customSummary.id && customSummary.en) {
        summaryString = combineBilingualText(customSummary)
      }
    }
  }

  return {
    ...baseNode,
    title: titleString,
    summary: summaryString,
    imageUrl: baseNode.imageUrl || entry.imageUrl,
    content: {
      bilingual: true,
      id: {
        blocks: [{ type: "html", html: entry.content.id }],
      },
      en: {
        blocks: [{ type: "html", html: entry.content.en }],
      },
      blocks: [
        {
          type: "html",
          html: `EN: ${entry.content.en}\nID: ${entry.content.id}`,
        },
      ],
    },
  }
}


export const SERVICE_TREE_STRUCTURE: { root: string; children: string[] }[] = [
  {
    root: "electrical-construction-installation",
    children: [
      "electrical-construction-installation/substation-mv-switchgear-installation",
      "electrical-construction-installation/lv-distribution-panels-assembly",
      "electrical-construction-installation/mv-lv-cable-installation-termination",
      "electrical-construction-installation/fire-alarm-system-installation",
    ],
  },
  {
    root: "electrical-maintenance-service",
    children: [
      "electrical-maintenance-service/transformer-oil-treatment-dga",
      "electrical-maintenance-service/mv-cubicle-acb-maintenance",
      "electrical-maintenance-service/thermography-predictive-maintenance",
      "electrical-maintenance-service/annual-maintenance-contracts",
    ],
  },
  {
    root: "automation-solutions-services",
    children: [
      "automation-solutions-services/scada-hmi-process-monitoring",
      "automation-solutions-services/energy-management-iso50001",
      "automation-solutions-services/plc-vsd-system-integration",
    ],
  },
  {
    root: "inspection-testing-commissioning",
    children: [
      "inspection-testing-commissioning/power-quality-analysis-study",
      "inspection-testing-commissioning/partial-discharge-pd-scan",
      "inspection-testing-commissioning/relay-protection-testing-commissioning",
    ],
  },
  {
    root: "mechanical-services-supplies",
    children: [
      "mechanical-services-supplies/industrial-mechanical-supplies-services",
      "mechanical-services-supplies/motor-generator-servicing-overhaul",
    ],
  },
]

export function buildBilingualServiceTree(): ContentNode[] {
  return SERVICE_TREE_STRUCTURE.map((group) => {
    const rootNode = enrichServiceWithBilingual(null, group.root)!
    const childrenNodes = group.children
      .map((childPath) => enrichServiceWithBilingual(null, childPath))
      .filter((n): n is ContentNode => Boolean(n))
    return {
      ...rootNode,
      children: childrenNodes,
    }
  })
}
