import type { ContentNode } from "@/lib/cms"

export type BilingualProductEntry = {
  id?: string
  slug: string
  fullPath: string
  title: { en: string; id: string }
  summary: { en: string; id: string }
  content: { en: string; id: string }
  imageUrl?: string
  specs?: Record<string, string>
  status?: string
  depth?: number
  sortOrder?: number
}

export const BILINGUAL_PRODUCT_CATALOG: Record<string, BilingualProductEntry> = {
  "rittal-distributor": {
    id: "00000000-0000-0000-0000-000000000701",
    slug: "rittal-distributor",
    fullPath: "rittal-distributor",
    depth: 0,
    sortOrder: 1,
    imageUrl: "/uploads/brand-rittal.jpg",
    title: {
      en: "Rittal Authorized Distributor",
      id: "Distributor Resmi Rittal",
    },
    summary: {
      en: "Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, and power distribution systems.",
      id: "Distributor Resmi untuk sistem enclosure industri Rittal, sistem pendingin & climate control, serta distribusi daya tegangan rendah.",
    },
    specs: {
      "EN: Brand\nID: Merek": "Rittal",
      "EN: Origin\nID: Asal Negara": "EN: Germany\nID: Jerman",
      "EN: Partnership\nID: Kemitraan": "EN: Authorized Distributor\nID: Distributor Resmi",
      "EN: Warranty\nID: Garansi": "EN: Official Manufacturer Warranty\nID: Garansi Resmi Pabrikan",
    },
    content: {
      en: `<h3>Rittal Authorized Distribution in Indonesia</h3>
<p>PT Multi Daya Mitra is the official Authorized Distributor for Rittal in Indonesia. We provide genuine Rittal enclosure systems, climate control units, and low-voltage power distribution equipment with certified engineering support, stock availability, and official manufacturer warranty.</p>
<p>Through our direct partnership with Rittal Germany, we support industrial plants, switchboard builders, and automation engineers with comprehensive technical sizing, 3D CAD design assistance, and rapid component delivery from our ready-stock warehouse facilities.</p>`,
      id: `<h3>Distributor Resmi Rittal di Indonesia</h3>
<p>PT Multi Daya Mitra adalah Distributor Resmi untuk Rittal di Indonesia. Kami menyediakan sistem enclosure industri Rittal yang asli, unit pendingin climate control, serta peralatan distribusi daya tegangan rendah dengan dukungan rekayasa teknik tersertifikasi, ketersediaan stok, dan garansi resmi pabrikan.</p>
<p>Melalui kemitraan langsung dengan Rittal Jerman, kami mendukung pabrik industri, perakit panel switchboard, dan insinyur otomasi dengan perhitungan dimensi teknis komprehensif, asistensi desain 3D CAD, serta pengiriman komponen cepat dari fasilitas gudang stok kami.</p>`,
    },
  },

  "schneider-integrator": {
    id: "00000000-0000-0000-0000-000000000702",
    slug: "schneider-integrator",
    fullPath: "schneider-integrator",
    depth: 0,
    sortOrder: 2,
    imageUrl: "/uploads/brand-schneider.jpg",
    title: {
      en: "Schneider Electric System Integrator",
      id: "System Integrator Resmi Schneider Electric",
    },
    summary: {
      en: "Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.",
      id: "System Integrator & Solutions Partner tersertifikasi penyedia otomasi industri, pemantauan energi, dan distribusi elektrikal terpadu.",
    },
    specs: {
      "EN: Brand\nID: Merek": "Schneider Electric",
      "EN: Partnership\nID: Kemitraan": "Certified System Integrator",
      "EN: Ecosystem\nID: Ekosistem": "EcoStruxure Partner",
      "EN: Origin\nID: Asal Negara": "France / Global",
    },
    content: {
      en: `<h3>Certified Schneider Electric System Integrator</h3>
<p>As a certified Schneider Electric System Integrator, PT Multi Daya Mitra delivers integrated automation, power monitoring (PME), and electrical distribution architectures. We combine world-class hardware with custom engineering, PLC/SCADA programming, FAT/SAT testing, and plant commissioning.</p>
<p>Our certified engineers ensure that every installation adheres to Schneider Electric international quality guidelines, maximizing plant availability, reducing energy waste, and meeting stringent industrial cybersecurity criteria.</p>`,
      id: `<h3>System Integrator Schneider Electric Tersertifikasi</h3>
<p>Sebagai System Integrator Schneider Electric tersertifikasi, PT Multi Daya Mitra menghadirkan arsitektur otomatisasi terintegrasi, pemantauan daya (PME), dan distribusi elektrikal. Kami memadukan perangkat keras kelas dunia dengan rekayasa teknik kustom, pemrograman PLC/SCADA, pengujian FAT/SAT, dan komisioning pabrik secara menyeluruh.</p>
<p>Insinyur tersertifikasi kami memastikan setiap instalasi mematuhi panduan kualitas internasional Schneider Electric, memaksimalkan ketersediaan fasilitas pabrik, meminimalkan pemborosan energi, dan memenuhi kriteria keamanan siber industri yang ketat.</p>`,
    },
  },

  "electrical-distribution": {
    id: "00000000-0000-0000-0000-000000000703",
    slug: "electrical-distribution",
    fullPath: "electrical-distribution",
    depth: 0,
    sortOrder: 3,
    imageUrl: "/uploads/mdm/circuit-breaker.jpg",
    title: {
      en: "Electrical Distribution",
      id: "Distribusi Kelistrikan",
    },
    summary: {
      en: "Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.",
      id: "Peralatan distribusi kelistrikan tegangan menengah & rendah, panel switchboard, transformator, dan sistem proteksi daya.",
    },
    specs: {
      "EN: Category\nID: Kategori": "EN: Electrical Distribution\nID: Distribusi Kelistrikan",
      "EN: Voltage Levels\nID: Tingkat Tegangan": "EN: MV up to 36kV, LV up to 1000V\nID: TM hingga 36kV, TR hingga 1000V",
    },
    content: {
      en: `<h3>Complete Electrical Distribution Solutions</h3>
<p>Comprehensive electrical distribution solutions for industrial plants, power stations, and commercial infrastructure. Covering MV/LV switchgear, distribution transformers, motor control centers (MCC), and digital protection relays.</p>
<p>From primary utility grid incoming substations down to final sub-distribution panels, our solutions deliver uninterrupted power reliability, operator safety, and complete selectivity under short-circuit conditions.</p>`,
      id: `<h3>Solusi Distribusi Kelistrikan Lengkap</h3>
<p>Solusi distribusi kelistrikan komprehensif untuk fasilitas industri, pembangkit listrik, dan infrastruktur komersial. Mencakup switchgear TM/TR, transformator distribusi, motor control center (MCC), dan relai proteksi digital.</p>
<p>Mulai dari gardu induk penyulang PLN hingga panel sub-distribusi akhir, solusi kami menghadirkan keandalan pasokan listrik tanpa henti, keselamatan operator, dan selektivitas proteksi optimal saat terjadi beban lebih maupun hubung singkat.</p>`,
    },
  },

  "automation-control": {
    id: "00000000-0000-0000-0000-000000000704",
    slug: "automation-control",
    fullPath: "automation-control",
    depth: 0,
    sortOrder: 4,
    imageUrl: "/uploads/products-schneider-automation.jpg",
    title: {
      en: "Automation & Control",
      id: "Otomasi & Kontrol Industri",
    },
    summary: {
      en: "Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.",
      id: "Otomasi industri, sistem PLC, visualisasi proses SCADA / HMI, dan penggerak motor (inverter/VSD).",
    },
    specs: {
      "EN: Category\nID: Kategori": "EN: Automation & Control\nID: Otomasi & Kontrol",
      "EN: Platforms\nID: Platform": "Schneider EcoStruxure, xArrow SCADA, Siemens, Rockwell",
    },
    content: {
      en: `<h3>Industrial Automation & Centralized Control</h3>
<p>State-of-the-art automation and control solutions designed to optimize production throughput, energy efficiency, and operational safety. From individual machine control to plant-wide centralized SCADA and telemetry.</p>
<p>We program and commission programmable logic controllers (PLCs), human-machine interfaces (HMIs), telemetry units (RTUs), and variable frequency drives (VFDs) for demanding industries including manufacturing, chemical processing, water utilities, and power generation.</p>`,
      id: `<h3>Otomasi Industri & Sistem Kontrol Terpusat</h3>
<p>Solusi otomatisasi dan sistem kontrol mutakhir yang dirancang untuk mengoptimalkan kapasitas produksi, efisiensi energi, dan keselamatan operasional. Mulai dari kontrol mesin individual hingga SCADA dan telemetri terpusat di seluruh area pabrik.</p>
<p>Kami memprogram dan mengomisioning pengendali logika terprogram (PLC), antarmuka manusia-mesin (HMI), unit telemetri jarak jauh (RTU), dan inverter penggerak frekuensi variabel (VFD) untuk industri manufaktur, kimia, pengolahan air, dan pembangkit listrik.</p>`,
    },
  },

  "enclosure-climate-control": {
    id: "00000000-0000-0000-0000-000000000705",
    slug: "enclosure-climate-control",
    fullPath: "enclosure-climate-control",
    depth: 0,
    sortOrder: 5,
    imageUrl: "/uploads/products-rittal-enclosures.jpg",
    title: {
      en: "Enclosure & Climate Control",
      id: "Enclosure & Manajemen Suhu Industri",
    },
    summary: {
      en: "Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.",
      id: "Enclosure industri, rak server, kontrol iklim (climate control), dan sistem pendingin untuk lingkungan operasional ekstrem.",
    },
    specs: {
      "EN: Category\nID: Kategori": "EN: Enclosure & Climate Control\nID: Enclosure & Kontrol Iklim",
      "EN: Protection Rating\nID: Tingkat Proteksi": "IP55 - IP66 / NEMA 4X",
    },
    content: {
      en: `<h3>Industrial Enclosures & Climate Protection</h3>
<p>Heavy-duty industrial enclosure and climate control products engineered to protect sensitive electrical and automation equipment against heat, dust, corrosive chemicals, and outdoor elements.</p>
<p>Combining world-leading Rittal enclosures with precision cooling units, filter fans, and smart IoT thermostats, our solutions prevent component degradation, thermal tripping, and costly unscheduled downtime.</p>`,
      id: `<h3>Enclosure Industri & Proteksi Suhu</h3>
<p>Produk box panel (enclosure) industri tugas berat dan pengatur suhu yang dirancang untuk melindungi peralatan elektrikal dan otomasi sensitif dari panas, debu, zat kimia korosif, dan cuaca ekstrem.</p>
<p>Memadukan enclosure Rittal berkelas dunia dengan unit pendingin presisi, filter fan, dan termostat pintar berbasis IoT, solusi kami mencegah penurunan kinerja komponen, trip akibat suhu berlebih, serta downtime produksi yang merugikan.</p>`,
    },
  },

  "power-quality": {
    id: "00000000-0000-0000-0000-000000000706",
    slug: "power-quality",
    fullPath: "power-quality",
    depth: 0,
    sortOrder: 6,
    imageUrl: "/uploads/mdm/power-quality.jpg",
    title: {
      en: "Power Quality",
      id: "Kualitas Daya Listrik",
    },
    summary: {
      en: "Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.",
      id: "Filter harmonisa aktif (AHF), kompensasi faktor daya, kapasitor bank, dan penganalisis kualitas daya listrik.",
    },
    specs: {
      "EN: Category\nID: Kategori": "EN: Power Quality Solutions\nID: Solusi Kualitas Daya",
      "EN: Mitigation\nID: Mitigasi": "THDi < 3%, Stepless Cos Phi 1.0",
    },
    content: {
      en: `<h3>Advanced Power Quality Management</h3>
<p>Advanced power quality management products that eliminate harmonics, correct power factor to near-unity, suppress voltage fluctuations, and prevent costly equipment tripping and downtime.</p>
<p>We engineer Active Harmonic Filters (AHF), Static Var Generators (SVG), and intelligent capacitor banks to protect industrial transformers, cabling, and delicate electronics from the harmful effects of non-linear loads.</p>`,
      id: `<h3>Manajemen Kualitas Daya Mutakhir</h3>
<p>Produk manajemen kualitas daya canggih yang meredam distorsi harmonisa, memperbaiki faktor daya hingga mendekati 1.0, meredam fluktuasi tegangan, serta mencegah trip peralatan dan downtime yang merugikan.</p>
<p>Kami merancang Active Harmonic Filter (AHF), Static Var Generator (SVG), dan kapasitor bank otomatis cerdas guna melindungi transformator industri, kabel transmisi, dan peralatan elektronik sensitif dari dampak buruk beban non-linear.</p>`,
    },
  },

  "fire-alarm-products": {
    id: "00000000-0000-0000-0000-000000000707",
    slug: "fire-alarm-products",
    fullPath: "fire-alarm-products",
    depth: 0,
    sortOrder: 7,
    imageUrl: "/uploads/brand-bosch.png",
    title: {
      en: "Fire Alarm Products",
      id: "Produk Alarm Kebakaran",
    },
    summary: {
      en: "Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions.",
      id: "Panel fire alarm addressable industri, sensor detektor cerdas, perangkat notifikasi, dan solusi pemadam kebakaran terintegrasi.",
    },
    specs: {
      "EN: Category\nID: Kategori": "EN: Fire Alarm & Suppression\nID: Fire Alarm & Proteksi Kebakaran",
      "EN: Standards\nID: Standar": "NFPA 72, NFPA 2001, EN54, UL/FM",
    },
    content: {
      en: `<h3>Certified Industrial Fire Alarm & Suppression</h3>
<p>Certified fire detection and suppression products designed for industrial facilities, power plants, control rooms, and commercial high-rises in accordance with NFPA and EN54 standards.</p>
<p>We supply modular addressable panels, multi-sensor optical and heat detectors, flame sensors, manual call points, and integrated clean-agent gas extinguishing systems engineered to safeguard high-value infrastructure.</p>`,
      id: `<h3>Sistem Alarm & Pemadam Kebakaran Industri Bersertifikat</h3>
<p>Produk deteksi dan proteksi kebakaran tersertifikasi yang dirancang khusus untuk fasilitas industri, pembangkit listrik, ruang kontrol (control room), dan gedung komersial bertingkat sesuai standar NFPA dan EN54.</p>
<p>Kami menyediakan panel addressable modular, sensor optik dan detektor panas multi-kriteria, sensor api (flame sensor), manual call point, serta sistem pemadam gas clean-agent terintegrasi guna melindungi aset dan infrastruktur bernilai tinggi.</p>`,
    },
  },

  "rittal-distributor/enclosures": {
    id: "00000000-0000-0000-0000-000000000708",
    slug: "enclosures",
    fullPath: "rittal-distributor/enclosures",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/products-rittal-enclosures.jpg",
    title: {
      en: "Rittal Enclosure Systems (VX25, AX, KX)",
      id: "Sistem Enclosure Rittal (VX25, AX, KX)",
    },
    summary: {
      en: "Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.",
      id: "Sistem enclosure besar baying resmi Rittal (VX25), enclosure kompak (AX), kotak terminal kecil (KX), dan rak server IT outdoor.",
    },
    specs: {
      "EN: Series\nID: Seri Produk": "VX25, AX, KX, CS Toptec, IT Network Racks",
      "EN: Frame Pitch\nID: Pola Kisi Rangka": "25 mm DIN standard symmetrical grid",
      "EN: Protection Rating\nID: Tingkat Proteksi": "IP55 / IP66 / NEMA 4X / NEMA 12",
      "EN: Material & Finish\nID: Material & Lapisan": "Sheet steel RAL 7035 / Stainless steel AISI 304 & 316L",
      "EN: Certifications\nID: Sertifikasi": "IEC 62208, UL 508A, DNV-GL, CE, RoHS",
      "EN: Target Applications\nID: Aplikasi Utama": "LV Switchboards, MCC Panels, Automation Control, IT Server Racks",
    },
    content: {
      en: `<h3>Rittal Modular Enclosure Architecture</h3>
<p>Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels.</p>
<h3>VX25 Large Baying Enclosure Systems</h3>
<p>The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software.</p>
<h3>AX Compact Enclosures & KX Small Enclosures</h3>
<p>The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution.</p>`,
      id: `<h3>Arsitektur Enclosure Modular Rittal</h3>
<p>Sistem enclosure modular Rittal adalah standar emas global untuk switchgear tegangan rendah, motor control center (MCC), kabinet kontrol otomasi industri, dan infrastruktur rak server IT. Dirancang dengan pola kisi simetris 25 mm DIN, rangka VX25 meniadakan kebutuhan pengeboran dan memungkinkan instalasi interior yang cepat dan bebas perkakas di dua level pemasangan.</p>
<h3>Sistem Enclosure Baying Besar VX25</h3>
<p>Seri unggulan VX25 menyediakan kapabilitas penggabungan (baying) di keempat sisi, ruang dalam yang maksimal, serta kapasitas beban kokoh hingga 15.000 N. Sangat kompatibel dengan pemotongan laser otomatis dan rekayasa digital twin melalui perangkat lunak Eplan.</p>
<h3>Enclosure Kompak AX & Enclosure Kecil KX</h3>
<p>Seri AX mengadopsi logika sistem VX25 ke dalam enclosure kompak dinding dengan arah buka pintu yang dapat dibalik tanpa perkakas serta rel pemosisian terintegrasi. Kotak terminal KX dilengkapi kunci cam mini 180° lepas-cepat untuk distribusi sensor lapangan dan bus hemat ruang.</p>`,
    },
  },

  "rittal-distributor/climate-control-cooling": {
    id: "00000000-0000-0000-0000-000000000709",
    slug: "climate-control-cooling",
    fullPath: "rittal-distributor/climate-control-cooling",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/products-rittal-cooling.jpg",
    title: {
      en: "Rittal Climate Control & Cooling (Blue e+)",
      id: "Sistem Pendingin & Climate Control Rittal (Blue e+)",
    },
    summary: {
      en: "Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.",
      id: "Unit pendingin hibrida inovatif, thermoelectric cooler, dan penukar panas air-ke-udara hemat energi hingga 75% dengan pemantauan IoT digital.",
    },
    specs: {
      "EN: Cooling Capacity\nID: Kapasitas Pendingin": "300 W to 5,500 W (Blue e+ & Blue e+ S)",
      "EN: Energy Savings\nID: Penghematan Energi": "EN: Up to 75% via patented hybrid heat pipe technology\nID: Hingga 75% melalui teknologi pipa panas hibrida berpaten",
      "EN: Refrigerant\nID: Refrigeran": "Eco-friendly R-513A / R-134a (GWP compliant)",
      "EN: IoT Protocols\nID: Protokol IoT": "Modbus TCP, SNMP, OPC-UA, Profinet, Ethernet/IP",
      "EN: Operating Temp\nID: Rentang Suhu Kerja": "-20°C to +60°C ambient",
      "EN: Mounting Options\nID: Opsi Pemasangan": "Wall-mounted, roof-mounted, partial or full internal",
    },
    content: {
      en: `<h3>Next-Generation Industrial Cooling Technology</h3>
<p>Rittal Blue e+ cooling units represent a revolutionary leap in industrial enclosure climate control. Utilizing patented hybrid technology that pairs an active inverter-driven vapor compression circuit with a passive heat pipe, Blue e+ achieves an average of 75% energy reduction compared to conventional cooling units.</p>
<h3>Speed-Regulated Hybrid Cooling Technology</h3>
<p>Inverter-driven DC compressors and EC fans dynamically adapt cooling output to match exact thermal loads. This guarantees a steady internal temperature and prevents thermal shock on sensitive PLC, VSD, and microprocessor electronics.</p>
<h3>Smart IoT & Industry 4.0 Integration</h3>
<p>Equipped with multi-lingual touch display, NFC wireless diagnostics, and IoT interface for continuous remote condition monitoring, automated fault alerts, and predictive filter mat maintenance.</p>`,
      id: `<h3>Teknologi Pendingin Industri Generasi Terbaru</h3>
<p>Unit pendingin Rittal Blue e+ menghadirkan lompatan revolusioner dalam pengendalian suhu enclosure industri. Memanfaatkan teknologi hibrida berpaten yang memadukan sirkuit kompresi uap aktif berbasis inverter dengan pipa panas (heat pipe) pasif, Blue e+ mampu menghemat konsumsi energi rata-rata hingga 75% dibanding unit pendingin konvensional.</p>
<h3>Teknologi Pendingin Hibrida dengan Pengatur Kecepatan</h3>
<p>Kompresor DC dan kipas EC yang diatur oleh inverter menyesuaikan daya pendinginan secara dinamis sesuai beban panas aktual. Hal ini menjamin suhu internal yang sangat stabil dan mencegah lonjakan panas mendadak pada komponen sensitif seperti PLC, VSD, dan mikroprosesor.</p>
<h3>Integrasi Cerdas IoT & Industri 4.0</h3>
<p>Dilengkapi layar sentuh multibahasa, diagnostik nirkabel NFC, dan antarmuka IoT untuk pemantauan kondisi jarak jauh secara terus-menerus, peringatan gangguan otomatis, serta pemeliharaan prediktif filter mat.</p>`,
    },
  },

  "rittal-distributor/power-distribution": {
    id: "00000000-0000-0000-0000-000000000710",
    slug: "power-distribution",
    fullPath: "rittal-distributor/power-distribution",
    depth: 1,
    sortOrder: 3,
    imageUrl: "/uploads/products-rittal-power.jpg",
    title: {
      en: "Rittal Power Distribution (Ri4Power & RiLine)",
      id: "Sistem Distribusi Daya Rittal (Ri4Power & RiLine)",
    },
    summary: {
      en: "Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.",
      id: "Sistem distribusi daya busbar dan switchgear tegangan rendah teruji tipe (type-tested) hingga 6300A sesuai standar IEC 61439-1/-2.",
    },
    specs: {
      "EN: Rated Current (In)\nID: Arus Pengenal (In)": "Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)",
      "EN: Short-Circuit Rating (Icw)\nID: Ketahanan Hubung Singkat": "Up to 120 kA (1s withstand)",
      "EN: Internal Separation\nID: Pemisahan Internal": "Form 1, Form 2b, Form 3b, Form 4a, Form 4b",
      "EN: Busbar Centers\nID: Jarak Pusat Busbar": "60 mm & 185 mm drill-free mounting systems",
      "EN: Standards\nID: Standar": "IEC 61439-1, IEC 61439-2, DIN EN 61439",
    },
    content: {
      en: `<h3>Tested Power Distribution Systems</h3>
<p>Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2.</p>
<h3>Ri4Power Modular LV Switchgear</h3>
<p>Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections.</p>
<h3>RiLine Drill-Free Busbar System</h3>
<p>Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly.</p>`,
      id: `<h3>Sistem Distribusi Daya Teruji Tipe</h3>
<p>Platform distribusi daya modular Rittal Ri4Power dan RiLine memungkinkan panel builder dan system integrator merakit switchgear tegangan rendah bersertifikasi type-tested penuh hingga 6300A dengan pemisahan internal Form 1 hingga Form 4b sesuai standar IEC 61439-1/-2.</p>
<h3>Switchgear Tegangan Rendah Modular Ri4Power</h3>
<p>Dirancang khusus untuk kabinet VX25, mendukung Air Circuit Breaker (ACB) dan Moulded Case Circuit Breaker (MCCB) kelas atas dengan pemegang busbar tembaga teroptimasi, penahanan busur api (arc fault), dan bagian terminasi kabel standar.</p>
<h3>Sistem Busbar Bebas Pengeboran RiLine</h3>
<p>Sistem busbar jarak antar pusat 60 mm dan 185 mm yang cepat dipasang tanpa perlu pengeboran hingga 2100A, dilengkapi penutup sentuh aman (touch-safe), adaptor komponen sistem klik, dan sakelar pemutus sekring NH untuk perakitan yang aman dan rapi.</p>`,
    },
  },

  "rittal-distributor/it-infrastructure": {
    id: "00000000-0000-0000-0000-000000000771",
    slug: "it-infrastructure",
    fullPath: "rittal-distributor/it-infrastructure",
    depth: 1,
    sortOrder: 4,
    imageUrl: "/uploads/products-rittal-it-infrastructure.jpg",
    title: {
      en: "Rittal IT Infrastructure & Data Center Solutions (VX IT & Micro DC)",
      id: "Infrastruktur IT & Solusi Data Center Rittal (VX IT & Micro DC)",
    },
    summary: {
      en: "Standardized and modular IT rack systems, TX CableNet network racks, Edge Data Centers, and Smart PDU power management for scalable enterprise IT rooms.",
      id: "Sistem rak IT modular terstandarisasi, rak jaringan TX CableNet, Edge Data Center, dan manajemen daya Smart PDU untuk ruang IT enterprise yang andal dan terukur.",
    },
    specs: {
      "EN: System Architecture\nID: Arsitektur Sistem": "Rittal VX IT & TX CableNet modular server & network racks",
      "EN: Load Capacity\nID: Kapasitas Beban": "Static load up to 18,000 N (1,800 kg) / Dynamic up to 15,000 N",
      "EN: Height & Dimensions\nID: Ketinggian & Dimensi": "15U, 24U, 42U, 47U, 52U (Width 600/800 mm, Depth 800/1000/1200 mm)",
      "EN: Protection Rating\nID: Tingkat Proteksi": "IP20 (vented perforated doors) / IP55 (solid sheet steel doors)",
      "EN: Cooling & Thermal\nID: Sistem Pendinginan": "LCP (Liquid Cooling Package) up to 55 kW per rack, smart cold/hot aisle containment",
      "EN: Power & Monitoring\nID: Daya & Pemantauan": "Smart PDU (Metered/Switched/Managed) & CMC III IoT monitoring platform",
    },
    content: {
      en: `<h3>Rittal VX IT: The Global Platform for Modern Data Centers</h3>
<p>The Rittal VX IT is the world's most versatile rack platform for all IT applications, from single network closets to high-density hyperscale data centers. Engineered for ultimate modularity and speed, the VX IT enables tool-free, snap-in installation of 19" rails, side panels, and cable management accessories, cutting deployment time by up to 50%.</p>
<h3>Edge Data Centers & Micro Data Center Enclosures</h3>
<p>For decentralized edge computing, industrial smart factories, and remote branch offices, Rittal Micro Data Centers provide a fully self-contained, turnkey IT infrastructure safe inside an IP55 / NEMA 12 rated enclosure. Integrated with dedicated Blue e+ or LCP cooling, automated fire detection and clean-agent suppression (DET-AC III), and biometric access control.</p>
<h3>Intelligent Power Distribution & Precision Thermal Management</h3>
<p>Equipped with intelligent Rittal Smart PDUs offering individual outlet-level metering, remote rebooting, and phase balancing. For extreme heat loads, Rittal Liquid Cooling Packages (LCP) deliver high-efficiency chilled water cooling directly adjacent to rack servers, handling thermal densities up to 55 kW per enclosure.</p>
<h3>CMC III Real-Time Environmental Monitoring</h3>
<p>Continuous monitoring of ambient temperature, humidity, differential air pressure, smoke, water leaks, and vibration via the Rittal Computer Multi Control (CMC III) IoT system, seamlessly integrated into DCIM and SNMP/Modbus network management platforms.</p>`,
      id: `<h3>Rittal VX IT: Platform Global untuk Data Center Modern</h3>
<p>Rittal VX IT adalah platform rak paling serbaguna di dunia untuk seluruh aplikasi infrastruktur IT, mulai dari ruang server jaringan tunggal hingga pusat data berskala besar (hyperscale). Dirancang dengan modularitas tinggi dan kemudahan instalasi cepat, VX IT memungkinkan pemasangan rel 19", panel samping, dan manajemen kabel secara snap-in tanpa bantuan perkakas, memangkas waktu perakitan hingga 50%.</p>
<h3>Edge Data Center & Enclosure Micro Data Center</h3>
<p>Untuk komputasi edge terdesentralisasi, pabrik pintar industri, dan kantor cabang terpencil, Micro Data Center Rittal menghadirkan infrastruktur IT lengkap dan siap pakai yang terlindungi aman di dalam enclosure berstandar proteksi IP55 / NEMA 12. Dilengkapi sistem pendingin terintegrasi Blue e+ atau LCP, deteksi kebakaran otomatis dan pemadam gas clean-agent (DET-AC III), serta kontrol akses biometrik.</p>
<h3>Distribusi Daya Cerdas & Manajemen Termal Presisi</h3>
<p>Dilengkapi Smart PDU Rittal cerdas dengan pengukuran konsumsi listrik tingkat outlet individual, kapabilitas reboot jarak jauh, dan penyeimbangan fase. Untuk beban panas ekstrem, unit Rittal Liquid Cooling Package (LCP) menyalurkan pendinginan air dingin berefisiensi tinggi langsung di samping rak server, mampu mengatasi beban termal hingga 55 kW per enclosure.</p>
<h3>Pemantauan Lingkungan Waktu Nyata CMC III</h3>
<p>Pemantauan terus-menerus terhadap suhu lingkungan, kelembaban, tekanan udara diferensial, asap, kebocoran air, dan getaran fisik melalui sistem IoT Rittal Computer Multi Control (CMC III) yang terintegrasi langsung ke platform DCIM dan manajemen jaringan berbasis SNMP/Modbus.</p>`,
    },
  },

  "rittal-distributor/outdoor-enclosures": {
    id: "00000000-0000-0000-0000-000000000772",
    slug: "outdoor-enclosures",
    fullPath: "rittal-distributor/outdoor-enclosures",
    depth: 1,
    sortOrder: 5,
    imageUrl: "/uploads/products-rittal-outdoor-enclosures.jpg",
    title: {
      en: "Rittal Outdoor Enclosure Systems (CS Toptec & CS New Basic)",
      id: "Sistem Enclosure Outdoor Rittal (CS Toptec & CS New Basic)",
    },
    summary: {
      en: "Weatherproof, double-walled aluminium outdoor enclosures designed for harsh environmental conditions, telecommunications 5G sites, rail, and smart traffic infrastructure.",
      id: "Enclosure outdoor aluminium dinding ganda tahan cuaca ekstrem yang dirancang untuk telekomunikasi 5G, perkeretaapian, dan infrastruktur lalu lintas cerdas.",
    },
    specs: {
      "EN: Enclosure Series\nID: Seri Enclosure": "CS Toptec (bayable modular) & CS New Basic (single-wall / twin-wall)",
      "EN: Material & Finish\nID: Material & Lapisan": "AlMg3 corrosion-resistant aluminium alloy with pure polyester UV powder coating (RAL 7035)",
      "EN: Protection Rating\nID: Tingkat Proteksi": "IP55 / IP66 according to IEC 60529, NEMA 3R / 4 / 4X",
      "EN: Impact Resistance\nID: Ketahanan Benturan": "IK10 according to DIN EN 50102 / IEC 62262",
      "EN: Thermal Insulation\nID: Isolasi Termal": "Twin-wall technology (chimney effect) reducing solar radiation heat transfer by > 60%",
      "EN: Operating Range\nID: Suhu Operasi": "-33°C to +65°C ambient operating temperature",
    },
    content: {
      en: `<h3>Engineered for Harsh Outdoor Environments</h3>
<p>Rittal outdoor enclosures are engineered specifically to shield mission-critical power, telecommunications, and automation controls from punishing environmental conditions—including extreme tropical sun, driving rain, dust storms, industrial smog, and coastal salt fog. Designed according to IEC 61969 standards for outdoor electronic cabinets.</p>
<h3>Double-Walled Architecture & Natural Chimney Effect</h3>
<p>The CS Toptec series features an advanced double-walled aluminium structure consisting of an internal frame and an external protective skin. The air gap between walls harnesses the natural chimney effect to dissipate solar radiation, preventing solar heat gain by more than 60% compared to conventional single-walled metal cabinets and dramatically lowering HVAC cooling power demands.</p>
<h3>CS Toptec Modular Baying Capability</h3>
<p>Built upon Rittal's signature 25 mm modular pitch, CS Toptec enclosures support seamless multi-bay expansion on concrete plinths. The modular design enables distinct physical separation between battery banks, AC/DC rectifiers, optical fiber distribution, and microwave transmission hardware.</p>
<h3>Integrated Climate Control & Vandalism Resistance</h3>
<p>Compatible with Rittal outdoor Blue e+ cooling units, heat exchangers, and thermoelectric coolers. Fitted with multi-point espagnolette locking mechanisms, internal hinges, and anti-vandalism features meeting RC 2 / RC 3 security ratings to prevent unauthorized physical tampering.</p>`,
      id: `<h3>Dirancang Khusus untuk Lingkungan Luar Ruang Ekstrem</h3>
<p>Enclosure outdoor Rittal dirancang khusus untuk melindungi sistem daya kritis, telekomunikasi, dan kontrol otomasi dari paparan cuaca berat—termasuk radiasi panas matahari tropis yang menyengat, hujan deras, badai debu, polusi industri, dan udara berkadar garam tinggi di area pesisir. Memenuhi standar internasional IEC 61969 untuk kabinet elektronik luar ruang.</p>
<h3>Arsitektur Dinding Ganda & Efek Cerobong Alami</h3>
<p>Seri CS Toptec menggunakan struktur aluminium berdinding ganda (twin-wall) mutakhir yang terdiri dari rangka internal dan lapisan pelindung eksternal. Rongga udara di antara dinding memanfaatkan efek cerobong alami untuk membuang panas radiasi matahari hingga lebih dari 60% dibanding kabinet logam dinding tunggal biasa, sehingga menghemat konsumsi daya pendingin secara signifikan.</p>
<h3>Kapabilitas Penggabungan Modular CS Toptec</h3>
<p>Dibangun di atas pola kisi modular 25 mm khas Rittal, lemari CS Toptec mendukung penggabungan (baying) multi-kompartemen di atas pondasi beton. Desain modular ini memungkinkan pemisahan fisik yang terorganisir antara kompartemen baterai cadangan, penyearah AC/DC, distribusi fiber optik, dan perangkat transmisi gelombang mikro.</p>
<h3>Sistem Pendingin Terintegrasi & Perlindungan Anti-Vandalisme</h3>
<p>Dapat dipadukan dengan unit pendingin outdoor Blue e+, penukar panas (heat exchanger), dan pendingin termoelektrik Rittal. Dilengkapi sistem penguncian batang multi-titik espagnolette, engsel tersembunyi di dalam, dan proteksi anti-vandalisme bersertifikasi RC 2 / RC 3 guna mencegah pembobolan fisik tanpa izin.</p>`,
    },
  },

  "rittal-distributor/automation-systems": {
    id: "00000000-0000-0000-0000-000000000773",
    slug: "automation-systems",
    fullPath: "rittal-distributor/automation-systems",
    depth: 1,
    sortOrder: 6,
    imageUrl: "/uploads/products-rittal-automation-systems.jpg",
    title: {
      en: "Rittal Automation Systems (Perforex MT & Secarex)",
      id: "Sistem Otomasi Perakitan Panel Rittal (Perforex MT & Secarex)",
    },
    summary: {
      en: "Digital CNC machining centers, automated cutting tools, and wire processing systems designed to accelerate panel building and switchgear manufacturing by up to 85%.",
      id: "Pusat permesinan CNC digital, mesin pemotong otomatis, dan pemrosesan kabel terotomasi yang mempercepat perakitan panel switchgear hingga 85%.",
    },
    specs: {
      "EN: Machine Range\nID: Lini Mesin": "Perforex MT 107/2101/2201 CNC Milling, Secarex AC 15 Cutting Center, Wire Terminal WT",
      "EN: Machining Capabilities\nID: Kemampuan Permesinan": "Milling, drilling, thread tapping, deburring, and laser cutting (flat parts & fully welded enclosures)",
      "EN: Workpiece Compatibility\nID: Kompatibilitas Benda Kerja": "Sheet steel, stainless steel AISI 304/316, aluminium, copper busbars, and plastics",
      "EN: Software Integration\nID: Integrasi Perangkat Lunak": "Direct seamless import from Eplan Pro Panel, DXF/DWG, and 3D CAD step files",
      "EN: Productivity Gain\nID: Peningkatan Produktivitas": "Up to 85% faster enclosure panel machining with zero manual marking errors",
      "EN: Max Clamping Area\nID: Bidang Cekam Maksimum": "Up to 3,800 mm x 2,300 mm (Perforex MT 2201)",
    },
    content: {
      en: `<h3>Digitalized Switchgear Manufacturing & Panel Building 4.0</h3>
<p>Rittal Automation Systems (RAS) bridges the gap between digital engineering and physical shop floor fabrication. By seamlessly connecting Eplan virtual 3D panel designs with automated machinery, RAS dramatically slashes manufacturing time, lowers manual labor overhead, and guarantees zero rework in panel workshops.</p>
<h3>Perforex MT CNC Machining Centers</h3>
<p>The Perforex MT series is the industry benchmark for automated machining of enclosure mounting plates, side doors, and complete cubic enclosures. With high-speed CNC spindle drives, automated tool changers, and motorized workpiece clamping, Perforex performs precise drilling, thread tapping, milling of rectangular cutouts, and edge deburring in a single continuous automated cycle.</p>
<h3>Secarex Automated Cutting & Wire Terminal Systems</h3>
<p>The Secarex AC 15 cutting center delivers fast, burr-free semi-automatic cutting of DIN mounting rails, C-rails, and plastic cable wiring ducts with integrated label printing. Combined with the Rittal Wire Terminal WT, wire processing (cutting, stripping, crimping, and automated wire sequencing) is fully automated, producing ready-to-wire harnesses up to 8 times faster than manual methods.</p>
<h3>Direct Eplan Pro Panel CAD/CAM Synchronization</h3>
<p>Machine code is generated directly from the digital twin in Eplan Pro Panel with zero manual programming. Tolerances, cutout coordinates, and drilling diameters are transferred automatically over Ethernet, ensuring 100% precision from engineering drawing to finished industrial panel.</p>`,
      id: `<h3>Manufaktur Switchgear Digital & Industri Perakitan Panel 4.0</h3>
<p>Rittal Automation Systems (RAS) menjembatani rancangan rekayasa digital dengan perakitan fisik di lantai bengkel panel. Dengan menghubungkan desain panel virtual 3D dari software Eplan secara langsung ke mesin permesinan otomatis, RAS memangkas waktu produksi secara drastis, mengurangi ketergantungan tenaga kerja manual, dan menjamin nol kesalahan perakitan ulang.</p>
<h3>Pusat Permesinan CNC Perforex MT</h3>
<p>Seri Perforex MT merupakan standar industri untuk permesinan otomatis pada pelat pemasangan (mounting plate), pintu samping, serta bodi enclosure kubikal yang telah dirakit penuh. Dilengkapi spindle CNC berkecepatan tinggi, pengganti perkakas otomatis (auto tool changer), dan pencekaman benda kerja bermotor, Perforex melakukan pengeboran presisi, pengetapan ulir, pemotongan lubang persegi (milling), dan pembersihan geram (deburring) dalam satu siklus otomatis terpadu.</p>
<h3>Pusat Pemotong Otomatis Secarex & Wire Terminal</h3>
<p>Mesin pemotong Secarex AC 15 memberikan pemotongan semi-otomatis yang cepat dan rapi tanpa geram untuk rel DIN, rel C, serta ducting kabel plastik disertai pencetakan label terintegrasi. Dipadukan dengan Rittal Wire Terminal WT, seluruh proses kabel (pemotongan panjang, pengupasan isolasi, crimping ferrule, dan pengelompokan kabel) berjalan otomatis hingga 8 kali lebih cepat dibanding metode manual.</p>
<h3>Sinkronisasi Langsung CAD/CAM Eplan Pro Panel</h3>
<p>Kode permesinan CNC dihasilkan langsung dari digital twin pada Eplan Pro Panel tanpa perlu pemrograman manual. Toleransi, koordinat lubang, dan diameter pengeboran ditransfer secara instan melalui jaringan Ethernet, memastikan tingkat akurasi 100% dari gambar teknik hingga panel jadi di bengkel kerja.</p>`,
    },
  },

  "rittal-distributor/hygienic-design-enclosures": {
    id: "00000000-0000-0000-0000-000000000774",
    slug: "hygienic-design-enclosures",
    fullPath: "rittal-distributor/hygienic-design-enclosures",
    depth: 1,
    sortOrder: 7,
    imageUrl: "/uploads/products-rittal-hygienic-design.jpg",
    title: {
      en: "Rittal Hygienic Design (HD) Stainless Steel Enclosures",
      id: "Enclosure Rittal Hygienic Design (HD) Stainless Steel",
    },
    summary: {
      en: "Extra-hygienic stainless steel enclosures engineered with 30° sloped roofs, gap-free silicone gaskets, and IP66 / IP69K ratings for food, beverage, and pharmaceutical processing.",
      id: "Enclosure stainless steel ultra-higienis dengan atap miring 30°, gasket silikon tanpa celah, dan proteksi IP66 / IP69K khusus untuk industri makanan, minuman, dan farmasi.",
    },
    specs: {
      "EN: Material\nID: Material": "Stainless steel AISI 304 (1.4301) / AISI 316L (1.4404), brushed grain size 400, Ra < 0.8 µm",
      "EN: Protection Category\nID: Kategori Proteksi": "IP66 and IP69K to IEC 60529 / DIN 40050-9 (high-pressure steam washdown)",
      "EN: Hygiene Design Standard\nID: Standar Desain Higienis": "EHEDG compliant, DGUV tested, FDA compliant blue silicone seal (FDA 21 CFR 177.2600)",
      "EN: Roof Incline\nID: Kemiringan Atap": "Integrated 30° forward slope prevents liquid accumulation and allows quick visual cleanliness inspections",
      "EN: Locking Mechanism\nID: Mekanisme Penguncian": "Stainless steel HD cam lock with external hex drive; internal hinges prevent microbial traps",
      "EN: Gasket Seal\nID: Segel Gasket": "All-round joint-free blue silicone seal, easily replaceable during sanitation cycles",
    },
    content: {
      en: `<h3>Ultimate Hygiene for Food, Beverage, and Pharmaceutical Production</h3>
<p>Rittal Hygienic Design (HD) enclosures are tailor-made for hygiene-critical processing environments where bacterial contamination must be completely eliminated. Designed strictly following EHEDG (European Hygienic Engineering & Design Group) principles, HD enclosures withstand regular high-pressure, high-temperature washdowns with aggressive chemical cleaning agents.</p>
<h3>Engineered Without Gaps or Dead Spaces</h3>
<p>Unlike standard industrial cabinets, Rittal HD enclosures feature a 30-degree forward-sloped roof that guarantees complete run-off of cleaning liquids and prohibits operators from placing objects on top. The external door edges are folded back at an angle of 10° to allow water and sanitation foam to drain completely away without leaving moisture traps or pooling zones.</p>
<h3>FDA-Compliant Joint-Free Blue Silicone Seal</h3>
<p>The distinctive blue all-around silicone gasket is dyed blue in accordance with FDA 21 CFR 177.2600 so that any foreign particle contamination is immediately detected visually. The seal is completely continuous without joints, resists chlorinated detergents, and can be quickly replaced during routine plant sanitation cycles without requiring adhesive removers.</p>
<h3>IP66 and IP69K High-Pressure Washdown Protection</h3>
<p>Certified up to IP69K, HD enclosures safely endure dynamic washdown jets exceeding 100 bar at 80°C. Internal hinges and stainless steel cam locks with external hexagonal drives ensure that no threads or internal hinge pins are exposed to the open food zone, keeping production lines 100% compliant with international food safety audits (HACCP, IFS, ISO 22000).</p>`,
      id: `<h3>Higienitas Mutlak untuk Industri Makanan, Minuman, dan Farmasi</h3>
<p>Enclosure Rittal Hygienic Design (HD) dirancang khusus untuk lingkungan pengolahan yang menuntut kebersihan steril tanpa risiko kontaminasi mikroba. Mengacu pada panduan ketat EHEDG (European Hygienic Engineering & Design Group), bodi panel HD dirancang tahan terhadap semprotan air bertekanan tinggi, uap panas, serta bahan kimia disinfektan berkonsentrasi tinggi.</p>
<h3>Desain Bebas Celah & Tanpa Area Mati (Dead Space)</h3>
<p>Berbeda dari panel industri standar, kabinet Rittal HD mengintegrasikan atap dengan kemiringan sudut 30 derajat ke arah depan. Hal ini memastikan seluruh cairan pembersih mengalir tuntas dan mencegah operator meletakkan benda asing di atas panel. Sisi tepi pintu dilipat miring 10° ke arah luar agar sisa busa dan air pencuci tidak pernah mengendap di celah paking.</p>
<h3>Gasket Silikon Biru Bersertifikat FDA Tanpa Sambungan</h3>
<p>Paking karet silikon solid berwarna biru kontras sesuai standar FDA 21 CFR 177.2600 memudahkan deteksi visual langsung apabila terjadi serpihan partikel. Segel paking terpasang continuous tanpa celah sambungan, sangat tahan terhadap zat pembersih klorin, dan dapat diganti secara instan saat siklus pemeliharaan sanitasi tanpa memerlukan bahan perekat kimia.</p>
<h3>Proteksi Ekstrem IP66 dan IP69K Uap Bertekanan</h3>
<p>Dengan sertifikasi IP69K, panel HD Rittal tahan terhadap semprotan air jet berkekuatan lebih dari 100 bar pada suhu hingga 80°C. Engsel tersembunyi di dalam panel dan pengunci hex luar stainless steel memastikan tidak ada ulir baut atau bagian bergerak terbuka di area kontak bahan makanan, memenuhi syarat penuh audit keamanan pangan internasional (HACCP, IFS, ISO 22000).</p>`,
    },
  },

  "rittal-distributor/atex-hazardous-area-enclosures": {
    id: "00000000-0000-0000-0000-000000000775",
    slug: "atex-hazardous-area-enclosures",
    fullPath: "rittal-distributor/atex-hazardous-area-enclosures",
    depth: 1,
    sortOrder: 8,
    imageUrl: "/uploads/products-rittal-atex-enclosures.jpg",
    title: {
      en: "Rittal ATEX & IECEx Hazardous Area Explosion-Proof Enclosures",
      id: "Enclosure Rittal ATEX & IECEx Tahan Ledakan Area Berbahaya",
    },
    summary: {
      en: "Certified explosion-proof junction boxes and control cabinets for ATEX/IECEx Zone 1, 2, 21, and 22 in offshore, chemical, and petrochemical hazardous environments.",
      id: "Kotak terminal dan kabinet kontrol bersertifikasi tahan ledakan standar ATEX/IECEx Zona 1, 2, 21, dan 22 untuk lingkungan industri kimia, migas, dan kilang lepas pantai.",
    },
    specs: {
      "EN: Explosion Protection\nID: Proteksi Ledakan": "ATEX II 2 G Ex e IIC Gb / II 2 D Ex tb IIIC Db, IECEx certified to EN 60079-0/-7/-31",
      "EN: Hazardous Zones\nID: Zona Berbahaya": "Gas: Zone 1 and Zone 2 | Dust: Zone 21 and Zone 22",
      "EN: Protection Category\nID: Kategori Proteksi": "IP66 to IEC 60529 (Type 4X, 12 to UL 50E)",
      "EN: Material Options\nID: Pilihan Material": "AISI 316L stainless steel (1.4404) or electrophoretic dipcoat-primed sheet steel with powder coating",
      "EN: Operating Temperature\nID: Suhu Operasional": "-30°C to +80°C with silicone/foamed PU seals engineered for harsh climates",
      "EN: Gland Plates & Accessories\nID: Pelat Kelenjar & Aksesori": "Integrated brass/stainless steel ATEX gland plates, earth studs, and Ex-approved viewing windows",
    },
    content: {
      en: `<h3>Certified Safety in Potentially Explosive Atmospheres</h3>
<p>Where combustible gases, vapors, or conductive dusts create an explosion hazard, electrical equipment must be housed with absolute integrity. Rittal ATEX and IECEx certified enclosures provide verified increased safety (Ex e) and dust ignition protection (Ex tb) across global oil and gas, petrochemical refineries, chemical processing plants, and grain handling facilities.</p>
<h3>Robust Certification for Zones 1, 2, 21, and 22</h3>
<p>Engineered and tested to the latest EN/IEC 60079 series standards, Rittal Ex enclosures carry comprehensive ATEX Directive 2014/34/EU and international IECEx approvals. Whether deployed in gas atmosphere Zone 1/2 or combustible dust atmosphere Zone 21/22, these enclosures isolate electrical sparks and internal thermal dissipation from surrounding hazardous ambient air.</p>
<h3>Marine-Grade AISI 316L Stainless Steel Construction</h3>
<p>For aggressive coastal and offshore marine environments, Rittal delivers enclosures manufactured from premium AISI 316L (1.4404) acid-resistant stainless steel. With electro-polished finishes and non-degrading high-temperature silicone seals, they resist high salt mist concentrations, hydrogen sulfide fumes, and ultraviolet degradation over decades of service.</p>
<h3>Engineered System Accessories & Cable Glands</h3>
<p>Rittal provides a complete Ex-approved ecosystem including certified brass or stainless steel cable gland plates, internal component mounting rails, external earthing studs (M6 to M10), and impact-resistant Ex inspection windows, simplifying field installation and streamlining local site certification.</p>`,
      id: `<h3>Keamanan Teruji untuk Atmosfer Mudah Meledak</h3>
<p>Di area industri di mana gas yang mudah terbakar, uap kimia, atau debu konduktif menciptakan bahaya ledakan tinggi, proteksi peralatan listrik menjadi keharusan mutlak. Enclosure tahan ledakan Rittal bersertifikasi ATEX dan IECEx menyediakan tingkat keamanan tinggi (Increased Safety Ex e) dan perlindungan penyalaan debu (Ex tb) untuk sektor minyak dan gas lepas pantai, kilang petrokimia, pabrik pupuk, dan industri tepung.</p>
<h3>Sertifikasi Menyeluruh untuk Zona 1, 2, 21, dan 22</h3>
<p>Dirancang dan diuji sesuai standar global EN/IEC 60079 series, panel Rittal Ex mengantongi sertifikat lengkap ATEX Directive 2014/34/EU serta sertifikasi internasional IECEx. Baik ditempatkan di zona gas mudah terbakar (Zona 1 & 2) maupun zona debu berbahaya (Zona 21 & 22), panel ini mengisolasi percikan listrik dan panas internal dari udara atmosfer sekitar.</p>
<h3>Konstruksi Stainless Steel AISI 316L Kelas Marine</h3>
<p>Untuk lingkungan kilang lepas pantai dan area pesisir yang sarat zat korosif, Rittal menyediakan panel berbahan stainless steel AISI 316L (1.4404) tahan asam. Dilengkapi lapisan brushed berkualitas tinggi dan gasket silikon tahan suhu ekstrem, panel ini tahan terhadap semprotan kabut garam pekat, uap gas hidrogen sulfida, serta paparan radiasi UV jangka panjang.</p>
<h3>Aksesori Terintegrasi & Lubang Kabel Bersertifikat Ex</h3>
<p>Rittal menyediakan ekosistem terpadu bersertifikat Ex mencakup pelat gland kuningan atau stainless steel, rel pemasangan internal, grounding stud tembaga/baja (M6 hingga M10), serta jendela inspeksi tahan benturan bersertifikat Ex guna mempermudah proses komisioning dan audit keselamatan operasional di lapangan.</p>`,
    },
  },

  "rittal-distributor/hmi-consoles-support-arm-systems": {
    id: "00000000-0000-0000-0000-000000000776",
    slug: "hmi-consoles-support-arm-systems",
    fullPath: "rittal-distributor/hmi-consoles-support-arm-systems",
    depth: 1,
    sortOrder: 9,
    imageUrl: "/uploads/products-rittal-hmi-support-arm.jpg",
    title: {
      en: "Rittal HMI Operator Enclosures & Support Arm Systems (CP 60/120/180)",
      id: "Enclosure Operator HMI & Sistem Lengan Penyangga Rittal (CP 60/120/180)",
    },
    summary: {
      en: "Ergonomic operator control housings (Comfort Panel, Optipanel) and modular support arm systems designed for seamless human-machine interaction on shop floors.",
      id: "Housing panel kontrol operator ergonomis (Comfort Panel, Optipanel) dan sistem lengan penyangga modular untuk interaksi mesin-operator optimal di lantai produksi.",
    },
    specs: {
      "EN: Housing Types\nID: Tipe Housing": "Comfort Panel, Optipanel, Compact Panel, and Command Panels with custom front foil cutouts",
      "EN: Support Arm System\nID: Sistem Lengan Penyangga": "CP 60 (up to 40 kg), CP 120 (up to 120 kg), and CP 180 (heavy-duty up to 180 kg) modular aluminum profiles",
      "EN: Rotation & Ergonomics\nID: Rotasi & Ergonomi": "Integrated swivel angles up to 310° with adjustable rotation stops and tilt adapters (±45°)",
      "EN: Cable Management\nID: Manajemen Kabel": "Spacious internal cable routing channel with removable clip covers for pre-terminated HDMI/Ethernet connectors",
      "EN: Protection Rating\nID: Tingkat Proteksi": "IP65 to IEC 60529 between housing and support arm connection",
      "EN: Material & Finish\nID: Material & Lapisan": "Extruded aluminium enclosure profiles with die-cast zinc corner caps, powder-coated in RAL 7035 / RAL 7024",
    },
    content: {
      en: `<h3>Ergonomic Human-Machine Interface at the Heart of Production</h3>
<p>Modern automated machinery demands intuitive, accessible, and fatigue-free operator interaction. Rittal HMI command panels and modular support arm systems (CP 60/120/180) deliver the perfect synthesis of ergonomic design, heavy-duty mechanical rigidity, and customizable screen housings for industrial displays, touchscreens, and push-button controls.</p>
<h3>Comfort Panel & Optipanel Operating Housings</h3>
<p>Rittal Comfort Panel and Optipanel housings are crafted from high-precision extruded aluminium sections. Designed to accommodate standard industrial PCs, Siemens/Schneider/Beckhoff touch panels, or customized operating keyboards, the housings feature quick-release rear doors for effortless maintenance and optimal passive heat dissipation.</p>
<h3>Modular CP 60, CP 120, and CP 180 Support Arm Systems</h3>
<p>Built as a versatile modular building-block system, Rittal support arm systems offer tailored load-bearing capacities: CP 60 for loads up to 40 kg, CP 120 for spans up to 120 kg, and CP 180 for heavy command stations up to 180 kg. Rotational couplings, intermediate hinges, and wall/base mounting brackets allow up to 310° horizontal rotation with precision swivel stops to protect wiring from twisting.</p>
<h3>Spacious Cable Routing & Complete IP65 Ingress Protection</h3>
<p>A crucial engineering advantage of Rittal support arm systems is the oversized interior cable ducting. Pre-assembled cables with large Ethernet, HDMI, or USB-C connectors can be pulled through elbows and swivel joints without disassembly or pin desoldering. Despite flexible swivel articulation, the entire mechanical system maintains continuous IP65 protection against industrial dust and cooling emulsion splashing.</p>`,
      id: `<h3>Antarmuka Mesin-Operator (HMI) Ergonomis di Inti Lini Produksi</h3>
<p>Mesin otomatisasi modern membutuhkan akses interaksi operator yang intuitif, ergonomis, dan tidak melelahkan. Panel kendali HMI dan sistem lengan penyangga modular Rittal (CP 60/120/180) memberikan sinergi sempurna antara desain estetis modern, kekuatan mekanis menopang beban berat, dan kompatibilitas fleksibel untuk monitor industri, layar sentuh, dan tombol darurat.</p>
<h3>Housing Operator Comfort Panel & Optipanel</h3>
<p>Housing Rittal Comfort Panel dan Optipanel diproduksi dari profil ekstrusi aluminium presisi tinggi. Dirancang khusus untuk memuat Industrial PC standar, layar sentuh (Siemens, Schneider, Beckhoff), atau tombol mekanik khusus, bodi housing memiliki pintu belakang sistem engsel cepat untuk kemudahan instalasi teknisi serta pelepasan panas internal yang sangat efisien.</p>
<h3>Sistem Lengan Modular CP 60, CP 120, dan CP 180</h3>
<p>Mengadopsi konsep modular serbaguna, sistem lengan penyangga Rittal menyediakan kapasitas beban sesuai kebutuhan: CP 60 untuk beban hingga 40 kg, CP 120 untuk bentang hingga 120 kg, dan CP 180 untuk stasiun kendali terberat hingga 180 kg. Engsel perantara dan bracket pemasangan dinding/lantai memungkinkan rotasi halus hingga 310° dengan pembatas sudut rotasi (rotation stop) untuk mencegah kabel terpelintir.</p>
<h3>Jalur Kabel Luas & Proteksi Debu-Air IP65</h3>
<p>Keunggulan utama sistem lengan Rittal terletak pada rongga kabel internal yang sangat lega. Kabel yang sudah terpasang konektor besar (seperti HDMI, Ethernet RJ45, atau kabel daya) dapat ditarik melewati siku dan sendi putar tanpa harus memotong atau membongkar pin konektor. Meskipun dapat berputar fleksibel, seluruh sistem tetap mempertahankan tingkat perlindungan IP65 terhadap debu industri dan percikan minyak pendingin mesin.</p>`,
    },
  },

  "rittal-distributor/riline-compact-busbar-system": {
    id: "00000000-0000-0000-0000-000000000777",
    slug: "riline-compact-busbar-system",
    fullPath: "rittal-distributor/riline-compact-busbar-system",
    depth: 1,
    sortOrder: 10,
    imageUrl: "/uploads/products-rittal-riline-compact.jpg",
    title: {
      en: "Rittal RiLine Compact Power Distribution Board (up to 125 A)",
      id: "Papan Distribusi Busbar Rittal RiLine Compact (hingga 125 A)",
    },
    summary: {
      en: "Ultra-compact, shock-hazard-protected busbar board system with tool-free push-in component connection, designed for compact control cabinets and decentralized sub-distribution.",
      id: "Sistem papan busbar ultra-kompak dengan proteksi sentuh aman IP2X dan koneksi snap-on tanpa perkakas, dirancang untuk kabinet kontrol ringkas dan sub-distribusi terdesentralisasi.",
    },
    specs: {
      "EN: Rated Operating Current (Ie)\nID: Arus Operasional Pengenal (Ie)": "Up to 125 A (690 V AC / 1500 V DC)",
      "EN: Short-Circuit Withstand (Ipk)\nID: Ketahanan Hubung Singkat (Ipk)": "Up to 25 kA (surge withstand strength)",
      "EN: Touch Protection\nID: Proteksi Sentuh Aman": "IP2XB touch-safe shrouding across all board slots to IEC 60529",
      "EN: Mounting & Connection\nID: Pemasangan & Koneksi": "Push-in clamp connection technology, drill-free snap-on mounting onto 35 mm DIN rails or mounting plates",
      "EN: Pitch & Widths\nID: Jarak Pitch & Lebar": "Standard 4.5 mm pitch grid (Board widths: 225 mm, 405 mm, 675 mm, 855 mm)",
      "EN: Component Adapters\nID: Adaptor Komponen": "Adapters for motor circuit breakers, contactors, and miniature circuit breakers (MCB) from 16 A to 63 A",
    },
    content: {
      en: `<h3>Maximum Power Density in Minimal Space</h3>
<p>The Rittal RiLine Compact is an innovative power distribution board system specifically engineered for small enclosures, machine control panels, and decentralized automation cabinets. Delivering up to 125 A current carrying capacity in an ultra-compact footprint, it replaces cumbersome traditional comb busbars and chaotic individual point-to-point wiring.</p>
<h3>All-Round Shock-Hazard Protection (IP2XB)</h3>
<p>Safety is built directly into the core of RiLine Compact. The entire copper board is completely enclosed in an insulated, flame-retardant chassis with a standardized 4.5 mm pitch grid. Any unused slots remain inherently touch-safe (IP2XB), allowing electrical technicians to safely snap on new motor starter adapters or change components without shutting down the entire distribution panel.</p>
<h3>Drill-Free Snap-On Push-In Technology</h3>
<p>Installation is completely tool-free. The base board snaps effortlessly onto standard 35 mm DIN rails or bolts onto enclosure mounting plates. Incoming power cables connect via spring-loaded push-in terminals, while outgoing motor feeders and circuit breakers mount via specialized snap-on component adapters with integrated wiring leads, slashing panel assembly time by up to 50%.</p>
<h3>Universal Component Compatibility</h3>
<p>RiLine Compact accommodates all major industrial switchgear brands including Siemens, Schneider Electric, ABB, and Eaton. With dedicated adapters for motor protection switches, reversing starters, and 1-pole/3-pole MCBs, panel builders achieve a clean, standardized, and vibration-resistant layout that adheres to international IEC 61439 standards.</p>`,
      id: `<h3>Kepadatan Daya Maksimum dalam Ruang Minimum</h3>
<p>Rittal RiLine Compact adalah sistem papan distribusi daya busbar inovatif yang dirancang khusus untuk enclosure kompak, panel kendali mesin, dan kabinet otomatisasi terdesentralisasi. Mengalirkan arus hingga 125 A dalam dimensi fisik yang sangat ringkas, RiLine Compact menggantikan susunan sisir busbar tradisional serta perkabelan manual titik-ke-titik yang memakan tempat.</p>
<h3>Proteksi Sentuh Aman Menyeluruh (IP2XB)</h3>
<p>Keamanan operator terintegrasi langsung di seluruh struktur RiLine Compact. Seluruh papan tembaga terlindung rapat di balik rangka isolasi tahan api dengan kisi pitch 4,5 mm. Seluruh slot modul yang belum terpakai otomatis aman dari sentuhan jari (IP2XB), memungkinkan teknisi menambah adaptor starter motor baru dengan aman tanpa harus mematikan total suplai listrik panel.</p>
<h3>Teknologi Push-In Sistem Klik Tanpa Pengeboran</h3>
<p>Proses instalasi tidak memerlukan perkakas rumit. Papan dasar langsung terpasang kuat pada rel DIN standar 35 mm atau dibaut ke pelat pemasangan kabinet. Kabel daya utama terhubung melalui terminal jepit pegas (push-in clamp), sementara modul starter motor dipasang melalui adaptor komponen sistem snap-on berkabel bawaan, memangkas waktu perakitan panel hingga 50%.</p>
<h3>Kompatibilitas Komponen Universal</h3>
<p>RiLine Compact mendukung berbagai merek switchgear terkemuka seperti Siemens, Schneider Electric, ABB, dan Eaton. Dilengkapi adaptor khusus untuk motor circuit breaker, starter bolak-balik (reversing starter), dan MCB 1P/3P, perakit panel dapat menciptakan tata letak switchgear yang rapi, terstandarisasi, dan tahan getaran sesuai regulasi internasional IEC 61439.</p>`,
    },
  },

  "rittal-distributor/riline60-modular-busbar-systems": {
    id: "00000000-0000-0000-0000-000000000778",
    slug: "riline60-modular-busbar-systems",
    fullPath: "rittal-distributor/riline60-modular-busbar-systems",
    depth: 1,
    sortOrder: 11,
    imageUrl: "/uploads/products-rittal-riline60.jpg",
    title: {
      en: "Rittal RiLine60 Modular 60 mm Busbar Systems (up to 1600 A)",
      id: "Sistem Busbar Modular 60 mm Rittal RiLine60 (hingga 1600 A)",
    },
    summary: {
      en: "Standardized 60 mm and 185 mm center-to-center busbar platform featuring drill-free OM component adapters, touch-safe shrouding, and NH fuse-switch disconnectors up to 1600 A.",
      id: "Platform busbar standar jarak 60 mm dan 185 mm dengan adaptor komponen OM bebas bor, penutup aman sentuh, dan sakelar pemutus sekring NH hingga 1600 A.",
    },
    specs: {
      "EN: Busbar Center Distances\nID: Jarak Pusat Busbar": "60 mm system (up to 1600 A) and 185 mm system (up to 2100 A)",
      "EN: Busbar Profiles Supported\nID: Profil Busbar Didukung": "Flat copper bars (12x5 mm up to 30x10 mm) and special Rittal PLS 800/1600 profiled copper bars",
      "EN: Rated Short-Time Withstand (Icw)\nID: Ketahanan Arus Hubung Singkat (Icw)": "Up to 50 kA (1s withstand) to IEC 61439-1",
      "EN: Component Adapters\nID: Adaptor Komponen": "OM adapters with tension spring clamps, CB circuit breaker adapters up to 630 A, connection adaptors up to 800 A",
      "EN: Fuse-Switch Disconnectors\nID: Sakelar Pemutus Sekring": "RiLine NH slimline fuse-switch disconnectors size 000, 00, 1, 2, and 3 with electronic fuse monitoring",
      "EN: Degree of Protection\nID: Derajat Proteksi": "IP2X touch protection with base trays, top cover profiles, and end covers",
    },
    content: {
      en: `<h3>The Global Standard for Industrial Motor Control and Power Panels</h3>
<p>The Rittal RiLine60 modular busbar system is the worldwide industry benchmark for low-voltage power distribution and Motor Control Centers (MCC). Based on an optimized 60 mm center-to-center phase distance, RiLine60 delivers a safe, organized, and space-saving busbar infrastructure accommodating currents from 250 A up to 1600 A.</p>
<h3>100% Drill-Free Mechanical and Electrical Assembly</h3>
<p>Traditional busbar building requires time-consuming hole punching, drilling, and tapping that permanently weakens copper bars. With RiLine60, all power connections, conductor tap-offs, and component adapters clamp directly onto the busbars without a single drilled hole. This completely eliminates copper shavings inside the enclosure and allows effortless repositioning of components during maintenance or panel expansion.</p>
<h3>Comprehensive OM & CB Component Adapters</h3>
<p>Rittal OM component adapters provide ready-to-mount platforms for contactors, motor protection circuit breakers, and soft starters. Equipped with pre-wired heat-resistant connection leads and adjustable support rails, OM adapters reduce wiring labor by up to 60%. For heavier feeder circuits, CB adapters mount 3-pole and 4-pole MCCBs up to 630 A directly onto the 60 mm busbars.</p>
<h3>Integrated RiLine NH Fuse-Switch Disconnectors</h3>
<p>From compact Size 000 (up to 160 A) to heavy-duty Size 3 (up to 630 A), Rittal NH fuse-switch disconnectors offer high-breaking capacity short-circuit isolation. Optional integrated electronic fuse monitoring (EFM) and smart current sensor modules transmit live voltage, current, and phase angle metrics via Modbus RTU or IO-Link to centralized industrial IoT energy management systems.</p>`,
      id: `<h3>Standar Global untuk Panel Kontrol Motor & Distribusi Industri</h3>
<p>Sistem busbar modular Rittal RiLine60 adalah acuan industri global untuk distribusi daya tegangan rendah dan pusat kendali motor (Motor Control Center / MCC). Dengan jarak antar fase standar 60 mm, RiLine60 menghadirkan infrastruktur distribusi daya yang sangat rapi, aman, dan hemat ruang untuk kapasitas arus dari 250 A hingga 1600 A.</p>
<h3>100% Perakitan Mekanikal & Elektrikal Tanpa Pengeboran</h3>
<p>Pekerjaan busbar konvensional membutuhkan proses pelubangan, pengeboran, dan pengetapan ulir tembaga yang memakan waktu dan berisiko mengurangi kekuatan mekanis batang tembaga. Pada RiLine60, seluruh klem sambungan daya, percabangan kabel, dan adaptor komponen menjepit langsung ke busbar tanpa perlu melubangi tembaga sama sekali. Ini menghilangkan serpihan logam di dalam panel dan memungkinkan relokasi komponen secara fleksibel saat ekspansi sistem.</p>
<h3>Adaptor Komponen OM & CB Terintegrasi</h3>
<p>Adaptor komponen Rittal OM menyediakan dudukan siap pasang untuk kontaktor, motor starter, dan soft starter. Dilengkapi kabel koneksi fleksibel tahan panas bawaan dan rel pendukung yang dapat digeser, adaptor OM memangkas waktu pengkabelan hingga 60%. Untuk beban feeder yang lebih besar, adaptor CB memungkinkan pemasangan MCCB 3-kutub dan 4-kutub hingga 630 A langsung di atas sistem busbar 60 mm.</p>
<h3>Sakelar Pemutus Sekring Terpadu Rittal NH</h3>
<p>Mulai dari ukuran kompak Size 000 (160 A) hingga beban berat Size 3 (630 A), sakelar pemutus sekring NH Rittal memberikan kapasitas pemutusan hubung singkat yang sangat tinggi. Modul pemantauan sekring elektronik (EFM) dan sensor arus cerdas opsional dapat mentransmisikan data tegangan, arus riil, dan sudut fase melalui Modbus RTU atau IO-Link ke sistem manajemen energi IoT pabrik.</p>`
    },
  },

  "rittal-distributor/maxi-pls-flat-pls-high-current-busbars": {
    id: "00000000-0000-0000-0000-000000000779",
    slug: "maxi-pls-flat-pls-high-current-busbars",
    fullPath: "rittal-distributor/maxi-pls-flat-pls-high-current-busbars",
    depth: 1,
    sortOrder: 12,
    imageUrl: "/uploads/products-rittal-maxi-pls.jpg",
    title: {
      en: "Rittal Maxi-PLS & Flat-PLS High-Current Busbar Systems (up to 6300 A)",
      id: "Sistem Busbar Arus Tinggi Rittal Maxi-PLS & Flat-PLS (hingga 6300 A)",
    },
    summary: {
      en: "Heavy-duty high-current main busbar platforms engineered for VX25 Ri4Power switchgear, delivering certified short-circuit withstand up to 120 kA (1s) and rated currents up to 6300 A.",
      id: "Platform busbar utama arus tinggi untuk switchgear VX25 Ri4Power, memberikan ketahanan hubung singkat tersertifikasi hingga 120 kA (1s) dan kapasitas arus hingga 6300 A.",
    },
    specs: {
      "EN: Rated Current (In)\nID: Arus Pengenal (In)": "Maxi-PLS: 1600 A to 4000 A | Flat-PLS: 2500 A up to 6300 A",
      "EN: Rated Short-Time Withstand (Icw)\nID: Ketahanan Arus Hubung Singkat (Icw)": "Up to 120 kA (1 s) / Peak short-circuit withstand (Ipk) up to 264 kA",
      "EN: Busbar Profile Engineering\nID: Rekayasa Profil Busbar": "Maxi-PLS specially contoured E-Cu profile with T-grooves; Flat-PLS up to 4x 120x10 mm laminated copper bars",
      "EN: Switchgear Enclosure Integration\nID: Integrasi Kabinet Switchgear": "Designed for VX25 Ri4Power low-voltage switchgear assemblies (Form 1 to Form 4b to IEC 61439-1/-2)",
      "EN: Busbar Locations\nID: Lokasi Pemasangan Busbar": "Top roof section, rear upper/lower section, or vertical distribution busbar zone",
      "EN: Connection Technology\nID: Teknologi Sambungan": "Drill-free T-head bolts for Maxi-PLS; heavy-duty clamping claw brackets for Flat-PLS with calibrated torque indicators",
    },
    content: {
      en: `<h3>High-Performance Main Busbar Architecture for Heavy Industry</h3>
<p>In power utility substations, data centers, steel mills, and chemical plants, main low-voltage switchgear must endure immense electrical currents and massive electrodynamic short-circuit stresses. The Rittal Maxi-PLS and Flat-PLS high-current busbar platforms deliver the ultimate solution for heavy industrial power distribution up to 6300 A.</p>
<h3>Maxi-PLS: Specially Contoured Copper Busbar Profiles</h3>
<p>The Maxi-PLS system (available in Maxi-PLS 45, 1600/2000 A and Maxi-PLS 60, 3200/4000 A) utilizes an engineered hollow copper extrusion featuring longitudinal T-grooves on all four sides. Conductor connections, incoming Air Circuit Breaker (ACB) busbars, and outgoing cables attach directly using high-tensile T-head bolts that slide smoothly into the profile grooves, ensuring massive contact surface pressure without requiring any bar drilling.</p>
<h3>Flat-PLS: Modular Flat Bar Systems Up to 6300 A</h3>
<p>For applications demanding maximum power throughput up to 6300 A, the Rittal Flat-PLS system employs parallel multi-laminated copper flat bars (up to 4 x 120 x 10 mm per phase). The reinforced busbar supports are injection molded from halogen-free, self-extinguishing thermoset plastic, capable of withstanding destructive short-circuit faults up to 120 kA for 1 full second and dynamic peak forces up to 264 kA.</p>
<h3>Type-Tested Integration in VX25 Ri4Power</h3>
<p>Maxi-PLS and Flat-PLS integrate seamlessly into the VX25 Ri4Power enclosure system. Positioned in the top, rear, or vertical busbar chambers, they support internal form separation Form 1, Form 2b, Form 3b, Form 4a, and Form 4b according to IEC 61439-1/-2. Standardized ACB and MCCB connection kits for ABB Emax, Schneider MasterPact, and Siemens Sentron guarantee full type-test compliance without bespoke fabrication.</p>`,
      id: `<h3>Arsitektur Busbar Utama Berkinerja Tinggi untuk Industri Berat</h3>
<p>Pada gardu induk utilitas listrik, pusat data berdaya besar, pabrik baja, dan kilang petrokimia, switchgear tegangan rendah utama harus mampu mengalirkan arus listrik masif sekaligus menahan gaya elektrodinamis ekstrem saat terjadi korsleting. Platform busbar arus tinggi Rittal Maxi-PLS dan Flat-PLS menghadirkan solusi paling andal untuk distribusi daya industri berat hingga kapasitas 6300 A.</p>
<h3>Maxi-PLS: Profil Tembaga Berkontur Khusus dengan Alur T</h3>
<p>Sistem Maxi-PLS (tersedia dalam tipe Maxi-PLS 45 untuk 1600/2000 A dan Maxi-PLS 60 untuk 3200/4000 A) menggunakan profil ekstrusi tembaga khusus (E-Cu) dengan alur-T memanjang pada keempat sisinya. Sambungan konduktor, busbar masukan dari Air Circuit Breaker (ACB), dan kabel feeder terpasang langsung menggunakan baut T-head berkekuatan tinggi yang meluncur di alur profil, menghasilkan tekanan kontak optimal tanpa perlu mengebor tembaga.</p>
<h3>Flat-PLS: Sistem Busbar Pelat Datar Modular hingga 6300 A</h3>
<p>Untuk kebutuhan daya super besar hingga 6300 A, sistem Rittal Flat-PLS menggunakan susunan batang tembaga datar paralel (hingga 4 x 120 x 10 mm per fase). Dudukan busbar berkekuatan tinggi dicetak dari polimer termoset bebas halogen yang tahan api, dirancang sanggup menahan arus gangguan hubung singkat mematikan hingga 120 kA selama 1 detik penuh serta gaya puncak dinamis (Ipk) hingga 264 kA.</p>
<h3>Integrasi Teruji Tipe (Type-Tested) pada VX25 Ri4Power</h3>
<p>Maxi-PLS dan Flat-PLS terintegrasi sempurna di dalam kabinet switchgear VX25 Ri4Power. Diposisikan di kompartemen atap, bagian belakang, atau zona distribusi vertikal, sistem ini mendukung pemisahan internal Form 1, Form 2b, Form 3b, Form 4a, hingga Form 4b sesuai IEC 61439-1/-2. Tersedia modul koneksi standar untuk ACB dan MCCB kelas dunia seperti ABB Emax, Schneider MasterPact, dan Siemens Sentron, menjamin kepatuhan sertifikasi type-test penuh tanpa fabrikasi manual khusus.</p>`
    },
  },

  "rittal-distributor/fan-and-filter-units": {
    id: "00000000-0000-0000-0000-000000000780",
    slug: "fan-and-filter-units",
    fullPath: "rittal-distributor/fan-and-filter-units",
    depth: 1,
    sortOrder: 13,
    imageUrl: "/uploads/products-rittal-fan-filter.jpg",
    title: {
      en: "Rittal TopTherm Fan-and-Filter Units & Roof-Mounted Ventilation",
      id: "Unit Fan-Filter TopTherm & Ventilasi Atap Panel Rittal",
    },
    summary: {
      en: "High-efficiency enclosure filter fans featuring diagonal fan technology, tool-free snap-in installation, and fine particulate protection up to IP55 / NEMA 12.",
      id: "Kipas filter enclosure berefisiensi tinggi dengan teknologi aliran diagonal, instalasi snap-in tanpa alat, dan proteksi partikel halus hingga IP55 / NEMA 12.",
    },
    specs: {
      "EN: Air Throughput (Unimpeded)\nID: Laju Aliran Udara Bebas": "20 m³/h up to 900 m³/h (Diagonal fan motor technology)",
      "EN: Protection Category\nID: Kategori Proteksi": "IP54 standard / IP55 with fine filter mat (to IEC 60529 / UL Type 12)",
      "EN: Motor Technology\nID: Teknologi Motor Kipas": "Energy-efficient EC motor with speed regulation (0-10V / PWM) and DC/AC shaded pole motors",
      "EN: Installation & Maintenance\nID: Pemasangan & Pemeliharaan": "Tool-free snap-in latching mechanism and hinged louvred grille for 10-second filter mat replacement",
      "EN: Available Variants\nID: Varian Tersedia": "Standard RAL 7035, EMC shielded RF versions, Hose-proof hoods (IP56), Roof-mounted extraction fans",
      "EN: Operating Temperatures\nID: Rentang Suhu Operasi": "-30°C to +55°C ambient temperature rating",
    },
    content: {
      en: `<h3>High-Performance Forced Air Circulation with Diagonal Fan Technology</h3>
<p>The Rittal TopTherm fan-and-filter series sets the global gold standard for reliable, cost-effective enclosure ventilation. Engineered with advanced diagonal fan impeller technology, airflow is directed diagonally across the enclosure interior, creating uniform air distribution that completely eliminates localized heat pockets and hot spots around densely packed power electronics.</p>
<h3>Tool-Free Snap-In Mounting & 10-Second Filter Mat Swaps</h3>
<p>Installation requires zero screws or specialized tools. The entire fan assembly snaps securely into standardized rectangular enclosure cutouts using patented spring-loaded latching clamps. Routine maintenance is equally effortless: the ergonomic louvre grille unlatches with a light fingertip pull, swinging open on heavy-duty hinges to allow filter mat inspection or replacement in under 10 seconds without stopping production.</p>
<h3>Intelligent Energy-Saving EC Fan Technology</h3>
<p>Available with state-of-the-art electronically commutated (EC) motors, Rittal TopTherm fans consume up to 60% less electrical power than standard AC induction fans. Built-in speed control interfaces (0-10 V or PWM) dynamically adjust fan revolutions to match actual internal cabinet temperature, drastically reducing acoustic noise levels and extending bearing service life beyond 70,000 continuous operating hours.</p>
<h3>Comprehensive Protection: Fine Dust, Hose-Proof, and EMC Shielding</h3>
<p>Standard units deliver IP54 ingress protection against dust and liquid splashes. By inserting high-density fine filter mats, protection is elevated to IP55 / NEMA 12. For washdown environments, Rittal stainless steel hose-proof hoods upgrade protection to IP56, while specialized EMC versions prevent electromagnetic interference in radio-frequency sensitive switchboards.</p>`,
      id: `<h3>Sirkulasi Udara Paksa Berkinerja Tinggi dengan Teknologi Kipas Diagonal</h3>
<p>Seri fan-and-filter Rittal TopTherm merupakan standar industri global untuk ventilasi enclosure panel yang andal dan hemat biaya. Ditenagai bilah kipas impeller diagonal berteknologi tinggi, aliran udara dihembuskan secara merata menyilang ke seluruh ruang dalam kabinet, menghilangkan titik panas terlokalisasi (hot spots) di sekitar inverter dan komponen daya berdensitas tinggi.</p>
<h3>Pemasangan Snap-In Tanpa Baut & Penggantian Filter 10 Detik</h3>
<p>Proses pemasangan tidak membutuhkan sekrup atau perkakas khusus. Seluruh rangka unit kipas langsung terkunci rapat ke lubang cutout standar kabinet menggunakan klem jepit pegas berpaten. Perawatan rutin sangat praktis: kisi louver ergonomis dapat dibuka dengan sentuhan satu jari pada engsel fleksibel, memungkinkan inspeksi atau penggantian filter mat dalam waktu kurang dari 10 detik tanpa perlu mematikan operasional panel.</p>
<h3>Teknologi Motor EC Hemat Energi yang Cerdas</h3>
<p>Tersedia dengan opsi motor Electronically Commutated (EC) mutakhir, kipas Rittal TopTherm mengonsumsi daya listrik hingga 60% lebih rendah dibanding motor induksi AC konvensional. Antarmuka pengatur kecepatan internal (0-10 V atau sinyal PWM) menyesuaikan putaran kipas secara dinamis berdasarkan suhu aktual panel, meredam kebisingan suara secara drastis serta memperpanjang usia pakai bearing hingga lebih dari 70.000 jam operasional non-stop.</p>
<h3>Proteksi Menyeluruh: Debu Halus, Semprotan Air, dan Pelindung EMC</h3>
<p>Unit standar memiliki proteksi IP54 terhadap debu dan cipratan cairan. Dengan menambahkan filter mat halus (fine filter mat), tingkat proteksi meningkat menjadi IP55 / NEMA 12. Untuk area cuci semprot air terbuka, penutup tudung stainless steel (hose-proof hood) Rittal meningkatkan proteksi hingga IP56, sementara varian khusus EMC mencegah kebocoran interferensi elektromagnetik pada panel instrumen sensitif.</p>`,
    },
  },

  "rittal-distributor/air-to-water-heat-exchangers-chillers": {
    id: "00000000-0000-0000-0000-000000000781",
    slug: "air-to-water-heat-exchangers-chillers",
    fullPath: "rittal-distributor/air-to-water-heat-exchangers-chillers",
    depth: 1,
    sortOrder: 14,
    imageUrl: "/uploads/products-rittal-heat-exchangers.jpg",
    title: {
      en: "Rittal Air-to-Water Heat Exchangers & Industrial Blue e+ Chillers",
      id: "Penukar Panas Udara-ke-Air & Chiller Industri Rittal Blue e+",
    },
    summary: {
      en: "Closed-loop liquid cooling solutions designed for harsh ambient environments up to +70°C, extreme dust, oily atmospheres, and heavy heat loads from 300 W to 40 kW.",
      id: "Solusi pendinginan sirkuit tertutup berbasis cairan untuk lingkungan ekstrem hingga +70°C, debu pekat, uap oli mesin, dan beban termal tinggi 300 W hingga 40 kW.",
    },
    specs: {
      "EN: Cooling Capacity\nID: Kapasitas Pendinginan": "Heat Exchangers: 300 W to 10,000 W | Blue e+ Chillers: 1 kW up to 40 kW",
      "EN: Max Ambient Temperature\nID: Suhu Lingkungan Maksimum": "Up to +70°C ambient operation without performance de-rating",
      "EN: Water Circuit Connections\nID: Sambungan Sirkuit Air": "G 3/8\" to G 1\" stainless steel / brass quick-connect threaded fittings",
      "EN: Enclosure Protection\nID: Proteksi Enclosure": "Maintains IP55 hermetic seal to IEC 60529 (no ambient factory air enters cabinet)",
      "EN: Chiller Compressor & Inverter\nID: Kompresor Chiller & Inverter": "Speed-regulated DC inverter compressor and electronic expansion valve (EEV)",
      "EN: Digital Interfaces\nID: Antarmuka Digital": "Comfort Controller with digital display, Modbus TCP, OPC-UA, and NFC diagnostics",
    },
    content: {
      en: `<h3>Extreme Climate Control for Severe Industrial Environments</h3>
<p>When industrial factory floors are contaminated with conductive carbon dust, metal shavings, paint aerosols, or chemical vapors, ambient air must never penetrate electrical enclosures. Rittal Air-to-Water Heat Exchangers deliver the ultimate closed-circuit cooling solution by dissipating internal enclosure heat directly into a plant chilled water circuit, completely isolating cabinet electronics from harsh ambient factory air.</p>
<h3>Reliable Operation in High Temperatures Up to +70°C</h3>
<p>Unlike standard refrigerant air conditioners that fail or trip out when ambient temperatures exceed 50°C, Rittal Air-to-Water Heat Exchangers operate reliably in extreme ambient environments up to +70°C. They are the preferred cooling choice for steel rolling mills, industrial glass manufacturing, aluminum smelters, automotive paint shops, and mining crushers.</p>
<h3>Blue e+ Industrial Recooling Chillers (1 kW to 40 kW)</h3>
<p>For facilities without a centralized plant cooling water network, Rittal Blue e+ chillers supply precisely temperature-controlled water down to ±0.5 K accuracy. Powered by inverter-regulated variable-speed DC compressors and electronically controlled expansion valves, Blue e+ chillers automatically adjust cooling output to match fluctuating process loads, saving up to 70% energy while protecting machine tool spindles, laser cutting optics, and switchgear suites.</p>
<h3>Condensate & Leakage Protection with Smart Monitoring</h3>
<p>Rittal heat exchangers incorporate integrated non-return valves, condensate collecting trays with drain hoses, and optical/electrical water leakage sensors. If unexpected piping condensation or line pressure drops occur, the intelligent Comfort Controller triggers automated alarms and isolates water solenoid valves to guarantee absolute enclosure safety.</p>`,
      id: `<h3>Pengendalian Suhu Ekstrem untuk Lingkungan Pabrik Berat</h3>
<p>Ketika lantai produksi pabrik terpapar debu karbon konduktif, serbuk gerinda logam, aerosol cat, atau uap kimia korosif, udara lingkungan sekitar sama sekali tidak boleh masuk ke dalam kabinet kontrol. Penukar Panas Udara-ke-Air (Air-to-Water Heat Exchanger) Rittal menghadirkan pendinginan sirkuit tertutup murni dengan membuang panas internal langsung ke sirkulasi air dingin terpusat pabrik, melindungi komponen sensitif secara total.</p>
<h3>Operasional Andal pada Suhu Lingkungan Tinggi hingga +70°C</h3>
<p>Berbeda dari AC pendingin refrigeran standar yang rentan mati saat suhu ruang melampaui 50°C, penukar panas air Rittal mampu beroperasi stabil pada suhu ambien ekstrem hingga +70°C. Unit ini menjadi solusi utama di pabrik peleburan baja, fasilitas manufaktur kaca, pabrik semen, pengecatan otomotif, dan area tambang terbuka.</p>
<h3>Chiller Industri Rittal Blue e+ (1 kW hingga 40 kW)</h3>
<p>Bagi fasilitas industri yang belum memiliki jaringan air dingin terpusat, unit Rittal Blue e+ Chiller menyediakan suplai air pendingin dengan presisi suhu ultra-tinggi hingga deviasi ±0,5 K. Ditenagai kompresor DC inverter berkecepatan dinamis dan katup ekspansi elektronik (EEV), chiller Blue e+ menyesuaikan daya pendingin secara otomatis mengikuti fluktuasi beban mesin, memangkas konsumsi listrik hingga 70% sekaligus menjaga performa spindle mesin CNC, laser pemotong, dan kabinet switchgear.</p>
<h3>Proteksi Kebocoran Air & Kondensasi Terpadu</h3>
<p>Seluruh unit penukar panas Rittal dilengkapi katup non-return, bak penampung kondensat dengan selang pembuangan aman, serta sensor kebocoran air optik dan elektrik terintegrasi. Apabila terjadi kondensasi berlebih atau anomali tekanan air sirkulasi, Comfort Controller cerdas akan langsung membunyikan alarm dan menutup katup solenoid air untuk memastikan keamanan elektrikal kabinet 100%.</p>`,
    },
  },

  "rittal-distributor/enclosure-heaters-dehumidifiers": {
    id: "00000000-0000-0000-0000-000000000782",
    slug: "enclosure-heaters-dehumidifiers",
    fullPath: "rittal-distributor/enclosure-heaters-dehumidifiers",
    depth: 1,
    sortOrder: 15,
    imageUrl: "/uploads/products-rittal-heaters.jpg",
    title: {
      en: "Rittal Enclosure Heaters, Thermostats & Hygrostats (Anti-Condensation)",
      id: "Pemanas Panel, Termostat & Higrostat Rittal (Anti-Kondensasi)",
    },
    summary: {
      en: "Self-regulating PTC convection heaters, fan heaters, and precision digital hygrostats engineered to prevent destructive moisture condensation and corrosion in electrical enclosures.",
      id: "Pemanas konveksi PTC otomatis, pemanas fan, dan higrostat digital presisi untuk mencegah tetesan air kondensasi dan korosi fatal di dalam panel listrik.",
    },
    specs: {
      "EN: Heating Output\nID: Kapasitas Pemanasan": "Continuous heating from 10 W to 800 W (PTC natural convection and fan-assisted heating)",
      "EN: Heating Technology\nID: Teknologi Elemen Pemanas": "Self-regulating Positive Temperature Coefficient (PTC) ceramic heating elements in extruded aluminum heatsinks",
      "EN: Relative Humidity Control\nID: Pengendalian Kelembaban Relatif": "Digital/mechanical hygrostats adjustable from 40% to 90% RH with dew-point tracking",
      "EN: Temperature Control\nID: Pengendalian Suhu": "Bimetallic snap-action thermostats (NO/NC) and dual electronic thermostat-hygrostat combos (-20°C to +80°C)",
      "EN: Mounting & Connection\nID: Pemasangan & Koneksi": "Snap-on mounting onto 35 mm DIN rails (EN 60715) with spring-loaded push-in wiring terminals",
      "EN: Electrical Certifications\nID: Sertifikasi Elektrikal": "VDE, UL Listed, CE, EAC, RoHS compliant with touch-safe insulated plastic casing",
    },
    content: {
      en: `<h3>Preventing Destructive Dew-Point Condensation in Industrial Enclosures</h3>
<p>In tropical, coastal, and outdoor environments with high humidity—such as Indonesia where relative humidity routinely exceeds 80%—temperature fluctuations between day and night cause air moisture to reach the dew point. Microscopic water droplets condense on cold busbars, PCB circuit boards, and terminal screws, causing catastrophic short circuits, insulation breakdown, and rapid contact corrosion. Rittal enclosure heaters eliminate this threat by keeping the interior temperature safely above the dew point at all times.</p>
<h3>Self-Regulating PTC Ceramic Heating Technology</h3>
<p>Rittal heaters utilize Positive Temperature Coefficient (PTC) ceramic resistor elements housed in aerodynamically optimized extruded aluminum profiles. The PTC technology provides inherent physical temperature limiting: as the heater warms up, its electrical resistance naturally increases, making the unit completely burn-out proof and energy self-regulating without requiring external thermal cutoff fuses.</p>
<h3>Fan-Assisted Heaters for Large Switchgear Cabinets</h3>
<p>For spacious modular enclosures such as the VX25, Rittal fan heaters (up to 800 W) integrate quiet, long-life axial fans that actively distribute warm air throughout the entire cabinet volume. This prevents cold zones at the bottom of the enclosure and ensures rapid, uniform dehumidification around incoming cable termination glands.</p>
<h3>Precision Thermostats, Hygrostats, and Smart IoT Controls</h3>
<p>Operating heaters continuously wastes energy and shortens component lifespan. Paired with Rittal mechanical thermostats (SK 3110) or digital electronic hygrostats (SK 3118), heating units activate only when internal cabinet temperature drops below the safe threshold or relative humidity rises above 65%. For automated plants, dual controllers send fault and status signals to SCADA and plant management networks.</p>`,
      id: `<h3>Mencegah Kondensasi Titik Embun & Korosi Fatal pada Panel Listrik</h3>
<p>Di daerah beriklim tropis dan pesisir dengan kelembaban udara tinggi—seperti Indonesia di mana kelembaban relatif sering melampaui 80%—perbedaan suhu antara siang dan malam hari dapat memicu terbentuknya titik embun (dew point). Butiran air mikroskopis mengembun di permukaan busbar tembaga, papan sirkuit PCB PLC, dan terminal kabel, menyebabkan korsleting fatal, penurunan resistansi isolasi, serta karat dini. Pemanas panel Rittal mengeliminasi ancaman ini dengan mempertahankan suhu kabinet selalu berada di atas titik embun.</p>
<h3>Teknologi Pemanas Keramik PTC Otomatis</h3>
<p>Pemanas Rittal menggunakan elemen keramik Positive Temperature Coefficient (PTC) yang terbungkus dalam heatsink aluminium ekstrusi berdesain aerodinamis. Karakteristik PTC memberikan keamanan suhu mandiri secara fisik: saat elemen memanas, hambatan listriknya otomatis meningkat sehingga konsumsi daya mengecil dengan sendirinya. Unit ini tahan bakar dan tidak pernah mengalami panas berlebih (overheat) meski tanpa sekring termal eksternal.</p>
<h3>Pemanas Bantuan Kipas (Fan Heater) untuk Kabinet Besar</h3>
<p>Untuk enclosure kubikal besar seperti VX25, Rittal fan heater (hingga 800 W) mengintegrasikan kipas aksial bersuara senyap yang aktif mendistribusikan udara hangat ke seluruh sudut volume kabinet. Hal ini mencegah terjadinya kantong udara dingin di bagian bawah panel dan mempercepat proses penghilangan kelembaban di sekitar kelenjar terminasi kabel masukan.</p>
<h3>Termostat, Higrostat Presisi & Pengendalian Cerdas IoT</h3>
<p>Menyalakan pemanas secara non-stop membuang energi dan memperpendek usia komponen. Dipadukan dengan termostat mekanis Rittal (SK 3110) atau higrostat digital elektronik (SK 3118), pemanas hanya akan menyala saat suhu internal panel turun di bawah batas aman atau kelembaban relatif melampaui 65% RH. Pada pabrik modern, pengontrol ganda ini mengirimkan sinyal status alarm ke sistem SCADA dan pemantauan IoT fasilitas.</p>`,
    },
  },

  "rittal-distributor/perforex-lc-laser-machining-centers": {
    id: "00000000-0000-0000-0000-000000000783",
    slug: "perforex-lc-laser-machining-centers",
    fullPath: "rittal-distributor/perforex-lc-laser-machining-centers",
    depth: 1,
    sortOrder: 16,
    imageUrl: "/uploads/products-rittal-perforex-lc.jpg",
    title: {
      en: "Rittal Perforex LC 3D Laser Machining Centers (Enclosure Modification)",
      id: "Mesin Modifikasi Laser 3D Rittal Perforex LC (Panel & Kubikal)",
    },
    summary: {
      en: "State-of-the-art 3D laser machining centers engineered for fast, burr-free, non-contact cutting of flat parts and fully assembled cubic enclosures in stainless steel, sheet steel, and aluminum.",
      id: "Pusat permesinan laser 3D mutakhir untuk pemotongan cepat tanpa geram (burr-free) dan tanpa kontak pada panel lembaran maupun kubikal utuh berbahan stainless steel, baja, dan aluminium.",
    },
    specs: {
      "EN: Machining Capability\nID: Kapabilitas Permesinan": "3D contactless cutting of cubic enclosures and flat parts (doors, side panels, mounting plates)",
      "EN: Supported Materials\nID: Material yang Didukung": "Stainless steel (1.4301 / AISI 304, AISI 316), sheet steel, aluminum, powder-coated enclosures, and plastics",
      "EN: Workpiece Dimensions (WxHxD)\nID: Dimensi Benda Kerja (PxTxL)": "Enclosures up to 1,270 x 2,250 x 800 mm; flat parts up to 2,800 x 1,250 mm",
      "EN: Laser Source & Quality\nID: Sumber Laser & Kualitas": "Fiber laser up to 3 kW with automatic focus control and narrow cutting kerf (<0.2 mm)",
      "EN: Surface Finish Quality\nID: Kualitas Permukaan Hasil Potong": "100% burr-free cut edges without paint flaking, thermal deformation, or tarnishing on stainless steel",
      "EN: CAD/CAM & Software Integration\nID: Integrasi Perangkat Lunak & CAD/CAM": "Direct native import from EPLAN Pro Panel, RiPanel Processing, standard DXF and DWG formats",
    },
    content: {
      en: `<h3>Next-Generation 3D Laser Enclosure Machining for Switchgear Manufacturing</h3>
<p>Manual cutouts and drilling of stainless steel panels and welded enclosures require significant labor, heavy tooling wear, and time-consuming manual deburring and touch-up painting. The Rittal Perforex LC (Laser Center) series revolutionizes panel building by utilizing high-precision fiber laser cutting in full 3D space. It machines completely welded cubic enclosures as well as flat mounting plates and doors in a single uninterrupted clamping setup.</p>
<h3>Contactless, Distortion-Free Machining with Zero Tool Wear</h3>
<p>Unlike conventional mechanical milling or punching machines, the laser operates completely contactless. This eliminates clamping forces that can distort thin-walled panels, avoids tool breakage or wear on tough stainless steel alloys, and prevents vibration damage to pre-mounted components. The fiber laser delivers narrow, micrometric kerfs with extreme edge sharpness, allowing intricate cutouts, circular holes, and thread pilot holes to be completed in seconds.</p>
<h3>Stainless Steel Processing Without Tarnishing or Paint Flaking</h3>
<p>A crucial advantage of the Perforex LC is its optimized assist-gas cutting technology. When cutting stainless steel (AISI 304 / 316) with nitrogen assist gas, cut edges remain bright and completely free of oxidation or discoloration, preserving the corrosion resistance of the material without requiring pickling or chemical passivation. On powder-coated panels, the narrow heat-affected zone prevents blistering or flaking of the protective finish.</p>
<h3>Seamless End-to-End Industry 4.0 Digital Workflow</h3>
<p>As part of the Rittal and EPLAN digital ecosystem, the Perforex LC imports 3D virtual prototype data directly from EPLAN Pro Panel without requiring manual CNC programming at the machine. Operators simply scan a QR code from the work order; the machine automatically calculates optimum travel paths, positions pneumatic clamping fixtures, and executes cutouts with sub-millimeter repeatable precision.</p>`,
      id: `<h3>Pusat Permesinan Laser 3D Generasi Terbaru untuk Pabrikasi Panel Listrik</h3>
<p>Pembuatan lubang (cutout) dan pengeboran manual pada panel stainless steel dan kabinet las memerlukan waktu kerja lama, keausan mata bor/punching yang cepat, serta proses gerinda (deburring) dan pengecatan ulang yang memakan biaya. Rittal Perforex LC (Laser Center) merevolusi industri panel maker dengan memanfaatkan teknologi pemotongan laser fiber berpresisi tinggi dalam ruang 3D. Mesin ini mampu memproses kubikal utuh yang telah terakit maupun lembaran pintu dan mounting plate dalam satu kali proses clamping.</p>
<h3>Pemotongan Tanpa Kontak, Bebas Deformasi & Tanpa Keausan Alat Potong</h3>
<p>Berbeda dengan mesin milling atau punching konvensional, laser bekerja 100% tanpa kontak fisik dengan material. Hal ini menghilangkan gaya tekan penjepit yang dapat membengkokkan lembaran pelat tipis, mencegah keausan atau patahnya pahat potong pada material keras seperti stainless steel, serta meniadakan getaran mekanis. Sinar laser fiber menghasilkan celah potong mikrometrik yang sangat tajam dan presisi, menuntaskan lubang HMI, ventilasi, dan tombol tekan dalam hitungan detik.</p>
<h3>Pemrosesan Stainless Steel Tanpa Perubahan Warna & Cat Bebas Mengelupas</h3>
<p>Keunggulan utama Perforex LC terletak pada pemotongan dengan gas nitrogen bertekanan tinggi. Pada pemotongan stainless steel (AISI 304 / 316), tepi potongan tetap mengkilap, bersih dari jelaga (slag), dan tidak teroksidasi, sehingga ketahanan korosi alami baja nirkarat tetap terjaga tanpa memerlukan proses pasivasi kimia tambahan. Pada panel yang telah dilapisi cat bubuk (powder coating), zona terpengaruh panas (HAZ) yang sangat sempit menjamin cat tidak melepuh atau pecah.</p>
<h3>Alur Kerja Digital Industry 4.0 Terintegrasi EPLAN Pro Panel</h3>
<p>Sebagai pilar digital ekosistem Rittal dan EPLAN, Perforex LC dapat mengimpor data prototipe 3D langsung dari EPLAN Pro Panel tanpa memerlukan pemrograman manual CNC di lantai pabrik. Operator cukup memindai barcode atau QR code pada surat perintah kerja (SPK); mesin secara otomatis menghitung lintasan potong tercepat, memposisikan fixture pneumatik, dan mengeksekusi pengerjaan dengan akurasi pengulangan sub-milimeter.</p>`,
    },
  },

  "rittal-distributor/wire-terminal-automated-wire-processing": {
    id: "00000000-0000-0000-0000-000000000784",
    slug: "wire-terminal-automated-wire-processing",
    fullPath: "rittal-distributor/wire-terminal-automated-wire-processing",
    depth: 1,
    sortOrder: 17,
    imageUrl: "/uploads/products-rittal-wire-terminal.jpg",
    title: {
      en: "Rittal Wire Terminal WT Fully Automated Wire Processing & Harnessing System",
      id: "Mesin Pemroses & Pengkabelan Otomatis Rittal Wire Terminal WT",
    },
    summary: {
      en: "Compact fully automated wire assembly machine performing wire cutting to length, stripping, crimping, and individual inkjet printing up to 8x faster than manual assembly.",
      id: "Mesin perakitan kawat otomatis kompak yang melakukan pemotongan presisi, pengupasan isolasi, crimping ferrule, dan pencetakan inkjet hingga 8 kali lebih cepat dibanding metode manual.",
    },
    specs: {
      "EN: Processing Capability\nID: Kapabilitas Pemrosesan": "Automated wire feeding, cutting to length, stripping, ultrasonic/ferrule crimping, and dual inkjet printing",
      "EN: Wire Cross-Sections\nID: Penampang Kawat yang Didukung": "0.5 mm² to 6.0 mm² (AWG 20 to AWG 10) single-core flexible conductors",
      "EN: Wire Processing Speed\nID: Kecepatan Pemrosesan Kawat": "Up to 8x faster than manual wiring; produces up to 36 different wire types sequentially",
      "EN: Wire Sorting & Storage\nID: Sistem Penyortiran & Rak Penampung": "13-track rail lift storage magazines sorting finished wires by order, destination, or wiring sequence",
      "EN: Identification & Marking\nID: Identifikasi & Penandaan": "White and black thermo-inkjet wire printing on insulation with source/target and terminal designation",
      "EN: Software & CAE Integration\nID: Integrasi Perangkat Lunak & CAE": "Direct digital connectivity with EPLAN Smart Wiring, EPLAN Pro Panel, and CSV/XML wire lists",
    },
    content: {
      en: `<h3>Accelerating Control Panel Enclosure Wiring by Up to Eight Times</h3>
<p>Wiring control panels is traditionally the most labor-intensive bottleneck in electrical switchgear fabrication, accounting for over 40% of total assembly hours. The Rittal Wire Terminal WT automates the entire wire preparation sequence: measuring exact wire lengths, cutting, stripping both insulation ends, crimping wire ferrules, and printing clear alphanumeric markings—producing fully finished wires ready for direct installation.</p>
<h3>Modular Tooling and Flexible Wire Magazine Options</h3>
<p>The Wire Terminal WT accommodates wire cross-sections from 0.5 mm² to 6.0 mm² without mechanical retooling. Equipped with versatile wire magazines holding up to 36 spools or barrels of different wire colors and cross-sections, the machine automatically switches between conductor types on the fly according to digital wiring instructions.</p>
<h3>Integrated High-Resolution Inkjet Wire Marking</h3>
<p>Eliminate loose sleeve tags and tedious manual heat-shrink labeling. The Wire Terminal WT integrates two-color high-resolution inkjet print heads (white and black ink) that print wire numbers, connection endpoints, and terminal block addresses directly onto the conductor insulation. The ink cures instantly and is completely smudge-resistant and oil-resistant.</p>
<h3>Seamless Integration with EPLAN Smart Wiring</h3>
<p>Finished wires are deposited into 13-track sorting lift magazines according to their installation sequence in the panel or grouped by device destination. Combined with EPLAN Smart Wiring software, panel builders on the shop floor receive digital step-by-step visual guidance on mobile tablets, ensuring zero wiring errors, effortless wire routing, and maximum production velocity.</p>`,
      id: `<h3>Mempercepat Pengkabelan Panel Kontrol Hingga Delapan Kali Lipat</h3>
<p>Pengkabelan (wiring) panel kontrol secara konvensional merupakan tahapan paling memakan waktu dan tenaga kerja dalam pabrikasi switchgear, menghabiskan lebih dari 40% total jam kerja perakitan. Rittal Wire Terminal WT mengotomatiskan seluruh rangkaian persiapan kabel: mengukur panjang kawat secara presisi, memotong, mengupas kedua ujung isolasi, melakukan crimping ferrule, serta mencetak penanda alfanumerik yang jelas—menghasilkan kawat siap pasang dengan sempurna.</p>
<h3>Opsi Tooling Modular & Pilihan Rel Kawat yang Fleksibel</h3>
<p>Wire Terminal WT dapat memproses penampang kabel dari 0,5 mm² hingga 6,0 mm² tanpa perlu pergantian alat mekanis secara manual. Dilengkapi dengan unit dispenser kawat yang menampung hingga 36 gulungan spul atau drum dengan warna dan penampang berbeda, mesin ini secara otomatis beralih antar jenis kawat sesuai instruksi pengkabelan digital.</p>
<h3>Pencetakan Label Inkjet Resolusi Tinggi Terintegrasi</h3>
<p>Tinggalkan ferrule tag selongsong lepas dan proses pemasangan label heat-shrink manual yang melelahkan. Wire Terminal WT mengintegrasikan print head inkjet dua warna beresolusi tinggi (tinta putih dan hitam) yang mencetak nomor kawat, terminal asal, dan terminal tujuan langsung di atas jaket isolasi kawat. Tinta mengering seketika, tahan gesekan, serta tahan minyak pelumas industri.</p>
<h3>Integrasi Mulus dengan EPLAN Smart Wiring</h3>
<p>Kabel-kabel yang telah selesai diproduksi dialirkan ke dalam rak susun lift penyortir (13-track rail lift) berdasarkan urutan pemasangan di dalam kabinet atau dikelompokkan per blok komponen tujuan. Dipadukan dengan perangkat lunak EPLAN Smart Wiring, teknisi perakit di lantai produksi mendapatkan panduan visual interaktif langkah-demi-langkah melalui tablet digital, memastikan zero error wiring dan efisiensi pabrikasi optimal.</p>`,
    },
  },

  "rittal-distributor/copper-workstation-busbar-machining": {
    id: "00000000-0000-0000-0000-000000000785",
    slug: "copper-workstation-busbar-machining",
    fullPath: "rittal-distributor/copper-workstation-busbar-machining",
    depth: 1,
    sortOrder: 18,
    imageUrl: "/uploads/products-rittal-copper-workstation.jpg",
    title: {
      en: "Rittal Copper Workstation CW 120 (Busbar Bending, Punching & Cutting)",
      id: "Meja Kerja Pemrosesan Busbar Tembaga Rittal Copper Workstation CW 120",
    },
    summary: {
      en: "Ergonomic, electro-hydraulic mobile workstation for precision bending, punching, and cutting of solid copper and aluminum busbars up to 120 x 12 mm.",
      id: "Meja kerja elektro-hidrolik ergonomis dan mobile untuk pembengkokan presisi, pelubangan hidrolik, dan pemotongan busbar tembaga serta aluminium padat hingga ukuran 120 x 12 mm.",
    },
    specs: {
      "EN: Machining Operations\nID: Operasi Permesinan": "Precision cutting, hydraulic hole punching, and angle bending on a single ergonomic station",
      "EN: Max. Busbar Dimensions\nID: Dimensi Maksimum Busbar": "Up to 120 mm width and 12 mm thickness (copper Cu and aluminum Al busbars)",
      "EN: Punching Capabilities\nID: Kapabilitas Pelubangan (Punching)": "Round punches Ø 6.6 mm to Ø 21.5 mm, slotted hole punches up to 21 x 18 mm with laser centering pointer",
      "EN: Bending Accuracy & Features\nID: Akurasi & Fitur Pembengkokan": "Bending angle 0° to 90° with digital electronic angle measurement and automatic springback compensation",
      "EN: Hydraulic Drive System\nID: Sistem Penggerak Hidrolik": "Integrated 230 V / 400 V electro-hydraulic power pack generating up to 700 bar operating pressure",
      "EN: Mobility & Ergonomics\nID: Mobilitas & Ergonomi": "Heavy-duty industrial casters with swivel brakes, pull-out side roller supports, and built-in waste collection drawers",
    },
    content: {
      en: `<h3>Professional Solid Copper Busbar Fabrication for Power Distribution Enclosures</h3>
<p>Fabricating custom copper busbar systems for low-voltage switchboards and power distribution panels requires tremendous hydraulic force, uncompromising dimensional accuracy, and strict operator safety. The Rittal Copper Workstation CW 120 combines cutting, round/slotted hole punching, and precision bending into a compact, mobile industrial workstation designed specifically for panel builders and switchgear manufacturers.</p>
<h3>Triple Functionality: Cutting, Punching, and Bending in One Station</h3>
<p>Eliminate clutter and time wasted moving heavy copper stock between separate stationary machines. The CW 120 features three dedicated machining stations powered by a high-pressure 700-bar electro-hydraulic power pack. Operators can cut solid copper bars cleanly without chips or waste, punch clean round or oblong bolt holes, and bend sharp 90-degree offsets on bars up to 120 mm wide and 12 mm thick.</p>
<h3>Digital Precision Angle Measurement and Springback Compensation</h3>
<p>Achieving exact angles in heavy copper bars is challenging due to varying material temper and elasticity. The CW 120 bending station incorporates a digital electronic angle sensor. Once the target angle is entered on the digital display, the machine compensates for natural material springback automatically, guaranteeing identical, repeatable bends on batch production runs without manual guesswork.</p>
<h3>Integrated Optical Laser Centering and Safe Ergonomics</h3>
<p>To ensure perfect hole alignment with switchgear connection terminals, the punching station is equipped with a high-visibility optical line laser that projects crosshairs precisely onto the punching center mark. Extendable lateral roller conveyors support long, heavy busbars with minimal operator strain, while integrated pull-out drawers capture metal punch slugs and offcuts cleanly.</p>`,
      id: `<h3>Fabrikasi Busbar Tembaga Profesional untuk Panel Distribusi Tenaga Listrik</h3>
<p>Pabrikasi busbar tembaga khusus untuk switchboard tegangan rendah dan panel distribusi daya menuntut gaya hidrolik besar, presisi dimensi tanpa kompromi, serta keselamatan operator yang terjamin. Rittal Copper Workstation CW 120 mengintegrasikan fungsi pemotongan, pelubangan bulat/oval hidrolik, dan pembengkokan presisi dalam satu workstation mobile industri kompak yang dirancang khusus bagi perakit panel listrik profesional.</p>
<h3>Tiga Fungsi Sekaligus: Potong, Punching & Tekuk dalam Satu Meja Kerja</h3>
<p>Hilangkan pemborosan waktu dan ruang akibat memindahkan batang tembaga berat di antara mesin-mesin terpisah. CW 120 memiliki tiga stasiun kerja yang ditenagai oleh unit daya elektro-hidrolik bertekanan tinggi 700 bar. Operator dapat memotong batang tembaga padat dengan hasil bersih tanpa serpihan gram berbahaya, melubangi lubang baut bulat atau lonjong, serta menekuk busbar hingga lebar 120 mm dan ketebalan 12 mm.</p>
<h3>Pengukuran Sudut Digital Presisi & Kompensasi Springback Otomatis</h3>
<p>Mendapatkan sudut tekukan yang akurat pada busbar tembaga tebal sering terkendala oleh elastisitas kelenturan material (springback). Stasiun tekuk CW 120 dilengkapi sensor sudut elektronik digital. Operator cukup memasukkan target sudut pada layar digital; sistem kontrol hidrolik secara otomatis mengimbangi efek pegas material sehingga setiap tekukan berulang memiliki sudut yang persis identik tanpa coba-coba manual.</p>
<h3>Penunjuk Laser Optik Presisi & Ergonomi Kerja Tingkat Tinggi</h3>
<p>Untuk memastikan lubang baut sejajar sempurna dengan terminal komponen pemutus sirkuit, stasiun pelubangan dilengkapi proyektor laser garis silang presisi tinggi. Meja rol penyangga samping yang dapat dipanjangkan menopang batang busbar panjang dengan aman dan ergonomis, sementara laci penampung terintegrasi mengumpulkan limbah slug punch tembaga secara rapi dan bersih.</p>`,
    },
  },

  "rittal-distributor/tx-cablenet-network-racks": {
    id: "00000000-0000-0000-0000-000000000786",
    slug: "tx-cablenet-network-racks",
    fullPath: "rittal-distributor/tx-cablenet-network-racks",
    depth: 1,
    sortOrder: 19,
    imageUrl: "/uploads/products-rittal-tx-cablenet.jpg",
    title: {
      en: "Rittal TX CableNet Network Racks (Waterfall Cable Management)",
      id: "Rak Jaringan & Server Rittal TX CableNet (Manajemen Kabel Waterfall)",
    },
    summary: {
      en: "Purpose-built IT network and server rack with patented 'waterfall' roof cable routing, safeguarding fiber-optic and copper bending radii with rapid tool-free interior installation.",
      id: "Rak jaringan dan server IT dengan konsep perutean kabel atap 'waterfall' berpaten, menjaga radius lekukan kabel fiber optik dan tembaga dengan instalasi interior cepat tanpa perkakas.",
    },
    specs: {
      "EN: System Architecture\nID: Arsitektur Sistem": "Welded torsion-free steel frame with dynamic 'waterfall' cable routing over the roof plate",
      "EN: Load Capacity\nID: Kapasitas Beban": "Static load capacity up to 15,000 N (1,500 kg); dynamic load up to 10,000 N",
      "EN: Dimensions & Form Factors\nID: Dimensi & Pilihan Ukuran": "Heights: 24U, 42U, 47U | Widths: 600 mm & 800 mm | Depths: 800 mm & 1,000 mm",
      "EN: Door Configurations\nID: Konfigurasi Pintu": "Glazed front door with 3 mm toughened safety glass or 78% vented perforated sheet steel door for airflow",
      "EN: Cable Routing Concept\nID: Konsep Manajemen Kabel": "Moulded plastic waterfall arches ensure compliance with minimum cable bending radius (copper & fiber)",
      "EN: Standards & Protection\nID: Standar & Kategori Proteksi": "IP20 to IEC 60529, EIA-310-E, DIN EN 61587-1, RoHs and UL 2416 compliant",
    },
    content: {
      en: `<h3>Next-Level Network Infrastructure with Patented 'Waterfall' Cable Management</h3>
<p>Managing high-density copper and fiber-optic cabling in data centers and telecom rooms is one of the most critical challenges in modern network engineering. Kinking, excessive tension, or sharp bends violate the minimum bending radius of Cat 6A/7 cables and multi-strand optical fibers, degrading transmission signal bandwidth and causing packet loss. The Rittal TX CableNet solves this with an innovative roof concept: curved plastic 'waterfall' profiles direct incoming cables from above into the rack interior smoothly, preserving the required bending radius automatically without requiring manual dressing.</p>
<h3>Fast-Track Deployment with Zero-Tool Snap-In Interior Installation</h3>
<p>Time is of the essence when deploying enterprise networks. The TX CableNet is delivered pre-assembled and engineered for rapid out-of-the-box commissioning. The 19" (482.6 mm) mounting angles are continuously adjustable in depth and feature standard U-height markings. Quick-release fasteners allow side panels, doors, and cable fingers to be removed and repositioned in seconds without requiring screwdrivers or specialized tools.</p>
<h3>Optimized Airflow for Active Switches & Dense Patch Panels</h3>
<p>Available with either a modern glazed safety glass front door for low-noise office closets or a 78% perforated vented steel door for high-density network switches and patch panels. The vented door configuration maximizes natural convection and fan-assisted airflow, eliminating localized hot spots around high-throughput core routers and enterprise SAN directors.</p>
<h3>Full Compatibility with Rittal PDU, CMC III & System Accessories</h3>
<p>The TX CableNet integrates seamlessly into the complete Rittal IT ecosystem. Intelligent Rittal PDUs mount directly in the zero-U space along the vertical frame, leaving all 19" horizontal rack units available for IT servers and switches. CMC III environmental sensors, cable trays, and brush strips snap into pre-punched system punchings without requiring field drilling.</p>`,
      id: `<h3>Infrastruktur Jaringan Tingkat Tinggi dengan Manajemen Kabel 'Waterfall' Berpaten</h3>
<p>Pengelolaan kabel tembaga dan serat optik berdensitas tinggi di pusat data dan ruang telekomunikasi merupakan salah satu tantangan paling kritis dalam operasional jaringan modern. Tekukan tajam atau tarikan kabel yang berlebih melanggar batas minimum bending radius kabel Cat 6A/7 dan fiber optik, memicu pelemahan sinyal (attenuation) serta packet loss. Rittal TX CableNet mengatasi masalah ini melalui konsep atap inovatif: profil lengkung plastik 'waterfall' memandu kabel masuk dari atas kabinet ke dalam rak secara mulus, menjaga radius kelengkungan alami kabel secara otomatis tanpa perlu penataan manual yang rumit.</p>
<h3>Pemasangan Cepat dengan Sistem Snap-In Tanpa Perkakas</h3>
<p>Kecepatan implementasi sangat krusial dalam pembangunan jaringan enterprise. TX CableNet dikirim dalam kondisi siap rakit dan dirancang untuk commissioning instan. Rel dudukan 19" (482,6 mm) dapat digeser kedalamannya secara fleksibel dan dilengkapi penanda unit U yang jelas. Pengunci pelepas cepat (quick-release fasteners) memungkinkan panel samping, pintu, dan pengatur kabel dilepas maupun dipasang kembali dalam hitungan detik tanpa obeng atau perkakas khusus.</p>
<h3>Aliran Udara Optimal untuk Switch Aktif & Patch Panel Densitas Tinggi</h3>
<p>Tersedia dengan opsi pintu kaca tempered berpemandangan jernih untuk ruang server kantor yang senyap, atau pintu pelat baja berlubang (perforasi 78%) untuk sakelar jaringan (switches) dan patch panel berdensitas tinggi. Konfigurasi pintu berlubang memaksimalkan ventilasi konveksi udara bebas, mendinginkan router core dan perangkat storage SAN tanpa terbentuknya kantong panas (hot spots).</p>
<h3>Kompatibilitas Penuh dengan Smart PDU Rittal & Sensor CMC III</h3>
<p>TX CableNet terintegrasi sempurna dengan ekosistem perangkat IT Rittal lainnya. Smart PDU Rittal dapat dipasang langsung pada ruang 'Zero-U' di sepanjang tiang vertikal rak, membebaskan seluruh ruang 19" horizontal untuk peralatan server dan switch. Sensor pemantau lingkungan CMC III, nampan kabel, dan strip sikat debu terkunci rapat pada lubang sistem bawaan pabrik tanpa perlu pengeboran tambahan.</p>`,
    },
  },

  "rittal-distributor/intelligent-it-pdu-power-distribution": {
    id: "00000000-0000-0000-0000-000000000787",
    slug: "intelligent-it-pdu-power-distribution",
    fullPath: "rittal-distributor/intelligent-it-pdu-power-distribution",
    depth: 1,
    sortOrder: 20,
    imageUrl: "/uploads/products-rittal-intelligent-pdu.jpg",
    title: {
      en: "Rittal Intelligent IT PDU (Metered, Switched & Managed Power Distribution)",
      id: "Unit Distribusi Daya Cerdas Rittal IT PDU (Metered, Switched & Managed)",
    },
    summary: {
      en: "Intelligent zero-U rack power distribution units featuring billing-grade energy metering (EN 62053-21 Class 1), individual outlet remote switching, integrated Type B RCM, and CMC III IoT sensors.",
      id: "Unit distribusi daya cerdas untuk rak server zero-U dengan pengukuran energi kelas billing (EN 62053-21 Kelas 1), remote switching per-outlet, proteksi RCM Tipe B, dan konektivitas IoT CMC III.",
    },
    specs: {
      "EN: PDU Variant Portfolio\nID: Varian Portofolio PDU": "Basic, Metered (phase-infeed), Metered Plus (per-outlet), Switched (remote toggle), Managed (metered + switched)",
      "EN: Form Factor & Mounting\nID: Faktor Bentuk & Pemasangan": "Slim aluminum profile for tool-free vertical zero-U mounting in VX IT and TX CableNet server racks",
      "EN: Socket Configurations\nID: Konfigurasi Soket Outlet": "Combinations of IEC 60320 C13 (10 A) and C19 (16 A) with patented dual mechanical locking mechanism",
      "EN: Metering & Accuracy\nID: Pengukuran & Akurasi Energi": "Billing-grade measurement accuracy Class 1 (±1%) compliant with EN 62053-21 (kWh, kW, V, A, PF, THD)",
      "EN: Safety & Residual Current\nID: Fitur Keamanan & Arus Sisa": "Integrated AC/DC sensitive Residual Current Monitoring (RCM Type B) and Type 3 surge arresters",
      "EN: Network & IoT Protocols\nID: Protokol Jaringan & IoT": "Gigabit Ethernet, SNMPv1/v2c/v3, Modbus TCP, OPC-UA, IPv6, RESTful API, and CAN-bus sensor connectivity",
    },
    content: {
      en: `<h3>Intelligent Power Management for Mission-Critical Data Center Enclosures</h3>
<p>In modern cloud facilities, enterprise server rooms, and edge computing nodes, raw power delivery is no longer sufficient. Operators require granular visibility into rack energy consumption, remote control capabilities to reboot locked servers, and automated alerts before circuit overloads cause unplanned outages. The Rittal Intelligent PDU portfolio provides scalable, high-reliability power distribution across five functional variants: Basic, Metered, Metered Plus, Switched, and Managed.</p>
<h3>Tool-Free Zero-U Mounting in Rittal VX IT and TX CableNet Racks</h3>
<p>Rack space is valuable. Rittal PDUs feature a slender extruded aluminum profile engineered specifically for tool-free, clip-in mounting into the zero-U space between the 19" rail and the side panel of Rittal enclosures. This leaves all 42U or 47U rack units completely free for servers, storage arrays, and network switches, while providing immediate, unhindered access to individual power cords.</p>
<h3>Patented IEC Lock Sockets & Billing-Grade Energy Measurement</h3>
<p>Accidental cord disconnection during routine maintenance is a primary cause of downtime. Rittal PDUs integrate a patented universal locking mechanism for standard IEC C13 and C19 plugs—locking cables securely without requiring proprietary cords. For colocation and internal chargebacks, Metered Plus and Managed models feature Class 1 (±1%) billing-grade revenue metering per outlet according to EN 62053-21, measuring voltage, current, active/apparent power, power factor, and harmonic distortion.</p>
<h3>Integrated Type B RCM and Advanced Environmental Sensor Integration</h3>
<p>To eliminate costly external earth leakage relays, Rittal PDUs integrate an AC/DC sensitive Residual Current Monitor (RCM Type B) that detects smooth DC leakage currents often generated by server power supplies. Furthermore, each PDU incorporates a dedicated CAN-bus port that directly connects up to eight CMC III plug-and-play sensors (temperature, humidity, water leak, and electronic door locks), transforming the PDU into a centralized rack management gateway.</p>`,
      id: `<h3>Manajemen Daya Cerdas untuk Kabinet Server & Pusat Data Misi Kritis</h3>
<p>Pada fasilitas cloud modern, ruang server enterprise, dan titik komputasi edge, penyaluran listrik biasa sudah tidak lagi mencukupi. Operator membutuhkan visibilitas mendalam atas konsumsi daya per rak, kemampuan kendali jarak jauh untuk me-reboot server yang hang, serta peringatan dini otomatis sebelum beban lebih memicu pemadaman tak terduga. Rittal Intelligent PDU menghadirkan distribusi daya andal dalam lima varian fungsional: Basic, Metered, Metered Plus, Switched, dan Managed.</p>
<h3>Pemasangan Zero-U Tanpa Perkakas pada Rak VX IT & TX CableNet</h3>
<p>Ruang rak server sangat berharga. Rittal PDU dirancang dengan profil aluminium ekstrusi ramping khusus untuk pemasangan klip snap-in tanpa perkakas di ruang 'Zero-U' (antara tiang rel 19" dan dinding samping kabinet). Hal ini membuat seluruh unit 42U atau 47U tetap bebas sepenuhnya untuk server, storage SAN, dan sakelar jaringan, sekaligus memudahkan akses penataan kabel daya tanpa menghalangi aliran udara dingin.</p>
<h3>Soket Pengunci Paten IEC Lock & Pengukuran Energi Berstandar Billing</h3>
<p>Kabel power yang terlepas secara tidak sengaja saat teknisi melakukan perawatan rutin adalah penyebab umum server down. Rittal PDU mengintegrasikan mekanisme pengunci universal berpaten untuk colokan standar IEC C13 dan C19—mengunci kabel daya secara mekanis tanpa memerlukan kabel khusus berharga mahal. Untuk fasilitas colocation dan penagihan biaya listrik per departemen, tipe Metered Plus dan Managed dilengkapi pengukuran energi akurasi tinggi Kelas 1 (±1%) sesuai standar EN 62053-21 (kWh, kW, tegangan, arus, power factor, dan THD).</p>
<h3>Proteksi Arus Sisa RCM Tipe B & Konektivitas Sensor Lingkungan</h3>
<p>Menghilangkan kebutuhan relay kebocoran arus eksternal yang memakan biaya, Rittal PDU mengintegrasikan Residual Current Monitoring (RCM Tipe B) sensitif AC/DC yang mampu mendeteksi arus bocor DC halus dari power supply switching server. Selain itu, setiap PDU dilengkapi port CAN-bus yang dapat langsung dihubungkan ke delapan sensor pintar CMC III (suhu, kelembaban, kebocoran air, dan kontrol kunci pintu elektronik), menjadikan PDU sebagai gateway pemantau fisik rak terpadu.</p>`,
    },
  },

  "rittal-distributor/lcp-liquid-cooling-packages": {
    id: "00000000-0000-0000-0000-000000000788",
    slug: "lcp-liquid-cooling-packages",
    fullPath: "rittal-distributor/lcp-liquid-cooling-packages",
    depth: 1,
    sortOrder: 21,
    imageUrl: "/uploads/products-rittal-lcp-cooling.jpg",
    title: {
      en: "Rittal Liquid Cooling Packages (LCP CW & DX High-Density IT Cooling)",
      id: "Unit Pendingin Cair Rittal Liquid Cooling Package (LCP CW & DX High-Density)",
    },
    summary: {
      en: "High-density rack- and row-based liquid cooling systems delivering up to 55 kW cooling output per server rack using chilled water (CW) or direct expansion (DX) with zero room heat footprint.",
      id: "Sistem pendingin cair berdensitas tinggi berbasis rak dan deret (row-based) berdaya hingga 55 kW per rak server menggunakan air dingin (CW) atau refrigeran (DX) tanpa jejak panas ke ruangan.",
    },
    specs: {
      "EN: Cooling Output\nID: Kapasitas Pendinginan": "From 12 kW up to 55 kW per rack (LCP Rack CW/DX, LCP Inline CW/DX, and LCP Rear Door CW)",
      "EN: Cooling Media & Technology\nID: Media Pendingin & Teknologi": "Chilled water (CW) closed circuit or direct expansion refrigerant (DX) with inverter-driven scroll compressor",
      "EN: Airflow Configuration\nID: Konfigurasi Aliran Udara": "Closed-loop rack cooling (LCP Rack) or open hot/cold aisle containment row cooling (LCP Inline)",
      "EN: Fan Architecture\nID: Arsitektur Kipas": "Redundant EC fans with N+1 hot-swappable replacement during live IT operations",
      "EN: Temperature Regulation\nID: Regulasi Suhu": "Continuous server intake temperature monitoring with stepless 0-10 V EC fan & motorized water valve control",
      "EN: Monitoring & Safety\nID: Pemantauan & Keamanan": "Integrated optical/conductive water leak detection, condensate drip tray with float switch, SNMP/Modbus/BACnet",
    },
    content: {
      en: `<h3>High-Density Liquid Cooling for AI, HPC, and Mission-Critical Server Racks</h3>
<p>High-density compute clusters, GPU accelerated artificial intelligence servers, and blade enclosures generate thermal dissipation exceeding 20 kW to 55 kW per rack—well beyond the physical cooling limits of traditional raised-floor perimeter CRAC units. The Rittal Liquid Cooling Package (LCP) family provides targeted, localized thermal management directly at the server level, capturing 100% of heat dissipation before it enters the data center room.</p>
<h3>LCP Rack vs. LCP Inline: Tailored for Every Data Center Architecture</h3>
<p>Rittal offers two distinct architectural configurations:
<b>LCP Rack:</b> Creates a completely sealed, airtight closed-loop cooling circuit with one or two bayed VX IT server racks. Hot exhaust air from servers is drawn directly into the heat exchanger, cooled, and blown back across the front of the servers at the exact setpoint temperature, achieving IP55 enclosure protection and zero room noise.
<b>LCP Inline:</b> Installed directly within a row of bayed server cabinets, expelling cooled air into a contained cold aisle and drawing hot air from a contained hot aisle, maximizing energy efficiency for open-row data center suites.</p>
<h3>Chilled Water (CW) and Direct Expansion (DX) Options</h3>
<p>For large enterprise facilities with central chilled water plants, LCP CW utilizes water/air heat exchangers controlled by motorized proportional 2-way regulating valves, achieving exceptional PUE (Power Usage Effectiveness) ratings under 1.15. For edge data centers or distributed installations without chilled water loops, LCP DX integrates an inverter-controlled variable-speed brushless compressor with an external air-cooled condenser, dynamically modulating cooling capacity from 20% to 100% to match instantaneous IT server loads.</p>
<h3>Hot-Swappable Redundant EC Fans and Multi-Layer Leak Protection</h3>
<p>Continuous uptime is guaranteed through an array of redundant, high-efficiency EC (Electronically Commutated) axial fans in an N+1 configuration. In the rare event of a fan issue, individual fan modules can be replaced hot-swappable in seconds without tools while the IT servers remain fully operational. Multiple leak-detection sensors along the condensate tray and piping connect directly to the automated shutoff valve and alert the facility BMS via SNMP, Modbus, or BACnet.</p>`,
      id: `<h3>Pendinginan Cair Berdensitas Tinggi untuk AI, HPC & Rak Server Kritis</h3>
<p>Kluster komputasi densitas tinggi, server Artificial Intelligence (AI) bertenaga GPU, serta blade server modern menghasilkan panas termal ekstrem melebihi 20 kW hingga 55 kW per rak—jauh melampaui kemampuan fisik AC presisi perimeter (CRAC) konvensional dengan lantai raised floor. Rittal Liquid Cooling Package (LCP) menghadirkan solusi pendinginan terarah langsung di samping rak server, menangkap 100% beban panas sebelum sempat menyebar ke udara ruangan pusat data.</p>
<h3>Pilihan LCP Rack vs. LCP Inline: Fleksibel untuk Segala Arsitektur Data Center</h3>
<p>Rittal menghadirkan dua konfigurasi arsitektur pendinginan utama:
<b>LCP Rack:</b> Membentuk sirkulasi tertutup (closed-loop) kedap udara dengan satu atau dua rak server VX IT di sebelahnya. Udara panas buangan server ditarik langsung ke penukar panas LCP, didinginkan, lalu dihembuskan kembali ke bagian depan server pada suhu presisi, menghasilkan proteksi kabinet IP55 tanpa kebocoran suara bising ke ruangan.
<b>LCP Inline:</b> Dipasang sejajar dalam deretan rak server (row-based), mengalirkan udara dingin ke dalam lorong dingin tertutup (cold aisle containment) dan menghisap udara dari lorong panas (hot aisle), memaksimalkan efisiensi energi PUE untuk ruang data center modern.</p>
<h3>Varian Air Dingin (CW) & Refrigeran Ekspansi Langsung (DX)</h3>
<p>Untuk fasilitas pusat data besar yang memiliki jaringan pipa chiller air dingin, tipe LCP CW menggunakan penukar panas air/udara berefisiensi tinggi dengan katup proporsional bermotor, menghasilkan rasio efisiensi PUE (Power Usage Effectiveness) istimewa di bawah 1,15. Untuk fasilitas edge data center atau pabrik yang tidak memiliki instalasi chiller air, LCP DX mengintegrasikan kompresor inverter berkecepatan dinamis yang terkoneksi ke kondensor luar ruangan, secara otomatis memodulasi daya pendingin dari 20% hingga 100% mengikuti beban kerja komputasi server seketika.</p>
<h3>Kipas EC Redundan Hot-Swappable & Proteksi Kebocoran Berlapis</h3>
<p>Keandalan non-stop dijamin oleh susunan kipas motor EC (Electronically Commutated) berkonfigurasi redundan N+1. Apabila terjadi kendala pada salah satu modul kipas, teknisi dapat menggantinya secara langsung (hot-swappable) dalam hitungan detik tanpa alat dan tanpa mematikan server IT. Sensor kebocoran air optik dan konduktif di sepanjang bak kondensat terhubung ke katup pemutus darurat otomatis dan mengirimkan notifikasi instan ke sistem BMS gedung melalui protokol SNMP, Modbus, atau BACnet.</p>`,
    },
  },

  "rittal-distributor/led-system-lights": {
    id: "00000000-0000-0000-0000-000000000789",
    slug: "led-system-lights",
    fullPath: "rittal-distributor/led-system-lights",
    depth: 1,
    sortOrder: 22,
    imageUrl: "/uploads/products-rittal-led-system-lights.jpg",
    title: {
      en: "Rittal LED System Lights (SZ 2500 Enclosure Illumination)",
      id: "Lampu Panel LED Rittal System Light (Penerangan Kabinet Seri SZ 2500)",
    },
    summary: {
      en: "Innovative enclosure LED system lights engineered with optical Fresnel lenses for targeted cabinet illumination (400 to 1200 lm), universal rotating connectors, motion sensors, and magnetic mounting.",
      id: "Lampu LED sistem enclosure inovatif dengan lensa optik Fresnel untuk penerangan panel terarah (400 hingga 1200 lm), konektor putar universal, sensor gerak terintegrasi, dan opsi pemasangan magnetik.",
    },
    specs: {
      "EN: Luminous Flux\nID: Fluks Cahaya": "400 lm, 600 lm, 900 lm, up to 1,200 lm (high-efficacy daylight white 4000 K)",
      "EN: Optical Light Distribution\nID: Distribusi Cahaya Optik": "Fresnel optical lens directing 100% of light onto the mounting plate and bottom enclosure area",
      "EN: Operating Voltage\nID: Tegangan Operasi": "Wide-range 100 V – 240 V AC (50/60 Hz) or extra-low voltage 24 V DC",
      "EN: Switching & Automation\nID: Metode Pengaktifan & Otomasi": "Integrated 90° PIR motion detector, door-operated switch, or continuous on/off push button",
      "EN: Mounting Flexibility\nID: Fleksibilitas Pemasangan": "Direct clip-in onto 25 mm system pitch, magnetic clamp attachment, or screw-fastened onto frame",
      "EN: Wiring & Daisy-Chaining\nID: Pengkabelan & Seri": "90° rotatable plug-in connection; supports through-wiring of up to 15 lights in a bayed suite",
    },
    content: {
      en: `<h3>Targeted Enclosure Illumination with Innovative Fresnel Optical Lenses</h3>
<p>Standard fluorescent tubes and generic strip lights disperse diffuse light outward into the operator's eyes while leaving the depths of the electrical enclosure—especially lower terminal blocks and cable gland plates—in deep shadow. The Rittal LED System Light SZ 2500 series resolves this through advanced optical engineering: an integrated Fresnel lens focuses and redirects the luminous flux downward and deep into the cabinet interior, illuminating all component rows and wiring ducts uniformly without dazzling the maintenance technician.</p>
<h3>Rapid Tool-Free Clip-In and Magnetic Mounting</h3>
<p>Installing enclosure lighting has never been faster. Rittal LED system lights can be snapped directly into the 25 mm hole pattern of the VX25 frame profile or AX mounting rails with a simple tool-free clip. For retrofits or field servicing, optional heavy-duty magnetic mounting kits allow the luminaire to be affixed securely to any bare steel or powder-coated surface instantly and repositioned whenever needed.</p>
<h3>Integrated Motion Detector and Door Position Switches</h3>
<p>Energy efficiency and operator convenience are paramount. Available with an integrated passive infrared (PIR) motion detector boasting a 90° detection cone, the light automatically switches on as soon as an engineer approaches or opens the door, and switches off after an adjustable dwell time. Alternatively, plug-and-play connection cables connect directly to Rittal door-operated position switches (SZ 4315), ensuring lighting activates strictly when the cabinet door swings open.</p>
<h3>Rotatable Connectors and Effortless Daisy-Chaining</h3>
<p>Equipped with a 90° rotatable power inlet connector, cables can be routed discreetly along the enclosure frame in any direction. When baying multiple enclosures together, Rittal through-wiring cables allow up to 15 LED lights to be daisy-chained from a single main infeed power source, drastically cutting installation time and material costs.</p>`,
      id: `<h3>Penerangan Presisi Panel Listrik dengan Lensa Optik Fresnel Canggih</h3>
<p>Lampu tabung neon konvensional atau strip LED biasa menyebarkan cahaya baur yang menyilaukan mata teknisi, sementara area dalam kabinet—terutama blok terminal bawah dan kelenjar kabel—tetap berada dalam kegelapan. Lampu Rittal LED System Light seri SZ 2500 memecahkan kendala ini melalui rekayasa optik modern: lensa Fresnel terintegrasi memfokuskan dan membiaskan seluruh berkas cahaya ke arah bawah dan sudut terdalam enclosure, menerangi seluruh baris komponen DIN-rail dan ducting kabel secara merata tanpa efek silau.</p>
<h3>Pemasangan Snap-In Cepat Tanpa Alat & Opsi Klem Magnetik</h3>
<p>Pemasangan lampu kabinet kini tidak memerlukan bor atau perkakas tangan. Rittal LED System Light dapat langsung dikunci (snap-in) pada pola lubang 25 mm rangka VX25 maupun rel AX. Untuk kebutuhan retrofit atau inspeksi darurat di lapangan, kit braket magnetik berkekuatan tinggi memungkinkan lampu ditempelkan secara instan di mana pun pada pelat baja panel dan dipindahkan posisinya dengan sangat fleksibel.</p>
<h3>Sensor Gerak Inframerah (PIR) & Sakelar Pintu Otomatis</h3>
<p>Efisiensi energi dan kenyamanan kerja teknisi menjadi prioritas utama. Dilengkapi opsi sensor gerak Passive Infrared (PIR) bersudut deteksi 90°, lampu akan otomatis menyala begitu teknisi mendekat atau membuka kabinet, dan padam secara otomatis setelah durasi waktu yang dapat disesuaikan. Tersedia pula kabel plug-and-play untuk koneksi langsung ke sakelar saklar pintu (door-operated switch SZ 4315), memastikan lampu hanya menyala saat pintu kabinet dibuka.</p>
<h3>Konektor Putar 90° & Pengkabelan Seri Daisy-Chain Cepat</h3>
<p>Dilengkapi konektor input daya yang dapat diputar 90°, jalur kabel dapat ditata rapi mengikuti profil rangka kabinet dari arah mana pun. Pada rangkaian kubikal gabungan (bayed enclosure suite), kabel koneksi tembus Rittal memungkinkan hingga 15 unit lampu LED dihubungkan secara seri (daisy-chain) hanya dari satu sumber listrik utama, memangkas waktu instalasi kabel hingga 60%.</p>`,
    },
  },

  "rittal-distributor/base-plinth-system-vx": {
    id: "00000000-0000-0000-0000-000000000790",
    slug: "base-plinth-system-vx",
    fullPath: "rittal-distributor/base-plinth-system-vx",
    depth: 1,
    sortOrder: 23,
    imageUrl: "/uploads/products-rittal-base-plinth-system.jpg",
    title: {
      en: "Rittal Base/Plinth System VX (Modular Enclosure Foundation)",
      id: "Sistem Plinth / Pondasi Modular Rittal Base/Plinth System VX",
    },
    summary: {
      en: "Heavy-duty modular base/plinth system for VX25, VX SE, and TS enclosures providing enhanced mechanical stability, tool-free snap-in trim panels, and integrated cable routing space.",
      id: "Sistem pondasi plinth modular beban berat untuk panel VX25, VX SE, dan TS yang memberikan stabilitas mekanis tinggi, panel penutup snap-in tanpa baut, dan ruang tata kabel terintegrasi.",
    },
    specs: {
      "EN: Material & Finish\nID: Material & Lapisan Akhir": "Sheet steel RAL 7022 (umbra grey) or high-grade stainless steel 1.4301 (AISI 304) with brushed finish",
      "EN: System Heights\nID: Ketinggian Sistem": "100 mm and 200 mm modular heights (stackable for custom elevation up to 400 mm)",
      "EN: Corner Piece Architecture\nID: Arsitektur Sudut Plinth": "Heavy-duty cast corner pieces capable of supporting full cabinet load during forklift transport",
      "EN: Trim Panel Variants\nID: Varian Panel Penutup": "Solid sheet steel, vented trim panels with filter mats, and panels with brush strips for cable entry",
      "EN: Cable Management Integration\nID: Integrasi Tata Kabel": "C-rails and cable clamp rails mount directly inside the base without requiring drilling",
      "EN: Baying & Seismic Security\nID: Penggabungan & Ketahanan Gempa": "Integrated baying brackets for multi-bay suites; tested for seismic zones 1 to 4 to Telcordia GR-63-CORE",
    },
    content: {
      en: `<h3>The Modular Foundation for Modern Industrial and Power Distribution Switchgear</h3>
<p>A reliable electrical switchboard starts from the ground up. The Rittal Base/Plinth System VX combines all functions of an enclosure base into a highly modular, heavy-duty foundation. Engineered specifically for VX25 baying enclosures, VX SE standalone cabinets, and AX compact panels, the system elevates the enclosure above floor contaminants, creates valuable routing space for incoming field cables, and reinforces mechanical rigidity during transport and seismic events.</p>
<h3>Forklift Transport Without Wooden Pallets</h3>
<p>Switchgear manufacturing logistics require moving heavy panels safely. The rugged corner pieces of the VX base/plinth are engineered to handle the full static and dynamic weight of fully equipped enclosures (up to 15,000 N). Forklift trucks can lift and maneuver the entire cabinet suite directly under the corner pieces, eliminating the need for wooden shipping pallets and simplifying shop-floor transport.</p>
<h3>Tool-Free Snap-In Trim Panels with Integrated Brush Strips</h3>
<p>Closing the base plinth no longer requires tedious screw fastening. Trim panels snap firmly into place between the corner pieces using patented locking latches and can be detached in seconds for cable pulling or maintenance access. For automated data center and switchboard rooms, trim panels with integrated brush strips or ventilation louvres provide seamless bottom cable ingress while preventing vermin and large debris from entering.</p>
<h3>Internal Cable Clamping and Baying Symmetry</h3>
<p>The interior of the Base/Plinth System VX features standardized 25 mm system punchings identical to the main VX25 enclosure frame. Standard punched sections, C-profile cable clamp rails, and EMC grounding brackets mount directly inside the plinth space. When baying multiple enclosures together, internal plinth baying brackets bridge the suites securely without creating external gaps or tripping hazards.</p>`,
      id: `<h3>Pondasi Modular Kokoh untuk Switchgear Industri & Distribusi Daya</h3>
<p>Keandalan panel listrik bermula dari pondasi bawah yang kokoh. Rittal Base/Plinth System VX mengintegrasikan seluruh fungsi dudukan kabinet ke dalam sistem pondasi modular beban berat. Dirancang khusus untuk kubikal gandeng VX25, kabinet monobloc VX SE, serta panel kompak AX, sistem ini meninggikan panel dari kelembaban dan kotoran lantai, menyediakan ruang leluasa untuk terminasi kabel masukan, serta memperkuat kekakuan mekanis saat transportasi dan gempa bumi.</p>
<h3>Transportasi Forklift Langsung Tanpa Palet Kayu</h3>
<p>Mobilisasi kubikal panel switchgear berbobot ribuan kilogram menuntut keselamatan tingkat tinggi. Bagian sudut (corner piece) Base/Plinth VX dirancang sangat kokoh dari baja cetak presisi yang mampu menopang beban statis maupun dinamis penuh kabinet (hingga 15.000 N). Garpu forklift dapat langsung masuk mengangkat kabinet dari kolong plinth secara seimbang, mengeliminasi ketergantungan pada palet kayu dan mempermudah penataan di lantai pabrik.</p>
<h3>Panel Penutup Snap-In Tanpa Baut dengan Opsi Strip Sikat Kabel</h3>
<p>Menutup bagian bawah panel tidak lagi memerlukan proses pengencangan baut yang memakan waktu. Lembaran trim panel samping dan depan-belakang terkunci rapat ke sudut plinth menggunakan kait pegas berpaten (snap-in) dan dapat dibuka kembali dalam hitungan detik saat penarikan kabel. Untuk ruangan IT dan kontrol, tersedia varian panel berpori ventilasi serta panel dengan strip sikat debu (brush strip) untuk jalur masuk kabel fleksibel tanpa merusak jaket isolasi.</p>
<h3>Klem Kabel Internal & Penggabungan Multi-Kubikal Simetris</h3>
<p>Bagian dalam Base/Plinth VX mewarisi pola lubang modular 25 mm yang identik dengan rangka utama VX25. Rel klem kabel profil C, klem penahan tarikan kabel (strain relief), dan plat grounding EMC dapat dipasang langsung di dalam ruang kolong plinth. Saat menggabungkan beberapa kubikal (baying), braket penyambung internal mengunci seluruh rangkaian pondasi secara presisi tanpa celah eksternal yang membahayakan operasional.</p>`,
    },
  },

  "rittal-distributor/cable-entry-systems-gland-plates": {
    id: "00000000-0000-0000-0000-000000000791",
    slug: "cable-entry-systems-gland-plates",
    fullPath: "rittal-distributor/cable-entry-systems-gland-plates",
    depth: 1,
    sortOrder: 24,
    imageUrl: "/uploads/products-rittal-cable-entry-plates.jpg",
    title: {
      en: "Rittal Modular Cable Entry Systems & Gland Plates (IP66 Ingress Protection)",
      id: "Sistem Masukan Kabel Modular & Pelat Gland Rittal (Proteksi IP66)",
    },
    summary: {
      en: "Modular cable entry plates and split gland systems providing high-density cable insertion with pre-assembled connectors, mechanical strain relief, and IP66 / NEMA 4X hermetic sealing.",
      id: "Pelat masukan kabel modular dan sistem gland split untuk pemasangan kabel berdensitas tinggi dengan konektor terpasang, peredam tarikan mekanis, dan penyegelan rapat berstandar IP66 / NEMA 4X.",
    },
    specs: {
      "EN: Ingress Protection\nID: Kategori Proteksi Ingress": "Up to IP66 / IP68 and NEMA 4X / NEMA 12 compliant to IEC 60529",
      "EN: Cable Insertion Concept\nID: Konsep Pemasangan Kabel": "Split modular frame system allowing pre-terminated cables (with RJ45, USB, industrial multi-pole plugs) without voiding warranty",
      "EN: Sealing Grommet Range\nID: Rentang Grommet Penyegel": "Elastomer slit sealing inserts for cable diameters from Ø 2 mm to Ø 35 mm (single and multi-hole)",
      "EN: Strain Relief\nID: Peredam Tarikan Mekanis (Strain Relief)": "Integrated mechanical cable clamping to DIN EN 62444 with vibration-proof grip",
      "EN: Material & Temperature\nID: Material & Suhu Operasi": "Halogen-free polyamide (PA6) and stainless steel gland plates rated from -40°C to +100°C (UL 94-V0)",
      "EN: Compatibility\nID: Kompatibilitas Panel": "Direct fit into standard cutouts for 16-pin / 24-pin industrial connectors, AX gland plates, and VX base openings",
    },
    content: {
      en: `<h3>High-Density Cable Entry for Pre-Assembled Cables and Harsh Industrial Environments</h3>
<p>Modern automated machinery relies heavily on prefabricated cables equipped with molded industrial connectors, Ethernet RJ45 plugs, optical LC connectors, and D-Sub interfaces. Traditional cable glands force technicians to cut off connectors, feed bare wires through, and re-solder pins in the field—a practice that is slow, error-prone, and voids manufacturer warranties. Rittal modular cable entry systems eliminate this issue completely by utilizing split frame architecture and flexible elastomer sealing grommets.</p>
<h3>Split Gland Frames: Insert Pre-Terminated Cables in Seconds</h3>
<p>Rittal split cable entry plates allow pre-assembled cables with large terminal plugs to be passed through standardized enclosure cutouts without detaching the connectors. Flexible, slotted elastomeric grommets are snapped over the cables and slotted firmly into the matching grooves of the split frame. Once bolted together, the frame compresses the grommets uniformly, achieving an airtight, watertight IP66 / NEMA 4X seal.</p>
<h3>Extreme Space Efficiency and Integrated Strain Relief</h3>
<p>Where conventional cable glands require wide spacing that consumes an entire enclosure wall, Rittal high-density cable entry plates pack up to 32 cables into a compact opening standardly sized for 24-pin multi-pole connectors. Built-in contoured cable holding ribs provide mechanical strain relief conforming to DIN EN 62444, preventing external pulling or vibration forces from dislodging internal electrical terminals.</p>
<h3>Modular Flange Plates for AX, KX, and VX Enclosure Openings</h3>
<p>Rittal offers specialized gland plate options for every cabinet tier: two-part gland plates with elastic foam clamp strips for AX compact panels, modular plastic gland plates with knockout membranes for tool-free piercing, and heavy-gauge stainless steel plates for hygienic food processing washdowns. All modules maintain enclosure electromagnetic compatibility (EMC) when paired with Rittal grounding braid kits.</p>`,
      id: `<h3>Pemasangan Kabel Densitas Tinggi untuk Kabel Jadi & Lingkungan Industri Ekstrem</h3>
<p>Mesin otomasi modern banyak memanfaatkan kabel jadi (pre-assembled cables) yang telah terpasang konektor industri cetakan pabrik, seperti colokan Ethernet RJ45, konektor optik LC, dan konektor multipole D-Sub. Cable gland konvensional memaksa teknisi memotong kepala konektor, memasukkan kawat telanjang, lalu menyolder ulang pin di lapangan—metode yang memakan waktu, rawan salah pin, dan membatalkan garansi pabrikan kabel. Sistem masukan kabel modular Rittal mengeliminasi masalah ini sepenuhnya melalui arsitektur rangka belah (split frame) dan grommet penyegel elastomer elastis.</p>
<h3>Rangka Belah (Split Frame): Lewatkan Kabel Berkonektor Tanpa Memotong</h3>
<p>Pelat masukan kabel Rittal memungkinkan kabel yang sudah terpasang konektor besar dilewatkan menembus dinding panel tanpa perlu mencopot soket konektornya. Grommet karet elastomer berbelah dipasangkan memeluk kabel, lalu diselipkan ke dalam alur rangka split. Saat kedua sisi rangka dibaut rapat, tekanan merata mengunci grommet secara presisi, menghasilkan proteksi kedap air dan kedap debu berstandar IP66 / NEMA 4X.</p>
<h3>Efisiensi Ruang Maksimal & Peredam Tarikan Mekanis (Strain Relief)</h3>
<p>Bila cable gland konvensional membutuhkan jarak antar lubang yang boros ruang di pelat panel, sistem masukan kabel densitas tinggi Rittal mampu memuat hingga 32 kabel dalam satu lubang cutout seukuran konektor industri 24-pin. Profil rusuk penjepit internal memberikan peredam tarikan mekanis (strain relief) sesuai standar DIN EN 62444, melindungi kawat dari getaran mesin maupun tarikan tak disengaja di lapangan.</p>
<h3>Pelat Flange Modular untuk Panel AX, KX, dan Rangka VX25</h3>
<p>Rittal menyediakan ragam pelat gland untuk setiap tipe panel: pelat gland dua bagian dengan busa penjepit elastis untuk panel kompak AX, pelat plastik membran tembus tanpa perkakas, serta pelat stainless steel higienis untuk pabrik pengolahan makanan tahan semprotan air kimia. Seluruh sistem tetap menjaga kompatibilitas elektromagnetik (EMC) panel saat dipadukan dengan kit anyaman grounding Rittal.</p>`,
    },
  },



  "schneider-integrator/industrial-automation": {
    id: "00000000-0000-0000-0000-000000000719",
    slug: "industrial-automation",
    fullPath: "schneider-integrator/industrial-automation",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/products-schneider-automation.jpg",
    title: {
      en: "Schneider Industrial Automation (Modicon & EcoStruxure)",
      id: "Otomasi Industri Schneider (Modicon & EcoStruxure)",
    },
    summary: {
      en: "Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.",
      id: "Sistem otomasi PLC/PAC lengkap beranggotakan Schneider Modicon M340, M580 ePAC, Magelis HMI, dan arsitektur EcoStruxure Plant.",
    },
    specs: {
      "EN: PLC Families\nID: Lini PLC": "Modicon M580 ePAC, Modicon M340, Modicon M241/M251",
      "EN: High Availability\nID: Ketersediaan Tinggi": "EN: Hot-standby redundant CPU architectures (M580)\nID: Arsitektur CPU redundan Hot-Standby (M580)",
      "EN: Cybersecurity\nID: Keamanan Siber": "Achilles Level 2 & ISA/IEC 62443 certified embedded security",
      "EN: Software\nID: Perangkat Lunak": "EcoStruxure Control Expert (formerly Unity Pro)",
      "EN: Communication\nID: Komunikasi": "Ethernet/IP, Modbus TCP, Profinet, CANopen, OPC-UA",
      "EN: Architecture\nID: Arsitektur": "Schneider EcoStruxure Plant & Machine Expert",
    },
    content: {
      en: `<h3>Schneider Industrial Automation & Control</h3>
<p>As a certified Schneider Electric System Integrator, PT Multi Daya Mitra engineers comprehensive automation architectures powered by Modicon PLC/PAC controllers and the EcoStruxure™ platform. From machine automation to plant-wide distributed control systems (DCS), we deliver maximum reliability, process visibility, and cybersecure operation.</p>
<h3>Modicon M580 ePAC & Hot-Standby High Availability</h3>
<p>Featuring native Ethernet embedded directly into the backplane, Modicon M580 delivers unmatched processing speed and transparency. We configure redundant Hot-Standby CPU configurations to prevent unscheduled plant shutdowns in mission-critical applications.</p>
<h3>EcoStruxure Control Expert & Machine Safety</h3>
<p>We leverage EcoStruxure Control Expert for unified engineering across logic, motion, safety, and communication networks, complying with SIL 3 / PLe machinery safety requirements.</p>`,
      id: `<h3>Otomasi Industri & Sistem Kontrol Schneider</h3>
<p>Sebagai System Integrator Schneider Electric tersertifikasi, PT Multi Daya Mitra merancang arsitektur otomasi komprehensif yang ditenagai oleh pengendali PLC/PAC Modicon dan platform EcoStruxure™. Mulai dari otomasi mesin tunggal hingga sistem kontrol terdistribusi (DCS) seluruh pabrik, kami memberikan keandalan maksimal, visibilitas proses, dan operasional dengan keamanan siber tinggi.</p>
<h3>Modicon M580 ePAC & Redundansi Hot-Standby</h3>
<p>Dengan Ethernet bawaan langsung pada backplane, Modicon M580 menghadirkan kecepatan pemrosesan dan transparansi data tanpa tanding. Kami mengonfigurasi sistem Hot-Standby CPU ganda (redundant) untuk mencegah terhentinya operasional pabrik pada aplikasi yang sangat penting.</p>
<h3>EcoStruxure Control Expert & Keselamatan Mesin</h3>
<p>Kami memanfaatkan EcoStruxure Control Expert untuk standardisasi rekayasa terpadu mencakup logika proses, motion, safety, dan jaringan komunikasi, yang memenuhi standar keselamatan mesin SIL 3 / PLe.</p>`,
    },
  },

  "schneider-integrator/power-energy-monitoring": {
    id: "00000000-0000-0000-0000-000000000720",
    slug: "power-energy-monitoring",
    fullPath: "schneider-integrator/power-energy-monitoring",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/products-schneider-pme.jpg",
    title: {
      en: "Power & Energy Monitoring (PME & PowerLogic)",
      id: "Pemantauan Daya & Energi (PME & PowerLogic)",
    },
    summary: {
      en: "Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.",
      id: "Power meter digital Schneider PowerLogic, ION meter, dan perangkat lunak EcoStruxure Power Monitoring Expert (PME).",
    },
    specs: {
      "EN: Platform\nID: Platform Perangkat Lunak": "EcoStruxure Power Monitoring Expert (PME) / Power Operation (PO)",
      "EN: Power Meters\nID: Meteran Listrik Digital": "PowerLogic PM8000, PM5000 series, ION9000, ION7400",
      "EN: Compliance\nID: Kepatuhan Standar": "IEC 61000-4-30 Class A precision power quality compliance",
      "EN: Analytics\nID: Analitik & Pemantauan": "EN: Harmonic analysis, voltage sag/swell capture, EN 50160 compliance\nID: Analisis harmonisa, tangkapan sag/swell tegangan, kepatuhan EN 50160",
      "EN: Reporting\nID: Laporan Otomatis": "EN: Automated energy billing, cost allocation, carbon footprint tracking\nID: Penagihan energi otomatis, alokasi biaya, pelacakan jejak karbon ESG",
    },
    content: {
      en: `<h3>EcoStruxure Power Monitoring Expert (PME)</h3>
<p>PT Multi Daya Mitra implements Schneider Electric EcoStruxure Power Monitoring Expert (PME), a purpose-built energy management system designed to help energy-intensive facilities maximize uptime and optimize operational efficiency. PME collects, analyzes, and visualizes power network data across your entire facility.</p>
<h3>PowerLogic & ION High-Precision Metering</h3>
<p>We deploy PowerLogic PM8000, PM5000 series, and ION9000 revenue-grade meters with Class 0.1S accuracy and IEC 61000-4-30 Class A compliance. Capture microsecond voltage sags, swells, transients, and harmonic pollution before they trigger equipment failures.</p>
<h3>Automated ESG Sustainability & Energy Cost Allocation</h3>
<p>Transform raw electrical consumption data into automated carbon emission (Scope 2) reports, sub-billing invoices, and energy efficiency benchmarking aligned with ISO 50001 standards.</p>`,
      id: `<h3>EcoStruxure Power Monitoring Expert (PME)</h3>
<p>PT Multi Daya Mitra mengimplementasikan Schneider Electric EcoStruxure Power Monitoring Expert (PME), sistem manajemen energi khusus yang dirancang untuk membantu fasilitas industri padat energi memaksimalkan waktu operasional dan efisiensi konsumsi daya. PME mengumpulkan, menganalisis, dan memvisualisasikan data jaringan listrik di seluruh fasilitas Anda.</p>
<h3>Meteran Presisi Tinggi PowerLogic & ION</h3>
<p>Kami memasang power meter PowerLogic seri PM8000, PM5000, dan ION9000 dengan akurasi kelas revenue 0.1S dan sertifikasi IEC 61000-4-30 Kelas A. Menangkap fluktuasi tegangan mikrodetik (sag/swell), transien, serta polusi harmonisa sebelum memicu trip atau kerusakan peralatan.</p>
<h3>Laporan Keberlanjutan ESG & Alokasi Biaya Energi Otomatis</h3>
<p>Mengubah data konsumsi listrik mentah menjadi laporan emisi karbon otomatis (Scope 2), penagihan sub-biaya departemen, dan tolok ukur efisiensi energi yang selaras dengan standar ISO 50001.</p>`,
    },
  },

  "schneider-integrator/electrical-distribution-integration": {
    id: "00000000-0000-0000-0000-000000000713",
    slug: "electrical-distribution-integration",
    fullPath: "schneider-integrator/electrical-distribution-integration",
    depth: 1,
    sortOrder: 3,
    imageUrl: "/uploads/products-schneider-distribution.jpg",
    title: {
      en: "Electrical Distribution Integration (MasterPact & Prisma)",
      id: "Integrasi Distribusi Elektrikal (MasterPact & Prisma)",
    },
    summary: {
      en: "MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.",
      id: "Circuit breaker udara MasterPact MTZ/NW, pemutus sirkuit cetak Compact NSX, dan integrasi switchboard type-tested Prisma.",
    },
    specs: {
      "EN: Circuit Breakers\nID: Pemutus Sirkuit": "MasterPact MTZ (up to 6300A), Compact NSX/NSXm (16-630A)",
      "EN: Trip Units\nID: Unit Trip Kontrol": "MicroLogic X with integrated Class 1 active energy measurement",
      "EN: Enclosure System\nID: Sistem Enclosure": "Schneider PrismaSeT G & P type-tested modular switchboards",
      "EN: Connectivity\nID: Konektivitas": "Embedded Bluetooth, NFC, Ethernet Modbus TCP communications",
      "EN: Standards\nID: Standar": "IEC 60947-2, IEC 61439-1/-2, UL 489",
    },
    content: {
      en: `<h3>Integrated Low Voltage Power Distribution</h3>
<p>PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity.</p>
<h3>MasterPact MTZ with MicroLogic X Control Units</h3>
<p>Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers.</p>
<h3>Prisma Type-Tested Switchboard Architecture</h3>
<p>IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion.</p>`,
      id: `<h3>Integrasi Distribusi Daya Tegangan Rendah</h3>
<p>PT Multi Daya Mitra mengintegrasikan pemutus sirkuit udara (ACB) Schneider Electric MasterPact MTZ dan pemutus sirkuit cetak (MCCB) Compact NSX ke dalam sistem switchboard modular Prisma, menghadirkan distribusi tenaga listrik mutakhir dengan konektivitas digital terpadu.</p>
<h3>MasterPact MTZ dengan Unit Kontrol MicroLogic X</h3>
<p>Dilengkapi pengukuran daya & energi Kelas 1 terintegrasi, diagnostik nirkabel ponsel pintar seketika melalui Bluetooth/NFC, dan komunikasi dual-Ethernet untuk koneksi langsung ke sistem SCADA/PME tanpa memerlukan transduser eksternal.</p>
<h3>Arsitektur Switchboard Teruji Tipe Prisma</h3>
<p>Arsitektur modular tersertifikasi IEC 61439 yang menjamin keselamatan maksimal terhadap bahaya percikan busur api (arc fault), pelepasan panas termal teroptimasi, dan kemudahan ekspansi kapasitas di masa depan.</p>`,
    },
  },

  "schneider-integrator/engineering-commissioning": {
    id: "00000000-0000-0000-0000-000000000714",
    slug: "engineering-commissioning",
    fullPath: "schneider-integrator/engineering-commissioning",
    depth: 1,
    sortOrder: 4,
    imageUrl: "/uploads/products-schneider-commissioning.jpg",
    title: {
      en: "Schneider Engineering, FAT/SAT & Commissioning Support",
      id: "Rekayasa Schneider, Dukungan FAT/SAT & Komisioning",
    },
    summary: {
      en: "Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.",
      id: "Factory acceptance testing (FAT), site acceptance testing (SAT), koordinasi proteksi relay, dan komisioning bertegangan.",
    },
    specs: {
      "EN: Certification\nID: Sertifikasi": "EN: Certified Schneider System Integrator & ESDM Level 6 accredited\nID: System Integrator Schneider Tersertifikasi & Terakreditasi ESDM Level 6",
      "EN: Testing Fleet\nID: Armada Alat Uji": "Omicron CMC 356, Megger S1-568, Fluke 1777, FLIR E76",
      "EN: Scope\nID: Cakupan Layanan": "EN: FAT & SAT verification, relay parameterization, breaker trip testing\nID: Verifikasi FAT & SAT, parameterisasi relay, pengujian trip breaker",
      "EN: Standards\nID: Standar": "IEEE 1584 Arc Flash, IEC 60255 Protection Relays, NETA Acceptance",
    },
    content: {
      en: `<h3>Comprehensive Engineering & On-Site Commissioning</h3>
<p>Our certified engineering team provides comprehensive engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), protection relay parameterization, and energized commissioning support for Schneider Electric automation and power distribution systems.</p>
<h3>Protection Relay Parameterization & Primary Injection</h3>
<p>Configuration and testing of Schneider Sepam, Easergy P3, and Easergy P5 protection relays using calibrated Omicron secondary injection test sets to guarantee discrimination and fast arc clearing times.</p>
<h3>Energization & SAT Site Handover</h3>
<p>Rigorous pre-commissioning checks, insulation resistance, contact resistance (Ductor), functional interlock verification, and full handover documentation with client operations training.</p>`,
      id: `<h3>Rekayasa Teknik Menyeluruh & Komisioning Lapangan</h3>
<p>Tim insinyur tersertifikasi kami menyediakan layanan rekayasa teknik komprehensif, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), parameterisasi relai proteksi, dan dukungan komisioning bertegangan untuk sistem otomasi serta distribusi daya Schneider Electric.</p>
<h3>Parameterisasi Relai Proteksi & Injeksi Sekunder/Primer</h3>
<p>Konfigurasi dan pengujian relai proteksi Schneider Sepam, Easergy P3, dan Easergy P5 menggunakan alat uji injeksi sekunder Omicron terkalibrasi untuk menjamin koordinasi diskriminasi proteksi yang akurat dan respons pemutusan arc yang cepat.</p>
<h3>Proses Energize & Serah Terima Proyek SAT</h3>
<p>Pemeriksaan pra-komisioning menyeluruh mencakup uji tahanan isolasi, tahanan kontak (Ductor), verifikasi interlock mekanik/listrik, serta dokumentasi serah terima lengkap disertai pelatihan operasional bagi teknisi klien.</p>`,
    },
  },

  "electrical-distribution/medium-voltage-substation": {
    id: "00000000-0000-0000-0000-000000000715",
    slug: "medium-voltage-substation",
    fullPath: "electrical-distribution/medium-voltage-substation",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/circuit-breaker.jpg",
    title: {
      en: "Medium Voltage Substation & Transformers",
      id: "Gardu Induk Tegangan Menengah & Transformator",
    },
    summary: {
      en: "MV Metal-Clad Switchgear up to 24kV/36kV, Oil-Immersed & Cast Resin Dry-Type Transformers, and Vacuum Circuit Breakers.",
      id: "Switchgear Metal-Clad TM hingga 24kV/36kV, Transformator Tipe Minyak & Dry-Type Cast Resin, serta Vacuum Circuit Breaker.",
    },
    specs: {
      "EN: Voltage Level\nID: Tingkat Tegangan": "EN: Up to 36 kV\nID: Hingga 36 kV",
      "EN: Transformer Capacity\nID: Kapasitas Transformator": "EN: Up to 20 MVA\nID: Hingga 20 MVA",
      "EN: Insulation\nID: Jenis Insulasi": "EN: Oil-Immersed / Cast Resin Dry Type\nID: Tipe Minyak / Cast Resin Dry Type",
      "EN: Standards\nID: Standar Acuan": "IEC 62271-200, SPLN, IEEE C37",
    },
    content: {
      en: `<h3>Medium Voltage Substation Infrastructure</h3>
<p>Turnkey medium voltage substation equipment engineered for utility substations, heavy industrial plants, and captive power plants up to 36 kV. Built to withstand high short-circuit levels and demanding environmental conditions.</p>
<h3>MV Metal-Clad Switchgear & Ring Main Units (RMU)</h3>
<p>Supplied with high-performance Vacuum Circuit Breakers (VCB) or SF6 gas-insulated breakers, digital protection relays, and arc flash detection sensors in strict compliance with IEC 62271-200 and SPLN standards.</p>
<h3>Oil-Immersed & Dry-Type Transformers</h3>
<p>Distribution and power transformers up to 20 MVA capacity, featuring low-loss magnetic cores, cast resin flame-retardant insulation for indoor safety, or hermetically sealed oil tanks for outdoor industrial durability.</p>`,
      id: `<h3>Infrastruktur Gardu Induk Tegangan Menengah</h3>
<p>Peralatan gardu induk tegangan menengah siap pakai (turnkey) yang dirancang untuk gardu distribusi PLN/utilitas, pabrik industri berat, dan pembangkit listrik internal (captive power) hingga 36 kV. Dibuat kokoh untuk menahan beban hubung singkat tinggi dan kondisi lingkungan yang menantang.</p>
<h3>Switchgear Metal-Clad TM & Ring Main Unit (RMU)</h3>
<p>Dilengkapi Vacuum Circuit Breaker (VCB) berkinerja tinggi atau pemutus berinsulasi gas SF6, relai proteksi digital, dan sensor deteksi arc flash sesuai standar IEC 62271-200 dan SPLN.</p>
<h3>Transformator Distribusi Tipe Minyak & Dry-Type Cast Resin</h3>
<p>Transformator daya dan distribusi berkapasitas hingga 20 MVA, mengadopsi inti magnetik rugi-daya rendah (low-loss), insulasi resin tahan api untuk keselamatan dalam ruangan, atau tangki minyak kedap udara (hermetically sealed) untuk ketahanan luar ruangan.</p>`,
    },
  },

  "electrical-distribution/low-voltage-distribution-panels": {
    id: "00000000-0000-0000-0000-000000000716",
    slug: "low-voltage-distribution-panels",
    fullPath: "electrical-distribution/low-voltage-distribution-panels",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/mdm/distribution-panel.jpg",
    title: {
      en: "Low Voltage Panels (MDP, SDP, ATS & Sync)",
      id: "Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)",
    },
    summary: {
      en: "Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), ATS/AMF Generator Sync Panels, and Motor Control Centers (MCC).",
      id: "Panel Distribusi Utama (MDP), Sub-Distribusi (SDP), Panel Sinkronisasi Genset ATS/AMF, dan Motor Control Center (MCC).",
    },
    specs: {
      "EN: Busbar Rating\nID: Kapasitas Busbar": "Up to 6300A (99.9% Cu-ETP)",
      "EN: Rated Voltage\nID: Tegangan Pengenal": "380V / 400V / 690V",
      "EN: Operation\nID: Mode Operasi": "EN: Manual / Auto Sync ATS\nID: Manual / Auto Sync ATS",
      "EN: Enclosure Protection\nID: Proteksi Enclosure": "IP42 to IP65",
    },
    content: {
      en: `<h3>Custom Low Voltage Distribution Switchboards</h3>
<p>Custom assembled low voltage distribution boards built with premium 99.9% Cu-ETP copper busbars, type-tested enclosures, and intelligent circuit breakers for seamless power routing and high operational safety up to 6300A.</p>
<h3>Main Distribution Panels (MDP) & Sub-Panels (SDP)</h3>
<p>Equipped with ACB/MCCB protection, digital metering, surge protective devices (SPD), and modular segregation up to Form 4b to safeguard personnel and simplify ongoing maintenance.</p>
<h3>Automatic Transfer Switch (ATS) & Generator Synchronization</h3>
<p>Engineered with automatic mains failure (AMF) controllers and motorized changeover switches for seamless power transition between grid power and emergency generators without voltage drops.</p>`,
      id: `<h3>Panel Distribusi Daya Tegangan Rendah Kustom</h3>
<p>Panel distribusi tegangan rendah yang dirakit khusus menggunakan busbar tembaga murni 99,9% Cu-ETP, boks panel berstandar type-tested, dan circuit breaker cerdas untuk penyaluran tenaga listrik tanpa hambatan serta tingkat keamanan operasional tinggi hingga 6300A.</p>
<h3>Main Distribution Panel (MDP) & Sub-Distribution Panel (SDP)</h3>
<p>Dilengkapi proteksi ACB/MCCB, power meter digital, perangkat proteksi petir/surge (SPD), serta pemisahan modular hingga Form 4b untuk melindungi teknisi dan mempermudah pemeliharaan berkala.</p>
<h3>Automatic Transfer Switch (ATS) & Sinkronisasi Genset</h3>
<p>Dirancang dengan kontroler Automatic Mains Failure (AMF) dan motorized changeover switch untuk transisi suplai daya mulus antara listrik PLN dan genset darurat tanpa lonjakan atau pemadaman berkepanjangan.</p>`,
    },
  },

  "automation-control/scada-xarrow-telemetry": {
    id: "00000000-0000-0000-0000-000000000717",
    slug: "scada-xarrow-telemetry",
    fullPath: "automation-control/scada-xarrow-telemetry",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/products-schneider-automation.jpg",
    title: {
      en: "SCADA Systems & Process Monitoring (xArrow)",
      id: "Sistem SCADA & Pemantauan Proses (xArrow)",
    },
    summary: {
      en: "High-performance SCADA software, real-time telemetry, alarm management, historical trending, and industrial IoT dashboards.",
      id: "Perangkat lunak SCADA berkinerja tinggi, telemetri real-time, manajemen alarm, grafik tren historis, dan dashboard IoT industri.",
    },
    specs: {
      "EN: Software\nID: Perangkat Lunak": "xArrow SCADA Industrial Edition",
      "EN: Architecture\nID: Arsitektur": "Client-Server / Web-Based / Cloud-Ready",
      "EN: Protocols\nID: Protokol Komunikasi": "OPC UA, Modbus TCP/RTU, MQTT, REST API",
      "EN: Tags Capacity\nID: Kapasitas Tag": "Unlimited I/O Tag Packages",
    },
    content: {
      en: `<h3>Centralized Industrial Process Supervision</h3>
<p>xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, log critical alarms, and receive instant alert dispatches across desktop and mobile devices.</p>
<h3>High Performance Telemetry & Multi-Protocol Driver Support</h3>
<p>Native communication support for industry-standard protocols including OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, and REST APIs, bridging shop-floor automation with enterprise ERP systems.</p>
<h3>Historical Trending & Compliance Auditing</h3>
<p>High-speed SQL data logging, interactive animated graphics, automated shift reports, and tamper-evident audit trails designed to meet stringent food, pharmaceutical, and manufacturing regulations.</p>`,
      id: `<h3>Supervisi Proses Industri Terpusat</h3>
<p>Solusi SCADA xArrow dan pemantauan proses terpusat memungkinkan manajer pabrik memvisualisasikan status mesin, mencatat metrik produksi, merekam alarm kritis, serta menerima notifikasi insiden langsung di komputer maupun perangkat seluler.</p>
<h3>Telemetri Berkecepatan Tinggi & Dukungan Multi-Protokol</h3>
<p>Dukungan komunikasi langsung untuk protokol standar industri termasuk OPC UA/DA, Modbus TCP/RTU, MQTT, Siemens S7, BACnet, dan REST API, menjembatani otomasi lantai pabrik dengan sistem ERP manajemen.</p>
<h3>Grafik Tren Historis & Audit Kepatuhan Regulasi</h3>
<p>Pencatatan data berbasis SQL berkecepatan tinggi, visual animasi interaktif, laporan rekap kerja otomatis, dan jejak audit (audit trail) antipemalsuan sesuai regulasi ketat industri makanan, farmasi, dan manufaktur.</p>`,
    },
  },

  "automation-control/vsd-inverter-panels": {
    id: "00000000-0000-0000-0000-000000000718",
    slug: "vsd-inverter-panels",
    fullPath: "automation-control/vsd-inverter-panels",
    depth: 1,
    sortOrder: 2,
    imageUrl: "/uploads/products-schneider-automation.jpg",
    title: {
      en: "Variable Speed Drive (VSD) & Inverter Panels",
      id: "Panel Variable Speed Drive (VSD) & Inverter",
    },
    summary: {
      en: "Custom engineered VSD and soft starter panels for pumps, compressors, blowers, extruders, and conveying machinery.",
      id: "Panel VSD dan soft starter rekayasa khusus untuk pompa, kompresor, blower, mesin ekstrusi, dan konveyor industri.",
    },
    specs: {
      "EN: Power Range\nID: Rentang Daya": "0.75 kW to 1200 kW",
      "EN: Supported Brands\nID: Merek Didukung": "Schneider, Danfoss, ABB, Siemens",
      "EN: Control Modes\nID: Mode Kontrol": "V/f, Open/Closed Vector Control, Torque Control",
      "EN: Enclosure\nID: Enclosure": "Rittal Industrial IP55 / IP56",
    },
    content: {
      en: `<h3>Precision Motor Control & Energy Efficiency</h3>
<p>Enclosed drive panels engineered with proper thermal dissipation, line reactors, harmonic mitigation, and bypass contactors for reliable speed and torque regulation across heavy industrial rotating machinery.</p>
<h3>Custom Enclosure Integration & Thermal Protection</h3>
<p>Housed in heavy-duty IP55 Rittal industrial enclosures with forced ventilation or closed-loop cooling units to protect inverter electronics from harsh ambient dust, moisture, and chemical vapors.</p>
<h3>Bypass & Multi-Pump Cascade Automation</h3>
<p>Equipped with automatic line-bypass contactors, harmonic dV/dt output filters for long motor cable runs, and PLC cascade algorithms for intelligent multi-pump and compressor staging.</p>`,
      id: `<h3>Kontrol Motor Presisi & Efisiensi Energi</h3>
<p>Panel drive tertutup yang dirancang dengan manajemen pelepasan panas optimal, line reactor, mitigasi harmonisa, dan kontaktor bypass untuk pengaturan kecepatan dan torsi yang andal pada motor mesin industri berat.</p>
<h3>Integrasi Boks Panel Kustom & Proteksi Termal</h3>
<p>Ditempatkan dalam enclosure industri Rittal berstandar proteksi IP55 dengan ventilasi paksa atau unit pendingin tertutup (closed-loop) guna menjaga komponen elektronik inverter dari debu pekat, kelembapan, dan uap kimia korosif.</p>
<h3>Kontaktor Bypass & Otomasi Kaskade Multi-Pompa</h3>
<p>Dilengkapi sistem kontaktor bypass otomatis, filter output dV/dt untuk jalur kabel motor jarak jauh, serta logika kendali kaskade PLC untuk pengoperasian pompa dan kompresor multi-tahap yang cerdas.</p>`,
    },
  },

  "power-quality/active-harmonic-filters": {
    id: "00000000-0000-0000-0000-000000000711",
    slug: "active-harmonic-filters",
    fullPath: "power-quality/active-harmonic-filters",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/mdm/power-quality.jpg",
    title: {
      en: "Active Harmonic Filters (AHF) & SVG",
      id: "Filter Harmonisa Aktif (AHF) & SVG",
    },
    summary: {
      en: "Dynamic active harmonic compensation up to the 50th harmonic order with stepless reactive power factor correction.",
      id: "Kompensasi harmonisa aktif dinamis hingga orde ke-50 disertai perbaikan faktor daya reaktif tanpa jeda (stepless).",
    },
    specs: {
      "EN: Harmonic Range\nID: Rentang Harmonisa": "2nd to 50th Order",
      "EN: Modular Capacity\nID: Kapasitas Modular": "50A to 600A modular rack-mount / wall-mount",
      "EN: Response Time\nID: Waktu Respons": "< 5 milliseconds",
      "EN: Target THDi\nID: Target Reduksi THDi": "< 3% at rated capacity",
    },
    content: {
      en: `<h3>Active Harmonic Mitigation & Clean Power Networks</h3>
<p>Active Harmonic Filters (AHF) and Static Var Generators (SVG) dynamically inject counter-phase currents to cancel harmonic distortions generated by non-linear loads such as variable frequency drives, rectifiers, UPS, and arc furnaces.</p>
<h3>Ultra-Fast Sub-5ms Response Time</h3>
<p>Equipped with high-speed DSP digital signal processors and IGBT power switches that detect and neutralize harmonic disturbances up to the 50th order within less than 5 milliseconds, maintaining Total Harmonic Distortion (THDi) below 3%.</p>
<h3>Stepless Bi-Directional Power Factor Correction</h3>
<p>Provides instantaneous, stepless capacitive and inductive reactive power compensation, eliminating PLN low power factor penalties and stabilizing grid voltage without resonance risks.</p>`,
      id: `<h3>Mitigasi Harmonisa Aktif & Jaringan Listrik Bersih</h3>
<p>Active Harmonic Filter (AHF) dan Static Var Generator (SVG) secara dinamis menginjeksikan arus berfasa terbalik untuk meniadakan distorsi harmonisa yang ditimbulkan oleh beban non-linear seperti inverter VFD, rectifier, UPS, dan tanur busur listrik.</p>
<h3>Respons Sangat Cepat di Bawah 5 Milidetik</h3>
<p>Ditenagai prosesor sinyal digital DSP berkecepatan tinggi dan sakelar daya IGBT yang mendeteksi serta menetralkan gangguan harmonisa hingga orde ke-50 dalam tempo kurang dari 5 milidetik, menjaga Total Harmonic Distortion (THDi) selalu di bawah 3%.</p>
<h3>Perbaikan Faktor Daya Dua Arah Tanpa Jeda (Stepless)</h3>
<p>Menyediakan kompensasi daya reaktif induktif maupun kapasitif secara seketika dan halus tanpa jeda tangga, menghindarkan denda kVARh dari PLN serta menstabilkan tegangan jala-jala tanpa bahaya resonansi.</p>`,
    },
  },

  "fire-alarm-products/addressable-fire-alarm-systems": {
    id: "00000000-0000-0000-0000-000000000712",
    slug: "addressable-fire-alarm-systems",
    fullPath: "fire-alarm-products/addressable-fire-alarm-systems",
    depth: 1,
    sortOrder: 1,
    imageUrl: "/uploads/brand-bosch.png",
    title: {
      en: "Addressable Fire Alarm Panels & Detectors",
      id: "Panel Fire Alarm Addressable & Sensor Detektor",
    },
    summary: {
      en: "Intelligent addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and suppression triggers.",
      id: "Panel kontrol alarm kebakaran addressable cerdas, detektor asap optik & panas multi-kriteria, serta aktivator pemadam gas.",
    },
    specs: {
      "EN: Capacity\nID: Kapasitas Titik": "1 to 8 Loops (up to 2000+ addressable points)",
      "EN: Detectors\nID: Tipe Sensor Detektor": "Optical Smoke, Thermal, Multi-Criteria, Flame",
      "EN: Standards\nID: Standar Keselamatan": "NFPA 72, EN54, UL Listed, FM Approved",
    },
    content: {
      en: `<h3>Intelligent Addressable Fire Safety Architecture</h3>
<p>Fully addressable fire detection networks providing precise point-by-point device identification, automatic sensitivity drift compensation, rapid pinpoint evacuation alerting, and building management system (BMS) integration.</p>
<h3>Multi-Criteria Optical & Thermal Detectors</h3>
<p>Equipped with dual-wavelength optical smoke sensing and thermistor heat measurement to detect early-stage smoldering fires while effectively eliminating false alarms from dust, steam, or industrial aerosols.</p>
<h3>Clean Agent Gas Suppression & Notification Triggers</h3>
<p>Integrated releasing circuits for FM-200, Novec 1230, and inert gas suppression systems engineered for mission-critical electrical switchgear rooms, battery storage, and server data centers compliant with NFPA 72.</p>`,
      id: `<h3>Arsitektur Keselamatan Kebakaran Addressable Cerdas</h3>
<p>Jaringan deteksi kebakaran addressable penuh yang menyediakan identifikasi titik lokasi sensor secara presisi, kompensasi otomatis kepekaan debu, peringatan evakuasi cepat, dan integrasi mulus dengan Building Management System (BMS).</p>
<h3>Detektor Multi-Kriteria Optik & Termal</h3>
<p>Dilengkapi sensor optik panjang gelombang ganda dan pengukur panas termistor untuk mendeteksi tanda awal kebakaran berasap (smoldering) sekaligus mencegah alarm palsu akibat debu, uap air, atau aerosol industri.</p>
<h3>Aktivasi Gas Pemadam Clean Agent & Sistem Notifikasi</h3>
<p>Sirkuit aktivasi terintegrasi untuk sistem pemadam gas clean agent seperti FM-200, Novec 1230, dan gas inert yang dirancang khusus untuk ruang switchboard elektrikal, ruang baterai, dan ruang server pusat data sesuai standar NFPA 72.</p>`,
    },
  },
}

// Pre-sorted path index for O(log n) binary search lookups
const PRODUCT_SORTED_PATHS: string[] = Object.keys(BILINGUAL_PRODUCT_CATALOG).sort()

// Pre-indexed Maps for O(1) direct lookups
const PRODUCT_PATH_INDEX = new Map<string, BilingualProductEntry>()
const PRODUCT_SLUG_INDEX = new Map<string, BilingualProductEntry>()

for (const [key, entry] of Object.entries(BILINGUAL_PRODUCT_CATALOG)) {
  PRODUCT_PATH_INDEX.set(key, entry)
  PRODUCT_PATH_INDEX.set(entry.fullPath, entry)
  if (!PRODUCT_SLUG_INDEX.has(entry.slug)) {
    PRODUCT_SLUG_INDEX.set(entry.slug, entry)
  }
}

/**
 * Performs a binary search on sorted product paths in O(log n) time.
 */
export function binarySearchProductPath(targetPath: string): BilingualProductEntry | undefined {
  let low = 0
  let high = PRODUCT_SORTED_PATHS.length - 1

  while (low <= high) {
    const mid = (low + high) >>> 1
    const midPath = PRODUCT_SORTED_PATHS[mid]
    if (midPath === targetPath) {
      return BILINGUAL_PRODUCT_CATALOG[midPath]
    } else if (midPath < targetPath) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  return undefined
}

/**
 * Finds the bilingual catalog entry for a product path or slug.
 * Operates in O(1) via hash indexing, falling back to O(log n) binary search.
 */
export function findBilingualProductEntry(fullPathOrSlug: string): BilingualProductEntry | undefined {
  if (!fullPathOrSlug) return undefined
  const clean = fullPathOrSlug.replace(/^\/+|\/+$/g, "")

  // 1. O(1) exact fullPath lookup
  const byPath = PRODUCT_PATH_INDEX.get(clean)
  if (byPath) return byPath

  // 2. O(log n) binary search on sorted paths
  const byBinarySearch = binarySearchProductPath(clean)
  if (byBinarySearch) return byBinarySearch

  // 3. O(1) slug lookup
  const slug = clean.split("/").pop() || clean
  const bySlug = PRODUCT_SLUG_INDEX.get(slug)
  if (bySlug) return bySlug

  return undefined
}

/**
 * Enriches a product node with complete bilingual translations.
 */
export function enrichProductWithBilingual(
  node: ContentNode | null | undefined,
  fullPathOrSlug: string
): ContentNode | null {
  const entry = findBilingualProductEntry(fullPathOrSlug)
  if (!node && !entry) return null

  if (!entry) {
    return node ?? null
  }

  const baseNode: ContentNode = node ?? {
    id: entry.id ?? `prod-${entry.slug}`,
    slug: entry.slug,
    fullPath: entry.fullPath,
    title: "",
    summary: "",
    imageUrl: entry.imageUrl,
    specs: entry.specs,
    status: entry.status ?? "published",
    sortOrder: entry.sortOrder ?? 1,
    depth: entry.depth ?? 0,
    children: [],
  }

  const titleString = `EN: ${entry.title.en}\nID: ${entry.title.id}`
  const summaryString = `EN: ${entry.summary.en}\nID: ${entry.summary.id}`

  return {
    ...baseNode,
    title: titleString,
    summary: summaryString,
    imageUrl: baseNode.imageUrl || entry.imageUrl,
    specs: entry.specs ? { ...entry.specs, ...(baseNode.specs || {}) } : baseNode.specs,
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

export const PRODUCT_TREE_STRUCTURE: { root: string; children: string[] }[] = [
  {
    root: "rittal-distributor",
    children: [
      "rittal-distributor/enclosures",
      "rittal-distributor/climate-control-cooling",
      "rittal-distributor/power-distribution",
      "rittal-distributor/it-infrastructure",
      "rittal-distributor/outdoor-enclosures",
      "rittal-distributor/automation-systems",
      "rittal-distributor/hygienic-design-enclosures",
      "rittal-distributor/atex-hazardous-area-enclosures",
      "rittal-distributor/hmi-consoles-support-arm-systems",
      "rittal-distributor/riline-compact-busbar-system",
      "rittal-distributor/riline60-modular-busbar-systems",
      "rittal-distributor/maxi-pls-flat-pls-high-current-busbars",
      "rittal-distributor/fan-and-filter-units",
      "rittal-distributor/air-to-water-heat-exchangers-chillers",
      "rittal-distributor/enclosure-heaters-dehumidifiers",
      "rittal-distributor/perforex-lc-laser-machining-centers",
      "rittal-distributor/wire-terminal-automated-wire-processing",
      "rittal-distributor/copper-workstation-busbar-machining",
      "rittal-distributor/tx-cablenet-network-racks",
      "rittal-distributor/intelligent-it-pdu-power-distribution",
      "rittal-distributor/lcp-liquid-cooling-packages",
      "rittal-distributor/led-system-lights",
      "rittal-distributor/base-plinth-system-vx",
      "rittal-distributor/cable-entry-systems-gland-plates",
    ],
  },
  {
    root: "schneider-integrator",
    children: [
      "schneider-integrator/industrial-automation",
      "schneider-integrator/power-energy-monitoring",
      "schneider-integrator/electrical-distribution-integration",
      "schneider-integrator/engineering-commissioning",
    ],
  },
  {
    root: "electrical-distribution",
    children: [
      "electrical-distribution/medium-voltage-substation",
      "electrical-distribution/low-voltage-distribution-panels",
    ],
  },
  {
    root: "automation-control",
    children: [
      "automation-control/scada-xarrow-telemetry",
      "automation-control/vsd-inverter-panels",
    ],
  },
  {
    root: "enclosure-climate-control",
    children: [],
  },
  {
    root: "power-quality",
    children: [
      "power-quality/active-harmonic-filters",
    ],
  },
  {
    root: "fire-alarm-products",
    children: [
      "fire-alarm-products/addressable-fire-alarm-systems",
    ],
  },
]

export function buildBilingualProductTree(): ContentNode[] {
  return PRODUCT_TREE_STRUCTURE.map((group) => {
    const rootNode = enrichProductWithBilingual(null, group.root)!
    const childrenNodes = group.children
      .map((childPath) => enrichProductWithBilingual(null, childPath))
      .filter((n): n is ContentNode => Boolean(n))
    return {
      ...rootNode,
      children: childrenNodes,
    }
  })
}
