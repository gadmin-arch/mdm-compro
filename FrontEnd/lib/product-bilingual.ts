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

/**
 * Finds the bilingual catalog entry for a product path or slug.
 */
export function findBilingualProductEntry(fullPathOrSlug: string): BilingualProductEntry | undefined {
  if (!fullPathOrSlug) return undefined
  const clean = fullPathOrSlug.replace(/^\/+|\/+$/g, "")
  if (BILINGUAL_PRODUCT_CATALOG[clean]) {
    return BILINGUAL_PRODUCT_CATALOG[clean]
  }
  const slug = clean.split("/").pop() || clean
  if (BILINGUAL_PRODUCT_CATALOG[slug]) {
    return BILINGUAL_PRODUCT_CATALOG[slug]
  }
  return Object.values(BILINGUAL_PRODUCT_CATALOG).find(
    (entry) => entry.slug === slug || entry.fullPath === clean || entry.fullPath.endsWith(`/${slug}`)
  )
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
