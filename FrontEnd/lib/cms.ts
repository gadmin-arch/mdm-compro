export type SEO = {
  title?: string
  description?: string
  canonical?: string
  noIndex?: boolean
}

export type MediaAsset = {
  id?: string
  url: string
  altText?: string
  mimeType?: string
}

export type ContentNode = {
  id: string
  parentId?: string
  slug: string
  fullPath: string
  title: string
  summary?: string
  content?: unknown
  imageUrl?: string
  gallery?: MediaAsset[]
  specs?: Record<string, string>
  datasheetUrl?: string
  status: string
  publishedAt?: string
  sortOrder: number
  depth: number
  seo?: SEO
  version?: number
  children?: ContentNode[]
}

export type NewsItem = {
  id: string
  slug: string
  title: string
  excerpt?: string
  body?: { blocks?: Array<{ type: string; text: string }> }
  category?: string
  tags?: string[]
  featuredImageUrl?: string
  featured: boolean
  status: string
  publishedAt?: string
  seo?: SEO
  version?: number
}

export type Career = {
  id: string
  slug: string
  title: string
  summary?: string
  description?: { blocks?: Array<{ type: string; text: string }> }
  department: string
  location: string
  employmentType: string
  applyUrl?: string
  deadline?: string
  status: string
  publishedAt?: string
  seo?: SEO
  version?: number
}

export type PageContent = {
  id: string
  key: string
  title: string
  content: Record<string, unknown>
  status: string
  publishedAt?: string
  seo?: SEO
  version: number
}

export type MenuItem = {
  id: string
  label: string
  href?: string
  kind: "system" | "page" | "custom"
  pageKey?: string
  auto?: "services" | "products"
  visible: boolean
  children?: MenuItem[]
}

export type Navigation = {
  services: ContentNode[]
  products: ContentNode[]
  menu?: MenuItem[]
}

// Mirrors model.SystemPageKeys in the backend: pages the public site routes
// to directly. Their slugs are fixed and they cannot be archived.
export const systemPageKeys = ["home", "about", "contact", "services", "products", "news", "career"]

export function isSystemPageKey(key: string): boolean {
  return systemPageKeys.includes(key)
}

// Mirrors model.DefaultMenuItems in the backend.
export const defaultMenuItems: MenuItem[] = [
  { id: "home", label: "EN: Home\nID: Beranda", href: "/", kind: "system", visible: true },
  { id: "about", label: "EN: About Us\nID: Tentang Kami", href: "/about", kind: "system", visible: true },
  { id: "services", label: "EN: Services\nID: Layanan", href: "/services", kind: "system", auto: "services", visible: true },
  { id: "products", label: "EN: Products\nID: Produk", href: "/products", kind: "system", auto: "products", visible: true },
  { id: "news", label: "EN: News\nID: Berita", href: "/news", kind: "system", visible: true },
  { id: "career", label: "EN: Careers\nID: Karir", href: "/career", kind: "system", visible: true },
  { id: "contact", label: "EN: Contact Us\nID: Hubungi Kami", href: "/contact", kind: "system", visible: true },
]

export type ListResponse<T> = {
  data: T[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

export const fallbackServices: ContentNode[] = [
  {
    id: "serv-electrical-construction",
    slug: "electrical-construction-installation",
    fullPath: "electrical-construction-installation",
    title: "EN: Electrical Construction & Installation\nID: Konstruksi & Instalasi Elektrikal",
    summary: "EN: Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.\nID: Solusi terintegrasi instalasi gardu induk tegangan menengah & rendah, switchgear, panel distribusi, pemasangan trafo, dan terminasi kabel.",
    imageUrl: "/uploads/mdm/construction-installation.jpg",
    status: "published",
    sortOrder: 1,
    depth: 0,
    children: [
      {
        id: "serv-substation-installation",
        slug: "substation-mv-switchgear-installation",
        fullPath: "electrical-construction-installation/substation-mv-switchgear-installation",
        title: "EN: Substation & MV Switchgear Installation\nID: Instalasi Gardu Induk & Switchgear Tegangan Menengah (MV)",
        summary: "EN: Medium voltage metal-clad switchgear, power transformers, and substation integration up to 36kV.\nID: Switchgear metal-clad tegangan menengah, transformator daya, dan integrasi gardu induk hingga 36kV.",
        imageUrl: "/uploads/mdm/medium-voltage-equipment.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-lv-panel-assembly",
        slug: "lv-distribution-panels-assembly",
        fullPath: "electrical-construction-installation/lv-distribution-panels-assembly",
        title: "EN: LV Panels Assembly (MDP, SDP, ATS & Sync)\nID: Perakitan Panel Tegangan Rendah (MDP, SDP, ATS & Sinkronisasi)",
        summary: "EN: Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).\nID: Panel Distribusi Utama (MDP), Panel Sub-Distribusi, panel sinkronisasi ATS/AMF, dan Motor Control Center (MCC).",
        imageUrl: "/uploads/mdm/circuit-breaker.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-cabling-termination",
        slug: "mv-lv-cable-installation-termination",
        fullPath: "electrical-construction-installation/mv-lv-cable-installation-termination",
        title: "EN: MV & LV Cable Installation & Termination\nID: Instalasi & Terminasi Kabel MV & LV",
        summary: "EN: Certified cable pulling, tray erection, heat/cold shrink terminations, and high-potential (Hi-Pot) insulation testing.\nID: Penarikan kabel tersertifikasi, pemasangan tray, terminasi heat/cold shrink, dan pengujian isolasi Hi-Pot.",
        content: {
          bilingual: true,
          id: {
            blocks: [
              {
                type: "heading",
                text: "Distribusi Listrik yang Andal untuk Fasilitas Industri",
              },
              {
                type: "html",
                html: '<p>Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses <a href="/services/electrical-construction-installation/mv-lv-cable-installation-termination">instalasi dan terminasi kabel MV & LV</a> yang tepat. Instalasi, routing, terminasi, dan pengujian yang dilakukan secara akurat sangat penting untuk menjaga keselamatan, keandalan, dan performa sistem dalam jangka panjang.</p>',
              },
            ],
          },
          en: {
            blocks: [
              {
                type: "heading",
                text: "Reliable Power Distribution for Industrial Facilities",
              },
              {
                type: "html",
                html: '<p>Reliable electrical distribution depends not only on cable quality and equipment, but also on proper <a href="/services/electrical-construction-installation/mv-lv-cable-installation-termination">MV & LV cable installation and termination.</a> Accurate installation, routing, termination, and testing are essential to maintain electrical safety, system reliability, and long-term performance.</p>',
              },
            ],
          },
          blocks: [
            {
              type: "paragraph",
              text: "Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses instalasi dan terminasi kabel MV & LV yang tepat.",
            },
          ],
        },
        imageUrl: "/uploads/mdm/electrical-equipment.jpg",
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
      {
        id: "serv-fire-alarm-install",
        slug: "fire-alarm-system-installation",
        fullPath: "electrical-construction-installation/fire-alarm-system-installation",
        title: "EN: Fire Alarm System Engineering & Installation\nID: Rekayasa & Instalasi Sistem Fire Alarm",
        summary: "EN: Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.\nID: Jaringan fire alarm addressable terintegrasi, detektor multi-sensor, aspirating smoke detection, dan sistem pemadam clean agent.",
        imageUrl: "/uploads/PM-Fire-Alarm-1.jpg",
        status: "published",
        sortOrder: 4,
        depth: 1,
      },
    ],
  },
  {
    id: "serv-electrical-maintenance",
    slug: "electrical-maintenance-service",
    fullPath: "electrical-maintenance-service",
    title: "EN: Electrical Maintenance & Servicing\nID: Pemeliharaan & Perawatan Sistem Kelistrikan",
    summary: "EN: Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.\nID: Layanan pemeliharaan preventif, prediktif, dan korektif komprehensif untuk trafo, kubikel MV, papan distribusi, dan circuit breaker.",
    imageUrl: "/uploads/mdm/maintenance-contract.jpg",
    status: "published",
    sortOrder: 2,
    depth: 0,
    children: [
      {
        id: "serv-transformer-oil-dga",
        slug: "transformer-oil-treatment-dga",
        fullPath: "electrical-maintenance-service/transformer-oil-treatment-dga",
        title: "EN: Transformer Oil Treatment, BDV & DGA\nID: Penanganan Minyak Trafo, Uji BDV & Analisis DGA",
        summary: "EN: On-site oil purification, vacuum degassing, breakdown voltage (BDV) testing, and Dissolved Gas Analysis (DGA).\nID: Pemurnian minyak trafo on-site, degasifikasi vakum, pengujian tegangan tembus (BDV), dan Dissolved Gas Analysis (DGA).",
        imageUrl: "/uploads/mdm/micrologic-test.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-mv-acb-maintenance",
        slug: "mv-cubicle-acb-maintenance",
        fullPath: "electrical-maintenance-service/mv-cubicle-acb-maintenance",
        title: "EN: MV Cubicle & ACB Maintenance (Trip Testing)\nID: Pemeliharaan Kubikel MV & ACB (Pengujian Trip)",
        summary: "EN: Preventive servicing for medium voltage switchgear, contact resistance (Ductor), and ACB secondary injection.\nID: Servis preventif switchgear tegangan menengah, uji resistansi kontak (Ductor), dan injeksi sekunder ACB.",
        imageUrl: "/uploads/mdm/preventive-maintenance.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-thermography",
        slug: "thermography-predictive-maintenance",
        fullPath: "electrical-maintenance-service/thermography-predictive-maintenance",
        title: "EN: Infrared Thermography & Predictive Maintenance\nID: Termografi Inframerah & Pemeliharaan Prediktif",
        summary: "EN: Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, and overloaded phases under full load.\nID: Pemindaian termal non-kontak FLIR untuk mendeteksi hot spot, sambungan busbar longgar, dan fase beban berlebih saat operasi penuh.",
        imageUrl: "/uploads/mdm/infrared-thermograph.jpg",
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
      {
        id: "serv-amc-contracts",
        slug: "annual-maintenance-contracts",
        fullPath: "electrical-maintenance-service/annual-maintenance-contracts",
        title: "EN: Annual Maintenance Contracts (AMC) & 24/7 SLA\nID: Kontrak Pemeliharaan Tahunan (AMC) & SLA Siaga 24/7",
        summary: "EN: Customized long-term service level agreements providing scheduled shutdowns, emergency call-outs, and spare parts management.\nID: Perjanjian tingkat layanan jangka panjang terpadu dengan shutdown terjadwal, respon darurat cepat, dan manajemen suku cadang.",
        imageUrl: "/uploads/mdm/maintenance-contract.jpg",
        status: "published",
        sortOrder: 4,
        depth: 1,
      },
    ],
  },
  {
    id: "serv-automation-solutions",
    slug: "automation-solutions-services",
    fullPath: "automation-solutions-services",
    title: "EN: Automation Solutions & Services\nID: Solusi & Layanan Otomasi Industri",
    summary: "EN: Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.\nID: Otomasi industri, sistem SCADA (xArrow & EcoStruxure), pemrograman PLC, Pemantauan Energi (PME), dan optimasi proses manufaktur.",
    imageUrl: "/uploads/mdm/industrial-automation.jpg",
    status: "published",
    sortOrder: 3,
    depth: 0,
    children: [
      {
        id: "serv-scada-hmi",
        slug: "scada-hmi-process-monitoring",
        fullPath: "automation-solutions-services/scada-hmi-process-monitoring",
        title: "EN: SCADA Systems, HMI & Centralized Telemetry\nID: Sistem SCADA, HMI & Telemetri Terpusat",
        summary: "EN: Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and industrial telemetry.\nID: Kontrol pengawasan pabrik terpusat, tampilan mimic dinamis, pencatatan alarm, tren historis, dan telemetri industri.",
        imageUrl: "/uploads/xarrow.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-energy-management",
        slug: "energy-management-iso50001",
        fullPath: "automation-solutions-services/energy-management-iso50001",
        title: "EN: Energy Management Systems (EMS & ISO 50001)\nID: Sistem Manajemen Energi (EMS & ISO 50001)",
        summary: "EN: Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG compliance reporting.\nID: Pemantauan daya real-time, baseline energi otomatis, pelacakan beban puncak, dan pelaporan kepatuhan standar ESG.",
        imageUrl: "/uploads/PMS-Network_001.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-plc-vsd",
        slug: "plc-vsd-system-integration",
        fullPath: "automation-solutions-services/plc-vsd-system-integration",
        title: "EN: PLC Programming & Variable Speed Drive (VSD) Integration\nID: Pemrograman PLC & Integrasi Variable Speed Drive (VSD)",
        summary: "EN: Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.\nID: Rekayasa logika PLC kustom, perakitan panel kontrol, penyetelan inverter Altivar/Danfoss/ABB, dan kontrol gerak presisi.",
        imageUrl: "/uploads/products-schneider-automation.jpg",
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
    ],
  },
  {
    id: "serv-inspection-testing",
    slug: "inspection-testing-commissioning",
    fullPath: "inspection-testing-commissioning",
    title: "EN: Inspection, Testing & Commissioning\nID: Inspeksi, Pengujian & Commissioning",
    summary: "EN: Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.\nID: Pengujian spesialis dengan instrumen terkalibrasi: kualitas daya, partial discharge (PD scan), injeksi sekunder, dan koordinasi proteksi relay.",
    imageUrl: "/uploads/mdm/testing-measurement.jpg",
    status: "published",
    sortOrder: 4,
    depth: 0,
    children: [
      {
        id: "serv-power-quality-study",
        slug: "power-quality-analysis-study",
        fullPath: "inspection-testing-commissioning/power-quality-analysis-study",
        title: "EN: Power Quality Analysis & Harmonics Study\nID: Analisis Kualitas Daya & Studi Harmonisa",
        summary: "EN: Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, and mitigation design.\nID: Perekaman kualitas daya Kelas A, audit distorsi harmonisa (THD), fluktuasi tegangan, dan perancangan filter mitigasi.",
        imageUrl: "/uploads/mdm/power-quality.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-pd-scan",
        slug: "partial-discharge-pd-scan",
        fullPath: "inspection-testing-commissioning/partial-discharge-pd-scan",
        title: "EN: Partial Discharge (PD) Scan & Insulation Diagnostics\nID: Pemindaian Partial Discharge (PD) & Diagnostik Isolasi",
        summary: "EN: Non-invasive TEV, acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.\nID: Sensor non-invasif TEV, ultrasonik akustik, dan HFCT untuk pemindaian PD switchgear dan kabel bertegangan langsung.",
        imageUrl: "/uploads/mdm/partial-discharge.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-relay-protection",
        slug: "relay-protection-testing-commissioning",
        fullPath: "inspection-testing-commissioning/relay-protection-testing-commissioning",
        title: "EN: Protection Relay Testing (Secondary Injection)\nID: Pengujian Relay Proteksi (Injeksi Sekunder)",
        summary: "EN: 3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.\nID: Pengujian injeksi sekunder 3-fase & 6-fase menggunakan unit Omicron CMC untuk relay proteksi arus lebih, diferensial, dan jarak.",
        imageUrl: "/uploads/mdm/secondary-injector.jpg",
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
    ],
  },
  {
    id: "serv-mechanical-supplies",
    slug: "mechanical-services-supplies",
    fullPath: "mechanical-services-supplies",
    title: "EN: Mechanical Services & General Supplies\nID: Layanan Mekanikal & Pengadaan Industri",
    summary: "EN: Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.\nID: Pemeliharaan mekanikal industri, sistem konveyor, separator magnetik, pintu industri berkecepatan tinggi, vacuum lifter, dan servis motor/generator.",
    imageUrl: "/uploads/mdm/electrical-services.jpg",
    status: "published",
    sortOrder: 5,
    depth: 0,
    children: [
      {
        id: "serv-mechanical-supplies-items",
        slug: "industrial-mechanical-supplies-services",
        fullPath: "mechanical-services-supplies/industrial-mechanical-supplies-services",
        title: "EN: Conveyor Systems, Magnetic Separators & Industrial Supplies\nID: Sistem Konveyor, Separator Magnetik & Perlengkapan Industri",
        summary: "EN: Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.\nID: Pengadaan, instalasi, dan servis lini konveyor, pemisah logam magnetik, sectional door, dan peralatan vacuum lifter.",
        imageUrl: "/uploads/mdm/construction-installation.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-motor-overhaul",
        slug: "motor-generator-servicing-overhaul",
        fullPath: "mechanical-services-supplies/motor-generator-servicing-overhaul",
        title: "EN: Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)\nID: Overhaul Motor & Generator (Pelapisan Ulang Isolasi & Balancing Dinamis)",
        summary: "EN: Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.\nID: Servis elektromotor, motor MV, generator, pelapisan ulang isolasi kumparan, analisis vibrasi, dan rekondisi rotor.",
        imageUrl: "/uploads/mdm/electrical-services.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
    ],
  },
]

export const fallbackProducts: ContentNode[] = [
  {
    id: "prod-rittal-distributor",
    slug: "rittal-distributor",
    fullPath: "rittal-distributor",
    title: "EN: Rittal Authorized Distributor\nID: Distributor Resmi Rittal",
    summary: "EN: Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, power distribution, and IT infrastructure systems.\nID: Distributor resmi untuk sistem enclosure industri Rittal, climate control & pendingin, distribusi daya, dan infrastruktur IT.",
    imageUrl: "/uploads/brand-rittal.jpg",
    specs: { Partner: "Authorized Distributor", Brand: "Rittal", Origin: "Germany" },
    status: "published",
    sortOrder: 1,
    depth: 0,
    children: [
      {
        id: "prod-rittal-enclosures",
        slug: "enclosures",
        fullPath: "rittal-distributor/enclosures",
        title: "EN: Rittal Enclosure Systems (VX25, AX, KX)\nID: Sistem Enclosure Rittal (VX25, AX, KX)",
        summary: "EN: Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.\nID: Sistem enclosure besar baying resmi Rittal (VX25), enclosure kompak (AX), kotak terminal kecil (KX), dan rak server IT outdoor.",
        imageUrl: "/uploads/products-rittal-enclosures.jpg",
        specs: {
          "Series": "VX25, AX, KX, CS Toptec, IT Network Racks",
          "Frame Pitch": "25 mm DIN standard symmetrical grid",
          "Protection Rating": "IP55 / IP66 / NEMA 4X / NEMA 12",
          "Material": "Sheet steel RAL 7035 / Stainless steel AISI 304 & 316L",
          "Certifications": "IEC 62208, UL 508A, DNV-GL",
        },
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "prod-rittal-cooling",
        slug: "climate-control-cooling",
        fullPath: "rittal-distributor/climate-control-cooling",
        title: "EN: Rittal Climate Control & Cooling (Blue e+)\nID: Sistem Pendingin & Climate Control Rittal (Blue e+)",
        summary: "EN: Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.\nID: Unit pendingin hibrida inovatif, thermoelectric cooler, dan penukar panas air-ke-udara hemat energi hingga 75% dengan pemantauan IoT digital.",
        imageUrl: "/uploads/products-rittal-cooling.jpg",
        specs: {
          "Cooling Capacity": "300 W to 5,500 W (Blue e+ & Blue e+ S)",
          "Energy Savings": "Up to 75% via patented hybrid heat pipe",
          "Refrigerant": "Eco-friendly R-513A / R-134a",
          "IoT Connectivity": "Modbus TCP, SNMP, OPC-UA",
        },
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "prod-rittal-power",
        slug: "power-distribution",
        fullPath: "rittal-distributor/power-distribution",
        title: "EN: Rittal Power Distribution (Ri4Power & RiLine)\nID: Sistem Distribusi Daya Rittal (Ri4Power & RiLine)",
        summary: "EN: Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.\nID: Sistem distribusi daya busbar dan switchgear tegangan rendah type-tested hingga 6300A sesuai standar IEC 61439-1/-2.",
        imageUrl: "/uploads/products-rittal-power.jpg",
        specs: {
          "Rated Current": "Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)",
          "Short-Circuit Withstand": "Up to 120 kA (1s)",
          "Internal Separation": "Form 1 to Form 4b",
          "Standards": "IEC 61439-1, IEC 61439-2",
        },
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
    ],
  },
  {
    id: "prod-schneider-integrator",
    slug: "schneider-integrator",
    fullPath: "schneider-integrator",
    title: "EN: Schneider Electric System Integrator\nID: System Integrator Resmi Schneider Electric",
    summary: "EN: Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.\nID: System Integrator dan Solutions Partner bersertifikat penyedia otomasi industri, pemantauan energi, dan distribusi elektrikal.",
    imageUrl: "/uploads/brand-schneider.jpg",
    specs: { Partner: "Certified System Integrator", Brand: "Schneider Electric" },
    status: "published",
    sortOrder: 2,
    depth: 0,
    children: [
      {
        id: "prod-schneider-automation",
        slug: "industrial-automation",
        fullPath: "schneider-integrator/industrial-automation",
        title: "EN: Schneider Industrial Automation (Modicon & EcoStruxure)\nID: Otomasi Industri Schneider (Modicon & EcoStruxure)",
        summary: "EN: Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.\nID: Sistem otomasi PLC/PAC lengkap beranggotakan Schneider Modicon M340, M580 ePAC, Magelis HMI, dan arsitektur EcoStruxure Plant.",
        imageUrl: "/uploads/products-schneider-automation.jpg",
        specs: {
          "PLC Families": "Modicon M580 ePAC, Modicon M340, M241/M251",
          "Cybersecurity": "Achilles Level 2 & ISA/IEC 62443",
          "Software": "EcoStruxure Control Expert (Unity Pro)",
        },
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "prod-schneider-pme",
        slug: "power-energy-monitoring",
        fullPath: "schneider-integrator/power-energy-monitoring",
        title: "EN: Power & Energy Monitoring (PME & PowerLogic)\nID: Pemantauan Daya & Energi (PME & PowerLogic)",
        summary: "EN: Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.\nID: Power meter digital Schneider PowerLogic, ION meter, dan perangkat lunak EcoStruxure Power Monitoring Expert (PME).",
        imageUrl: "/uploads/products-schneider-pme.jpg",
        specs: {
          "Software Platform": "EcoStruxure PME / Power Operation",
          "Power Meters": "PowerLogic PM8000, PM5000, ION9000",
          "Compliance": "IEC 61000-4-30 Class A",
        },
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "prod-schneider-distribution",
        slug: "electrical-distribution-integration",
        fullPath: "schneider-integrator/electrical-distribution-integration",
        title: "EN: Electrical Distribution Integration (MasterPact & Prisma)\nID: Integrasi Distribusi Elektrikal (MasterPact & Prisma)",
        summary: "EN: MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.\nID: Circuit breaker udara MasterPact MTZ/NW, breaker cetak Compact NSX, dan integrasi switchboard type-tested Prisma.",
        imageUrl: "/uploads/products-schneider-distribution.jpg",
        specs: {
          "Air Circuit Breakers": "MasterPact MTZ (up to 6300A)",
          "Trip Units": "MicroLogic X with Class 1 Energy Metering",
          "Switchboards": "PrismaSeT G & P Modular Enclosures",
        },
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
      {
        id: "prod-schneider-commissioning",
        slug: "engineering-commissioning",
        fullPath: "schneider-integrator/engineering-commissioning",
        title: "EN: Schneider Engineering, FAT/SAT & Commissioning Support\nID: Rekayasa Schneider, Dukungan FAT/SAT & Commissioning",
        summary: "EN: Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.\nID: Factory acceptance testing (FAT), site acceptance testing (SAT), koordinasi proteksi relay, dan commissioning bertegangan.",
        imageUrl: "/uploads/products-schneider-commissioning.jpg",
        specs: {
          "Testing Fleet": "Omicron CMC 356, Megger, Fluke 1777",
          "Accreditation": "ESDM Level 6 Certified & Schneider Integrator",
        },
        status: "published",
        sortOrder: 4,
        depth: 1,
      },
    ],
  },
  {
    id: "prod-electrical-distribution",
    slug: "electrical-distribution",
    fullPath: "electrical-distribution",
    title: "EN: Electrical Distribution\nID: Peralatan Distribusi Listrik",
    summary: "EN: Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.\nID: Peralatan distribusi kelistrikan tegangan menengah & rendah, panel switchboard, transformator, dan sistem proteksi daya.",
    imageUrl: "/uploads/mdm/circuit-breaker.jpg",
    specs: { Category: "Electrical Distribution" },
    status: "published",
    sortOrder: 3,
    depth: 0,
  },
  {
    id: "prod-automation-control",
    slug: "automation-control",
    fullPath: "automation-control",
    title: "EN: Automation & Control\nID: Kontrol & Otomasi Industri",
    summary: "EN: Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.\nID: Otomasi industri, sistem PLC, visualisasi proses SCADA/HMI, dan penggerak motor (inverter/VSD).",
    imageUrl: "/uploads/products-schneider-automation.jpg",
    specs: { Category: "Automation & Control" },
    status: "published",
    sortOrder: 4,
    depth: 0,
  },
  {
    id: "prod-enclosure-climate-control",
    slug: "enclosure-climate-control",
    fullPath: "enclosure-climate-control",
    title: "EN: Enclosure & Climate Control\nID: Enclosure & Manajemen Suhu Industri",
    summary: "EN: Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.\nID: Enclosure industri, rak server, climate control, dan sistem pendingin untuk lingkungan manufaktur yang menuntut ketahanan tinggi.",
    imageUrl: "/uploads/products-rittal-enclosures.jpg",
    specs: { Category: "Enclosure & Climate Control" },
    status: "published",
    sortOrder: 5,
    depth: 0,
  },
  {
    id: "prod-power-quality",
    slug: "power-quality",
    fullPath: "power-quality",
    title: "EN: Power Quality\nID: Solusi Kualitas Daya Listrik",
    summary: "EN: Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.\nID: Filter harmonisa aktif, perbaikan faktor daya, kapasitor bank, dan penganalisis kualitas daya.",
    imageUrl: "/uploads/mdm/power-quality.jpg",
    specs: { Category: "Power Quality" },
    status: "published",
    sortOrder: 6,
    depth: 0,
  },
  {
    id: "prod-fire-alarm-products",
    slug: "fire-alarm-products",
    fullPath: "fire-alarm-products",
    title: "EN: Fire Alarm Products\nID: Produk & Perangkat Fire Alarm",
    summary: "EN: Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions from Bosch Building Technologies.\nID: Panel fire alarm addressable industri, sensor detektor, perangkat notifikasi, dan solusi proteksi kebakaran dari Bosch Building Technologies.",
    imageUrl: "/uploads/brand-bosch.png",
    specs: { Category: "Fire Alarm Products", Brand: "Bosch" },
    status: "published",
    sortOrder: 7,
    depth: 0,
  },
]

export const fallbackNews: ListResponse<NewsItem> = {
  data: [
    {
      id: "news-energy",
      slug: "energy-monitoring-system-launch",
      title: "EN: Launching our Energy Monitoring System for ESG-ready facilities\nID: Peluncuran Sistem Pemantauan Energi untuk Fasilitas Industri Berstandar ESG",
      excerpt:
        "EN: A turnkey solution helps plants track real-time consumption and produce ESG-grade sustainability reports.\nID: Solusi terintegrasi untuk membantu pabrik memantau konsumsi energi real-time dan menghasilkan laporan keberlanjutan ESG.",
      body: {
        blocks: [
          {
            type: "paragraph",
            text: "EN: Our Energy Monitoring System helps facilities understand usage patterns, reduce waste, and report energy performance with confidence.\nID: Sistem Pemantauan Energi kami membantu fasilitas industri memahami pola penggunaan daya, mengurangi pemborosan, dan melaporkan kinerja efisiensi energi dengan akurat.",
          },
        ],
      },
      category: "EN: Company\nID: Perusahaan",
      featuredImageUrl: "/placeholder.jpg",
      featured: true,
      status: "published",
      publishedAt: "2026-03-18T00:00:00Z",
    },
    {
      id: "news-substation",
      slug: "20mw-substation-commissioning-east-java",
      title: "EN: Successful commissioning of a 20 MW substation in East Java\nID: Sukses Commissioning Gardu Induk 20 MW di Jawa Timur",
      excerpt:
        "EN: Our team completed end-to-end testing, protection coordination, and commissioning for an industrial client.\nID: Tim teknisi kami menyelesaikan pengujian menyeluruh, koordinasi proteksi, dan commissioning untuk klien industri.",
      body: {
        blocks: [
          {
            type: "paragraph",
            text: "EN: The commissioning scope covered protection coordination, testing, and energization support.\nID: Lingkup commissioning mencakup koordinasi proteksi relay, pengujian isolasi, dan dukungan energize bertahap.",
          },
        ],
      },
      category: "EN: Project\nID: Proyek",
      featuredImageUrl: "/placeholder.jpg",
      featured: false,
      status: "published",
      publishedAt: "2026-02-27T00:00:00Z",
    },
  ],
  pagination: { page: 1, perPage: 10, total: 2, totalPages: 1 },
}

export const fallbackCareers: ListResponse<Career> = {
  data: [
    {
      id: "career-senior-electrical",
      slug: "senior-electrical-engineer",
      title: "EN: Senior Electrical Engineer\nID: Senior Electrical Engineer",
      summary: "EN: Lead medium-voltage system design, protection coordination, and commissioning.\nID: Memimpin perancangan sistem tegangan menengah, koordinasi proteksi relay, dan commissioning industri.",
      description: {
        blocks: [{ type: "paragraph", text: "EN: Lead electrical design and commissioning work for industrial clients across Indonesia.\nID: Memimpin pekerjaan perancangan elektrikal dan commissioning untuk klien industri di seluruh Indonesia." }],
      },
      department: "EN: Engineering\nID: Rekayasa Teknik",
      location: "EN: Surabaya, East Java\nID: Surabaya, Jawa Timur",
      employmentType: "full_time",
      applyUrl: "mailto:hr@multidayamitra.co.id",
      status: "published",
      publishedAt: "2026-04-22T00:00:00Z",
    },
    {
      id: "career-automation",
      slug: "automation-engineer-plc-scada",
      title: "EN: Automation Engineer (PLC & SCADA)\nID: Automation Engineer (PLC & SCADA)",
      summary: "EN: Design, program, and integrate PLC, HMI, and SCADA systems.\nID: Merancang, memprogram, dan mengintegrasikan sistem PLC, HMI, serta SCADA industri.",
      description: {
        blocks: [{ type: "paragraph", text: "EN: Build reliable automation systems for power, oil and gas, and manufacturing clients.\nID: Membangun sistem otomasi andal untuk klien sektor kelistrikan, minyak & gas, dan manufaktur." }],
      },
      department: "EN: Engineering\nID: Rekayasa Teknik",
      location: "EN: Surabaya, East Java\nID: Surabaya, Jawa Timur",
      employmentType: "full_time",
      applyUrl: "mailto:hr@multidayamitra.co.id",
      status: "published",
      publishedAt: "2026-04-14T00:00:00Z",
    },
  ],
  pagination: { page: 1, perPage: 10, total: 2, totalPages: 1 },
}

export const fallbackNavigation: Navigation = {
  services: fallbackServices,
  products: fallbackProducts,
  menu: defaultMenuItems,
}

export const fallbackPages: Record<string, PageContent> = {
  about: {
    id: "page-about",
    key: "about",
    title: "EN: About PT Multi Daya Mitra\nID: Tentang PT Multi Daya Mitra",
    status: "published",
    version: 1,
    content: {
      overview:
        "EN: Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.\nID: Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.",
      vision: "EN: Global Electrical, Automation and Fire Alarm Services Company.\nID: Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.",
      mission: "EN: Mutual Partnership and Professionalism in delivering every engineering engagement.\nID: Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.",
      tagline: "EN: Always Make an IMPACT - Powering Solution, Creating Impact\nID: Always Make an IMPACT - Solusi Kelistrikan Andal, Menciptakan Dampak Nyata",
      culture: "EN: The company culture in a professional manner brings the company to move fast in achieving every step of its vision.\nID: Budaya perusahaan yang menjunjung tinggi profesionalisme mendorong gerak cepat perusahaan dalam mewujudkan setiap langkah visinya.",
      established: "2012",
      experienceYears: "14+",
      clientCount: "400+",
      teamCount: "200+",
      values: [
        "EN: Integrity & Innovation\nID: Integritas & Inovasi",
        "EN: Mastery & Intelligent Problem-Solving\nID: Keahlian Teknis & Solusi Cerdas",
        "EN: Professional & Trusted Partnership\nID: Kemitraan Profesional & Terpercaya",
        "EN: Agile & Adaptable Execution\nID: Eksekusi Tangkas & Adaptif",
        "EN: Commitment to Safety & Customer First\nID: Komitmen Keselamatan (K3) & Utamakan Pelanggan",
        "EN: Total Engineering Solutions\nID: Solusi Rekayasa Teknik Menyeluruh"
      ],
      certifications: [
        "ISO 9001:2015 (Quality Management - KAN)",
        "ISO 14001:2015 (Environmental Management)",
        "ISO 45001:2018 (Occupational Health & Safety - KAN)",
        "Ecovadis Silver (Top 15% Global Sustainability)",
        "Avetta Member",
        "SBUJTL & IUJPTL ESDM",
        "Sertifikat Kompetensi Level 6 Tegangan Menengah ESDM",
        "SMK3 Kemenaker",
        "NFPA Member",
        "D&B Rating"
      ],
    },
  },
  contact: {
    id: "page-contact",
    key: "contact",
    title: "Contact PT Multi Daya Mitra",
    status: "published",
    version: 1,
    content: {
      email: "info@multidayamitra.co.id",
      phone: "+62 31 592 1256",
      fax: "+62 31 591 7845",
      salesEmail: "sales@multidayamitra.co.id",
      salesPhone: "+62 811-8303-250",
      whatsappPhone: "+62 811-8303-250",
      hotlinePhone: "+62 811-8303-250",
      offices: [
        {
          name: "Head Office (Surabaya)",
          address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
          phone: "+62 31 592 1256",
          fax: "+62 31 591 7845",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.574636906236!2d112.7747579!3d-7.2854787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbc8a9c411c1%3A0x3f527ebff4e81cdd!2sMulti%20Daya%20Mitra%20PT.!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
        },
        {
          name: "Engineering Office & Workshop",
          address: "Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia",
          phone: "+62 811-8303-250",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1978.1062972986427!2d112.7157486!3d-7.4685927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e74726f32b8d%3A0xf8229e5934963dc6!2sPT.%20Multi%20Daya%20Mitra%20(Workshop)!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
        }
      ],
    },
  },
}

// Analytics feature flags served to the public tracker. Fail closed: if the
// API is unreachable the tracker simply does not mount.
export type AnalyticsPublicConfig = {
  enabled: boolean
  ignoreAdmins: boolean
  respectDnt: boolean
  trackVitals: boolean
  trackEvents: boolean
}

export async function getAnalyticsConfig(): Promise<AnalyticsPublicConfig> {
  return cmsFetch<AnalyticsPublicConfig>(
    "/analytics/config",
    { enabled: false, ignoreAdmins: true, respectDnt: true, trackVitals: false, trackEvents: false },
    86400,
  )
}

// Everything fetched here carries the "cms" tag so admin mutations can
// purge the cache instantly via revalidateTag("cms").
// A SLOW (not down) API must not hang server rendering: after this window the
// page renders from fallback data while the fetch finishes in the background
// (and still populates the data cache for the next request).
const CMS_FETCH_TIMEOUT_MS = 3000

export async function cmsFetch<T>(path: string, fallback: T, revalidate = 86400): Promise<T> {
  try {
    // Promise.race instead of AbortSignal so the fetch options stay untouched
    // and ISR caching (next.revalidate + tags) keeps working as-is.
    const res = await Promise.race([
      fetch(`${API_BASE}${path}`, {
        next: { revalidate, tags: ["cms"] },
        headers: { Accept: "application/json" },
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("cms fetch timeout")), CMS_FETCH_TIMEOUT_MS)
      }),
    ])
    if (!res.ok) return fallback
    return (await res.json()) as T
  } catch {
    return fallback
  }
}

async function cmsListFetch<T>(path: string, fallback: ListResponse<T>, revalidate = 86400): Promise<ListResponse<T>> {
  const response = await cmsFetch<ListResponse<T>>(path, fallback, revalidate)
  const data = Array.isArray(response?.data) ? response.data : []
  const pagination = response?.pagination ?? fallback.pagination

  return {
    data,
    pagination: {
      page: pagination.page ?? fallback.pagination.page,
      perPage: pagination.perPage ?? fallback.pagination.perPage,
      total: pagination.total ?? data.length,
      totalPages: pagination.totalPages ?? Math.max(1, Math.ceil(data.length / Math.max(1, pagination.perPage ?? fallback.pagination.perPage))),
    },
  }
}

export async function getNavigation() {
  return cmsFetch<Navigation>("/navigation", fallbackNavigation)
}

export async function getPage(key: string) {
  return cmsFetch<PageContent | null>(`/pages/${key}`, fallbackPages[key] ?? null)
}

// Global site document edited on the admin Site Settings page (backend
// settings key "site"); feeds the footer and other shared chrome.
export type SiteSettings = {
  tagline: string
  footerDescription: string
  email: string
  phone: string
  fax: string
  address: string
  salesEmail?: string
  salesPhone?: string
  salesPhones?: string[]
  whatsappPhone?: string
  hotlinePhone?: string
  socials: { label: string; url: string; platform?: string }[]
}

export const fallbackSiteSettings: SiteSettings = {
  tagline: "Electrical · Automation · Fire System",
  footerDescription:
    "Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.",
  email: "info@multidayamitra.co.id",
  phone: "+62 31 592 1256",
  fax: "+62 31 591 7845",
  salesEmail: "sales@multidayamitra.co.id",
  salesPhone: "+62 811-8303-250",
  salesPhones: [
    "+62 811-8303-250",
    "+62 821-4007-4122",
    "+62 813-3457-5542",
  ],
  whatsappPhone: "+62 811-8303-250",
  hotlinePhone: "+62 811-8303-250",
  address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
  socials: [
    { label: "Facebook", url: "https://www.facebook.com/multidayamitra/", platform: "facebook" },
    { label: "Instagram", url: "https://www.instagram.com/multidayamitra/", platform: "instagram" },
    { label: "LinkedIn", url: "https://id.linkedin.com/company/pt-multi-daya-mitra", platform: "linkedin" },
    { label: "Technical Expert WhatsApp", url: "https://wa.me/628118303250", platform: "whatsapp" },
  ],
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const response = await cmsFetch<{ site?: Partial<SiteSettings> } | null>("/settings", null)
  const site = response?.site ?? {}
  return {
    tagline: site.tagline ?? fallbackSiteSettings.tagline,
    footerDescription: site.footerDescription ?? fallbackSiteSettings.footerDescription,
    email: site.email ?? fallbackSiteSettings.email,
    phone: site.phone ?? fallbackSiteSettings.phone,
    fax: site.fax ?? fallbackSiteSettings.fax,
    address: site.address ?? fallbackSiteSettings.address,
    salesEmail: site.salesEmail ?? fallbackSiteSettings.salesEmail,
    salesPhone: site.salesPhone ?? fallbackSiteSettings.salesPhone,
    salesPhones: Array.isArray(site.salesPhones) && site.salesPhones.length > 0
      ? site.salesPhones
      : fallbackSiteSettings.salesPhones,
    whatsappPhone: site.whatsappPhone ?? site.salesPhone ?? fallbackSiteSettings.whatsappPhone,
    hotlinePhone: site.hotlinePhone ?? fallbackSiteSettings.hotlinePhone,
    socials: Array.isArray(site.socials)
      ? site.socials.filter(
          (item) => item && typeof item.label === "string" && typeof item.url === "string" && item.label && item.url,
        )
      : fallbackSiteSettings.socials,
  }
}

export type PageFilters = {
  search?: string
  category?: string
  sort?: string
  page?: number
  limit?: number
}

export type NewsFilters = {
  search?: string
  category?: string
  featured?: boolean
  publishedDate?: string
  sort?: string
  page?: number
  limit?: number
}

export type CareerFilters = {
  search?: string
  location?: string
  department?: string
  type?: string
  sort?: string
  page?: number
  limit?: number
}

export type GlobalSearchResults = {
  products: ContentNode[]
  services: ContentNode[]
  careers: Career[]
  news: NewsItem[]
  pages: PageContent[]
}

export async function getServices(): Promise<ContentNode[]>
export async function getServices(filters: PageFilters): Promise<ListResponse<ContentNode>>
export async function getServices(filters?: PageFilters): Promise<ContentNode[] | ListResponse<ContentNode>> {
  if (!filters) {
    return cmsFetch<ContentNode[]>("/services", fallbackServices)
  }
  const query = new URLSearchParams()
  if (filters.search) query.set("search", filters.search)
  if (filters.category) query.set("category", filters.category)
  if (filters.sort) query.set("sort", filters.sort)
  if (filters.page) query.set("page", filters.page.toString())
  if (filters.limit) query.set("limit", filters.limit.toString())

  const queryString = query.toString()
  const path = queryString ? `/services?${queryString}` : "/services"
  return cmsListFetch<ContentNode>(path, createContentFallback(fallbackServices, filters))
}

export async function getService(path: string) {
  const fallback = findByPath(fallbackServices, path)
  return cmsFetch<ContentNode | null>(`/services/${path}`, fallback)
}

function paginateList<T>(data: T[], page = 1, perPage = 10): ListResponse<T> {
  const safePage = Math.max(1, page)
  const safePerPage = Math.max(1, perPage)
  const total = data.length
  const start = (safePage - 1) * safePerPage

  return {
    data: data.slice(start, start + safePerPage),
    pagination: {
      page: safePage,
      perPage: safePerPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / safePerPage)),
    },
  }
}

function createContentFallback(items: ContentNode[], filters?: PageFilters): ListResponse<ContentNode> {
  const search = filters?.search?.trim().toLowerCase() ?? ""
  const category = filters?.category?.trim().toLowerCase() ?? ""
  const page = filters?.page ?? 1
  const perPage = filters?.limit ?? 10

  let data = flattenContent(items).filter((item) => {
    if (category) {
      const itemCategory = item.specs?.category?.toLowerCase()
      const matchesCategory =
        item.slug.toLowerCase() === category ||
        item.fullPath.toLowerCase().includes(category) ||
        itemCategory === category

      if (!matchesCategory) return false
    }

    if (!search) return true
    return searchContentNode(item, search)
  })

  switch (filters?.sort) {
    case "oldest":
      data = [...data].sort((a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""))
      break
    case "alpha_asc":
      data = [...data].sort((a, b) => a.title.localeCompare(b.title))
      break
    case "alpha_desc":
      data = [...data].sort((a, b) => b.title.localeCompare(a.title))
      break
    default:
      data = [...data].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      break
  }

  return paginateList(data, page, perPage)
}

export async function getProducts(): Promise<ContentNode[]>
export async function getProducts(filters: PageFilters): Promise<ListResponse<ContentNode>>
export async function getProducts(filters?: PageFilters): Promise<ContentNode[] | ListResponse<ContentNode>> {
  if (!filters) {
    return cmsFetch<ContentNode[]>("/products", fallbackProducts)
  }
  const query = new URLSearchParams()
  if (filters.search) query.set("search", filters.search)
  if (filters.category) query.set("category", filters.category)
  if (filters.sort) query.set("sort", filters.sort)
  if (filters.page) query.set("page", filters.page.toString())
  if (filters.limit) query.set("limit", filters.limit.toString())

  const queryString = query.toString()
  const path = queryString ? `/products?${queryString}` : "/products"
  return cmsListFetch<ContentNode>(path, createContentFallback(fallbackProducts, filters))
}

export async function getProduct(path: string) {
  const fallback = findByPath(fallbackProducts, path)
  return cmsFetch<ContentNode | null>(`/products/${path}`, fallback)
}

function normalizeFilterValue(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

function newsMatchesCategory(item: NewsItem, category: string) {
  if (!item.category) return false
  const current = item.category.trim().toLowerCase()
  const normalizedItem = normalizeFilterValue(item.category)
  const normalizedCategory = normalizeFilterValue(category)
  const requested = category.trim().toLowerCase()
  return (
    current === requested ||
    normalizedItem === normalizedCategory ||
    normalizedItem === requested ||
    current === normalizedCategory ||
    normalizedItem.includes(normalizedCategory) ||
    normalizedCategory.includes(normalizedItem)
  )
}

function createNewsFallback(filters?: NewsFilters): ListResponse<NewsItem> {
  const page = filters?.page ?? 1
  const perPage = filters?.limit ?? 9
  const search = filters?.search?.trim().toLowerCase() ?? ""
  const category = filters?.category?.trim() ?? ""
  const publishedDate = filters?.publishedDate?.trim() ?? ""

  let data = fallbackNews.data.filter((item) => {
    if (category && !newsMatchesCategory(item, category)) return false
    if (filters?.featured !== undefined && item.featured !== filters.featured) return false
    if (publishedDate && !item.publishedAt?.startsWith(publishedDate)) return false
    if (!search) return true

    const bodyText = item.body?.blocks?.map((block) => block.text).join(" ") ?? ""
    const searchable = [
      item.title,
      item.excerpt,
      bodyText,
      item.category,
      ...(item.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return searchable.includes(search)
  })

  switch (filters?.sort) {
    case "oldest":
      data = [...data].sort((a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""))
      break
    case "alpha_asc":
      data = [...data].sort((a, b) => a.title.localeCompare(b.title))
      break
    case "alpha_desc":
      data = [...data].sort((a, b) => b.title.localeCompare(a.title))
      break
    case "featured":
      data = [...data].sort((a, b) => Number(b.featured) - Number(a.featured))
      break
    default:
      data = [...data].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      break
  }

  const total = data.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const start = (Math.max(1, page) - 1) * perPage

  return {
    data: data.slice(start, start + perPage),
    pagination: { page: Math.max(1, page), perPage, total, totalPages },
  }
}

export async function getNews(filters?: NewsFilters) {
  const query = new URLSearchParams()
  const page = filters?.page ?? 1
  const limit = filters?.limit ?? 9
  query.set("page", page.toString())
  query.set("perPage", limit.toString())
  if (filters?.search) query.set("search", filters.search)
  if (filters?.category) query.set("category", filters.category)
  if (filters?.featured !== undefined) query.set("featured", filters.featured.toString())
  if (filters?.publishedDate) query.set("publishedDate", filters.publishedDate)
  if (filters?.sort) query.set("sort", filters.sort)

  return cmsListFetch<NewsItem>(`/news?${query.toString()}`, createNewsFallback(filters))
}

export async function getNewsItem(slug: string) {
  const fallback = fallbackNews.data.find((item) => item.slug === slug) ?? null
  return cmsFetch<NewsItem | null>(`/news/${slug}`, fallback)
}

function createCareerFallback(filters?: CareerFilters): ListResponse<Career> {
  const search = filters?.search?.trim().toLowerCase() ?? ""
  const location = filters?.location?.trim().toLowerCase() ?? ""
  const department = filters?.department?.trim().toLowerCase() ?? ""
  const employmentType = filters?.type?.trim().toLowerCase() ?? ""

  let data = fallbackCareers.data.filter((item) => {
    if (location && !item.location.toLowerCase().includes(location)) return false
    if (department && !item.department.toLowerCase().includes(department)) return false
    if (employmentType && item.employmentType.toLowerCase() !== employmentType) return false
    return !search || searchCareer(item, search)
  })

  switch (filters?.sort) {
    case "oldest":
      data = [...data].sort((a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? ""))
      break
    case "alpha_asc":
      data = [...data].sort((a, b) => a.title.localeCompare(b.title))
      break
    case "alpha_desc":
      data = [...data].sort((a, b) => b.title.localeCompare(a.title))
      break
    default:
      data = [...data].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
      break
  }

  return paginateList(data, filters?.page ?? 1, filters?.limit ?? 20)
}

export async function getCareers(filters?: CareerFilters) {
  const query = new URLSearchParams()
  const page = filters?.page ?? 1
  const limit = filters?.limit ?? 20
  query.set("page", page.toString())
  query.set("perPage", limit.toString())
  if (filters?.search) query.set("search", filters.search)
  if (filters?.location) query.set("location", filters.location)
  if (filters?.department) query.set("department", filters.department)
  if (filters?.type) query.set("type", filters.type)
  if (filters?.sort) query.set("sort", filters.sort)

  const fallback = createCareerFallback(filters)
  return cmsListFetch<Career>(`/careers?${query.toString()}`, fallback)
}

export async function getCareer(slug: string) {
  const fallback = fallbackCareers.data.find((item) => item.slug === slug) ?? null
  return cmsFetch<Career | null>(`/careers/${slug}`, fallback)
}

export async function getPages(filters?: PageFilters) {
  const query = new URLSearchParams()
  if (filters?.search) query.set("search", filters.search)
  if (filters?.category) query.set("category", filters.category)
  if (filters?.sort) query.set("sort", filters.sort)
  if (filters?.page) query.set("page", filters.page.toString())
  if (filters?.limit) query.set("limit", filters.limit.toString())

  const queryString = query.toString()
  const path = queryString ? `/pages?${queryString}` : "/pages"
  const allPages = Object.values(fallbackPages)
  const search = filters?.search?.trim().toLowerCase() ?? ""
  const category = filters?.category?.trim().toLowerCase() ?? ""
  const filteredPages = allPages.filter((page) => {
    if (category && String(page.content.category ?? "").toLowerCase() !== category) return false
    if (!search) return true
    return [page.title, page.key, JSON.stringify(page.content)]
      .join(" ")
      .toLowerCase()
      .includes(search)
  })
  const defaultFallback = paginateList(filteredPages, filters?.page ?? 1, filters?.limit ?? 10)
  return cmsListFetch<PageContent>(path, defaultFallback)
}

function searchContentNode(item: ContentNode, search: string) {
  return [
    item.title,
    item.summary,
    item.fullPath,
    JSON.stringify(item.content ?? {}),
    JSON.stringify(item.specs ?? {}),
  ]
    .join(" ")
    .toLowerCase()
    .includes(search)
}

function searchCareer(item: Career, search: string) {
  return [
    item.title,
    item.summary,
    item.department,
    item.location,
    item.employmentType,
    JSON.stringify(item.description ?? {}),
  ]
    .join(" ")
    .toLowerCase()
    .includes(search)
}

function searchPage(item: PageContent, search: string) {
  return [item.title, item.key, JSON.stringify(item.content)].join(" ").toLowerCase().includes(search)
}

export async function globalSearch(q: string) {
  const search = q.trim().toLowerCase()
  const fallbackProductsFlat = flattenContent(fallbackProducts)
  const fallbackServicesFlat = flattenContent(fallbackServices)
  const defaultFallback: GlobalSearchResults = {
    products: search ? fallbackProductsFlat.filter((item) => searchContentNode(item, search)) : [],
    services: search ? fallbackServicesFlat.filter((item) => searchContentNode(item, search)) : [],
    careers: search ? fallbackCareers.data.filter((item) => searchCareer(item, search)) : [],
    news: search ? createNewsFallback({ search, limit: fallbackNews.data.length }).data : [],
    pages: search ? Object.values(fallbackPages).filter((item) => searchPage(item, search)) : []
  }
  if (!search) return defaultFallback
  const response = await cmsFetch<GlobalSearchResults>(`/search?q=${encodeURIComponent(q)}`, defaultFallback)
  return {
    products: Array.isArray(response?.products) ? response.products : [],
    services: Array.isArray(response?.services) ? response.services : [],
    careers: Array.isArray(response?.careers) ? response.careers : [],
    news: Array.isArray(response?.news) ? response.news : [],
    pages: Array.isArray(response?.pages) ? response.pages : [],
  }
}

export function flattenContent(items: ContentNode[]): ContentNode[] {
  return items.flatMap((item) => [item, ...flattenContent(item.children ?? [])])
}

export function formatDate(value?: string) {
  if (!value) return "Unscheduled"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unscheduled"
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(date)
}

export function isCareerClosed(career?: Career | null): boolean {
  if (!career) return false
  if (career.status === "archived" || career.status === "closed") return true
  if (career.deadline) {
    const deadlineTime = new Date(career.deadline).getTime()
    if (!Number.isNaN(deadlineTime) && deadlineTime < Date.now()) {
      return true
    }
  }
  return false
}

export function employmentTypeLabel(value: string) {
  const normalized = value.toLowerCase().replace(/[- ]/g, "_")
  if (normalized === "full_time") return "EN: Full Time\nID: Penuh Waktu"
  if (normalized === "part_time") return "EN: Part Time\nID: Paruh Waktu"
  if (normalized === "contract") return "EN: Contract\nID: Kontrak"
  if (normalized === "internship") return "EN: Internship\nID: Magang"
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function findNodeInTree(items: ContentNode[], path: string): ContentNode | null {
  for (const item of items) {
    if (item.fullPath === path) return item
    if (item.children && item.children.length > 0) {
      const found = findNodeInTree(item.children, path)
      if (found) return found
    }
  }
  return null
}

function findByPath(items: ContentNode[], path: string): ContentNode | null {
  return flattenContent(items).find((item) => item.fullPath === path) ?? null
}

// Resolves the dynamic data (services/products/news) a sections page needs,
// fetching only the sources its contentGrid sections reference.
export async function resolveSectionData(
  sections: Array<{ type: string; props: Record<string, unknown> }>,
): Promise<{ services: ContentNode[]; products: ContentNode[]; news: NewsItem[] }> {
  const sources = new Set(
    sections
      .filter((section) => section.type === "contentGrid")
      .map((section) => String(section.props.source ?? "services")),
  )
  if (sections.some((section) => section.type === "servicesShowcase")) {
    sources.add("services")
  }

  const [services, products, news] = await Promise.all([
    sources.has("services") ? getServices() : Promise.resolve([]),
    sources.has("products") ? getProducts() : Promise.resolve([]),
    sources.has("news") ? getNews({ limit: 12 }).then((response) => response.data) : Promise.resolve([]),
  ])

  return { services, products, news }
}

// Fetches every dynamic source, for contexts (like the admin builder preview)
// that can't know in advance which sources the sections will use.
export async function resolveAllSectionData() {
  const [services, products, news] = await Promise.all([
    getServices(),
    getProducts(),
    getNews({ limit: 12 }).then((response) => response.data),
  ])
  return { services, products, news }
}
