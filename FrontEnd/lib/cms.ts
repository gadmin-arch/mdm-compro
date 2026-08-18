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
  { id: "home", label: "Home", href: "/", kind: "system", visible: true },
  { id: "about", label: "About Us", href: "/about", kind: "system", visible: true },
  { id: "services", label: "Services", href: "/services", kind: "system", auto: "services", visible: true },
  { id: "products", label: "Products", href: "/products", kind: "system", auto: "products", visible: true },
  { id: "news", label: "News", href: "/news", kind: "system", visible: true },
  { id: "career", label: "Careers", href: "/career", kind: "system", visible: true },
  { id: "contact", label: "Contact Us", href: "/contact", kind: "system", visible: true },
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
    title: "Electrical Construction & Installation",
    summary: "Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.",
    imageUrl: "/uploads/mdm/construction-installation.jpg",
    status: "published",
    sortOrder: 1,
    depth: 0,
    children: [
      {
        id: "serv-substation-installation",
        slug: "substation-mv-switchgear-installation",
        fullPath: "electrical-construction-installation/substation-mv-switchgear-installation",
        title: "Substation & MV Switchgear Installation",
        summary: "Medium voltage metal-clad switchgear, power transformers, and substation integration up to 36kV.",
        imageUrl: "/uploads/mdm/medium-voltage-equipment.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-lv-panel-assembly",
        slug: "lv-distribution-panels-assembly",
        fullPath: "electrical-construction-installation/lv-distribution-panels-assembly",
        title: "LV Panels Assembly (MDP, SDP, ATS & Sync)",
        summary: "Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).",
        imageUrl: "/uploads/mdm/circuit-breaker.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-cabling-termination",
        slug: "mv-lv-cable-installation-termination",
        fullPath: "electrical-construction-installation/mv-lv-cable-installation-termination",
        title: "MV & LV Cable Installation & Termination",
        summary: "Certified cable pulling, tray erection, heat/cold shrink terminations, and high-potential (Hi-Pot) insulation testing.",
        imageUrl: "/uploads/mdm/electrical-equipment.jpg",
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
      {
        id: "serv-fire-alarm-install",
        slug: "fire-alarm-system-installation",
        fullPath: "electrical-construction-installation/fire-alarm-system-installation",
        title: "Fire Alarm System Engineering & Installation",
        summary: "Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.",
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
    title: "Electrical Maintenance & Servicing",
    summary: "Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.",
    imageUrl: "/uploads/mdm/maintenance-contract.jpg",
    status: "published",
    sortOrder: 2,
    depth: 0,
    children: [
      {
        id: "serv-transformer-oil-dga",
        slug: "transformer-oil-treatment-dga",
        fullPath: "electrical-maintenance-service/transformer-oil-treatment-dga",
        title: "Transformer Oil Treatment, BDV & DGA",
        summary: "On-site oil purification, vacuum degassing, breakdown voltage (BDV) testing, and Dissolved Gas Analysis (DGA).",
        imageUrl: "/uploads/mdm/micrologic-test.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-mv-acb-maintenance",
        slug: "mv-cubicle-acb-maintenance",
        fullPath: "electrical-maintenance-service/mv-cubicle-acb-maintenance",
        title: "MV Cubicle & ACB Maintenance (Trip Testing)",
        summary: "Preventive servicing for medium voltage switchgear, contact resistance (Ductor), and ACB secondary injection.",
        imageUrl: "/uploads/mdm/preventive-maintenance.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-thermography",
        slug: "thermography-predictive-maintenance",
        fullPath: "electrical-maintenance-service/thermography-predictive-maintenance",
        title: "Infrared Thermography & Predictive Maintenance",
        summary: "Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, and overloaded phases under full load.",
        imageUrl: "/uploads/mdm/infrared-thermograph.jpg",
        status: "published",
        sortOrder: 3,
        depth: 1,
      },
      {
        id: "serv-amc-contracts",
        slug: "annual-maintenance-contracts",
        fullPath: "electrical-maintenance-service/annual-maintenance-contracts",
        title: "Annual Maintenance Contracts (AMC) & 24/7 SLA",
        summary: "Customized long-term service level agreements providing scheduled shutdowns, emergency call-outs, and spare parts management.",
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
    title: "Automation Solutions & Services",
    summary: "Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.",
    imageUrl: "/uploads/mdm/industrial-automation.jpg",
    status: "published",
    sortOrder: 3,
    depth: 0,
    children: [
      {
        id: "serv-scada-hmi",
        slug: "scada-hmi-process-monitoring",
        fullPath: "automation-solutions-services/scada-hmi-process-monitoring",
        title: "SCADA Systems, HMI & Centralized Telemetry",
        summary: "Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and industrial telemetry.",
        imageUrl: "/uploads/xarrow.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-energy-management",
        slug: "energy-management-iso50001",
        fullPath: "automation-solutions-services/energy-management-iso50001",
        title: "Energy Management Systems (EMS & ISO 50001)",
        summary: "Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG compliance reporting.",
        imageUrl: "/uploads/PMS-Network_001.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-plc-vsd",
        slug: "plc-vsd-system-integration",
        fullPath: "automation-solutions-services/plc-vsd-system-integration",
        title: "PLC Programming & Variable Speed Drive (VSD) Integration",
        summary: "Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.",
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
    title: "Inspection, Testing & Commissioning",
    summary: "Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.",
    imageUrl: "/uploads/mdm/testing-measurement.jpg",
    status: "published",
    sortOrder: 4,
    depth: 0,
    children: [
      {
        id: "serv-power-quality-study",
        slug: "power-quality-analysis-study",
        fullPath: "inspection-testing-commissioning/power-quality-analysis-study",
        title: "Power Quality Analysis & Harmonics Study",
        summary: "Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, and mitigation design.",
        imageUrl: "/uploads/mdm/power-quality.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-pd-scan",
        slug: "partial-discharge-pd-scan",
        fullPath: "inspection-testing-commissioning/partial-discharge-pd-scan",
        title: "Partial Discharge (PD) Scan & Insulation Diagnostics",
        summary: "Non-invasive TEV, acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.",
        imageUrl: "/uploads/mdm/partial-discharge.jpg",
        status: "published",
        sortOrder: 2,
        depth: 1,
      },
      {
        id: "serv-relay-protection",
        slug: "relay-protection-testing-commissioning",
        fullPath: "inspection-testing-commissioning/relay-protection-testing-commissioning",
        title: "Protection Relay Testing (Secondary Injection)",
        summary: "3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.",
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
    title: "Mechanical Services & General Supplies",
    summary: "Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.",
    imageUrl: "/uploads/mdm/electrical-services.jpg",
    status: "published",
    sortOrder: 5,
    depth: 0,
    children: [
      {
        id: "serv-mechanical-supplies-items",
        slug: "industrial-mechanical-supplies-services",
        fullPath: "mechanical-services-supplies/industrial-mechanical-supplies-services",
        title: "Conveyor Systems, Magnetic Separators & Industrial Supplies",
        summary: "Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.",
        imageUrl: "/uploads/mdm/construction-installation.jpg",
        status: "published",
        sortOrder: 1,
        depth: 1,
      },
      {
        id: "serv-motor-overhaul",
        slug: "motor-generator-servicing-overhaul",
        fullPath: "mechanical-services-supplies/motor-generator-servicing-overhaul",
        title: "Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)",
        summary: "Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.",
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
    title: "Rittal Authorized Distributor",
    summary: "Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, power distribution, and IT infrastructure systems.",
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
        title: "Rittal Enclosure Systems (VX25, AX, KX)",
        summary: "Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.",
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
        title: "Rittal Climate Control & Cooling (Blue e+)",
        summary: "Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.",
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
        title: "Rittal Power Distribution (Ri4Power & RiLine)",
        summary: "Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.",
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
    title: "Schneider Electric System Integrator",
    summary: "Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.",
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
        title: "Schneider Industrial Automation (Modicon & EcoStruxure)",
        summary: "Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.",
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
        title: "Power & Energy Monitoring (PME & PowerLogic)",
        summary: "Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.",
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
        title: "Electrical Distribution Integration (MasterPact & Prisma)",
        summary: "MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.",
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
        title: "Schneider Engineering, FAT/SAT & Commissioning Support",
        summary: "Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.",
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
    title: "Electrical Distribution",
    summary: "Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.",
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
    title: "Automation & Control",
    summary: "Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.",
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
    title: "Enclosure & Climate Control",
    summary: "Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.",
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
    title: "Power Quality",
    summary: "Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.",
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
    title: "Fire Alarm Products",
    summary: "Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions from Bosch Building Technologies.",
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
      title: "Launching our Energy Monitoring System for ESG-ready facilities",
      excerpt:
        "A turnkey solution helps plants track real-time consumption and produce ESG-grade sustainability reports.",
      body: {
        blocks: [
          {
            type: "paragraph",
            text: "Our Energy Monitoring System helps facilities understand usage patterns, reduce waste, and report energy performance with confidence.",
          },
        ],
      },
      category: "Company",
      featuredImageUrl: "/placeholder.jpg",
      featured: true,
      status: "published",
      publishedAt: "2026-03-18T00:00:00Z",
    },
    {
      id: "news-substation",
      slug: "20mw-substation-commissioning-east-java",
      title: "Successful commissioning of a 20 MW substation in East Java",
      excerpt:
        "Our team completed end-to-end testing, protection coordination, and commissioning for an industrial client.",
      body: {
        blocks: [
          {
            type: "paragraph",
            text: "The commissioning scope covered protection coordination, testing, and energization support.",
          },
        ],
      },
      category: "Project",
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
      title: "Senior Electrical Engineer",
      summary: "Lead medium-voltage system design, protection coordination, and commissioning.",
      description: {
        blocks: [{ type: "paragraph", text: "Lead electrical design and commissioning work for industrial clients." }],
      },
      department: "Engineering",
      location: "Surabaya, East Java",
      employmentType: "full_time",
      applyUrl: "mailto:hr@multidayamitra.co.id",
      status: "published",
      publishedAt: "2026-04-22T00:00:00Z",
    },
    {
      id: "career-automation",
      slug: "automation-engineer-plc-scada",
      title: "Automation Engineer (PLC & SCADA)",
      summary: "Design, program, and integrate PLC, HMI, and SCADA systems.",
      description: {
        blocks: [{ type: "paragraph", text: "Build reliable automation systems for power, oil and gas, and manufacturing clients." }],
      },
      department: "Engineering",
      location: "Surabaya, East Java",
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
    title: "About PT Multi Daya Mitra",
    status: "published",
    version: 1,
    content: {
      overview:
        "Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.",
      vision: "Global Electrical, Automation and Fire Alarm Services Company.",
      mission: "Mutual Partnership and Professionalism in delivering every engineering engagement.",
      tagline: "Always Make an IMPACT - Powering Solution, Creating Impact",
      culture: "The company culture in a professional manner brings the company to move fast in achieving every step of its vision.",
      established: "2012",
      experienceYears: "14+",
      clientCount: "400+",
      teamCount: "200+",
      values: [
        "Integrity & Innovation",
        "Mastery & Intelligent Problem-Solving",
        "Professional & Trusted Partnership",
        "Agile & Adaptable Execution",
        "Commitment to Safety & Customer First",
        "Total Engineering Solutions"
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
      salesPhone: "+62 821-4007-4122",
      whatsappPhone: "+62 821-4007-4122",
      hotlinePhone: "+62 821-4007-4122",
      offices: [
        {
          name: "Head Office (Surabaya)",
          address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
          phone: "+62 31 592 1256",
          fax: "+62 31 591 7845",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
        },
        {
          name: "Engineering Office & Workshop",
          address: "Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia",
          phone: "+62 821-4007-4122",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
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
    60,
  )
}

// Everything fetched here carries the "cms" tag so admin mutations can
// purge the cache instantly via revalidateTag("cms").
// A SLOW (not down) API must not hang server rendering: after this window the
// page renders from fallback data while the fetch finishes in the background
// (and still populates the data cache for the next request).
const CMS_FETCH_TIMEOUT_MS = 3000

export async function cmsFetch<T>(path: string, fallback: T, revalidate = 300): Promise<T> {
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

async function cmsListFetch<T>(path: string, fallback: ListResponse<T>, revalidate = 300): Promise<ListResponse<T>> {
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
  salesPhone: "+62 821-4007-4122",
  whatsappPhone: "+62 821-4007-4122",
  hotlinePhone: "+62 821-4007-4122",
  address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
  socials: [
    { label: "WhatsApp Sales", url: "https://wa.me/6282140074122", platform: "whatsapp" },
    { label: "LinkedIn", url: "https://id.linkedin.com/company/pt-multi-daya-mitra", platform: "linkedin" },
    { label: "Instagram", url: "https://www.instagram.com/multidayamitra/", platform: "instagram" }
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
  return value.trim().toLowerCase().replace(/\s+/g, "-")
}

function newsMatchesCategory(item: NewsItem, category: string) {
  if (!item.category) return false
  const current = item.category.trim().toLowerCase()
  const normalized = normalizeFilterValue(item.category)
  const requested = category.trim().toLowerCase()
  return current === requested || normalized === requested
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
