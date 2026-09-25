// Section catalog shared by the public renderer and the admin page builder.
// A CMS page stores `content.sections` as Section[]; every entry maps to a
// React section component via components/cms/section-renderer.tsx.

export const SECTION_ICON_NAMES = [
  "zap",
  "cpu",
  "bell-ring",
  "shield-check",
  "award",
  "users",
  "headphones",
  "factory",
  "building",
  "wrench",
  "flame",
  "droplets",
  "network",
  "cog",
  "target",
  "compass",
  "handshake",
  "check-circle",
  "lightbulb",
  "trending-up",
  "flask",
  "pill",
  "wheat",
  "utensils",
  "layers",
  "hard-hat",
  "clipboard-list",
  "hammer",
  "shield",
  "activity",
  "microscope",
  "search",
  "stethoscope",
  "settings",
] as const

export type SectionIconName = (typeof SECTION_ICON_NAMES)[number]

export type Section = {
  id: string
  type: string
  props: Record<string, unknown>
}

export type FieldOption = { value: string; label: string }

export type FieldDef =
  | { kind: "text"; name: string; label: string; placeholder?: string }
  | { kind: "textarea"; name: string; label: string; placeholder?: string }
  | { kind: "lines"; name: string; label: string; placeholder?: string }
  | { kind: "image"; name: string; label: string }
  | { kind: "toggle"; name: string; label: string }
  | { kind: "number"; name: string; label: string; min?: number; max?: number }
  | { kind: "select"; name: string; label: string; options: FieldOption[] }
  | { kind: "icon"; name: string; label: string }
  | { kind: "richtext"; name: string; label: string }
  | { kind: "list"; name: string; label: string; itemLabel: string; fields: FieldDef[]; max?: number }

export type SectionDef = {
  type: string
  label: string
  description: string
  icon: string
  fields: FieldDef[]
  defaults: Record<string, unknown>
}

const linkFields = (prefix: string, label: string): FieldDef[] => [
  { kind: "text", name: `${prefix}Label`, label: `${label} label` },
  { kind: "text", name: `${prefix}Href`, label: `${label} link`, placeholder: "/contact" },
]

export const sectionDefs: SectionDef[] = [
  {
    type: "hero",
    label: "Hero (Homepage)",
    description: "Full hero with headline, CTAs, stats, and image card.",
    icon: "sparkles",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow badge" },
      { kind: "textarea", name: "title", label: "Headline" },
      { kind: "text", name: "highlight", label: "Highlighted word in headline" },
      { kind: "textarea", name: "description", label: "Description" },
      ...linkFields("primary", "Primary button"),
      ...linkFields("secondary", "Secondary button"),
      { kind: "image", name: "imageUrl", label: "Hero image" },
      { kind: "text", name: "imageAlt", label: "Image alt text" },
      {
        kind: "list",
        name: "stats",
        label: "Stats row",
        itemLabel: "Stat",
        max: 4,
        fields: [
          { kind: "text", name: "label", label: "Label" },
          { kind: "text", name: "value", label: "Value" },
        ],
      },
      { kind: "text", name: "cardEyebrow", label: "Floating card eyebrow" },
      { kind: "textarea", name: "cardTitle", label: "Floating card text" },
    ],
    defaults: {
      eyebrow: "EN: Trusted partner since 2012\nID: Mitra Terpercaya Sejak 2012",
      title: "EN: Powering industry with reliable electrical & automation services.\nID: Menggerakkan industri dengan layanan kelistrikan & otomasi yang andal.",
      highlight: "EN: reliable\nID: andal",
      description:
        "EN: PT Multi Daya Mitra delivers end-to-end electrical, industrial automation, and fire alarm solutions with 14+ years of engineering experience across Indonesia and beyond.\nID: PT Multi Daya Mitra menghadirkan solusi menyeluruh untuk kelistrikan, otomasi industri, dan proteksi kebakaran dengan lebih dari 14 tahun pengalaman rekayasa di Indonesia dan mancanegara.",
      primaryLabel: "EN: Start a Project\nID: Mulai Proyek",
      primaryHref: "/contact",
      secondaryLabel: "EN: Explore Services\nID: Jelajahi Layanan",
      secondaryHref: "/services",
      imageUrl: "/uploads/hero-project.jpg",
      imageAlt: "Engineer inspecting medium voltage substation switchgear",
      stats: [
        { label: "EN: Established\nID: Didirikan", value: "2012" },
        { label: "EN: Corporate Clients\nID: Klien Korporat", value: "400+" },
        { label: "EN: Certified Team\nID: Tim Tersertifikasi", value: "ISO & ESDM" },
      ],
      cardEyebrow: "EN: Now offering\nID: Layanan Terbaru",
      cardTitle: "EN: Energy Monitoring System for Sustainability & ESG Reporting\nID: Sistem Monitoring Energi untuk Keberlanjutan & Pelaporan ESG",
    },
  },
  {
    type: "pageHero",
    label: "Page Header",
    description: "Dark page header with eyebrow, title, and description.",
    icon: "panel-top",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
    ],
    defaults: {
      eyebrow: "EN: Page\nID: Halaman",
      title: "EN: Page title\nID: Judul Halaman",
      description: "",
    },
  },
  {
    type: "imageText",
    label: "Image + Text",
    description: "Image beside rich copy with optional bullets and CTA.",
    icon: "image",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "body", label: "Body (blank line = new paragraph)" },
      { kind: "lines", name: "bullets", label: "Bullet points (one per line)" },
      { kind: "image", name: "imageUrl", label: "Image" },
      { kind: "text", name: "imageAlt", label: "Image alt text" },
      {
        kind: "select",
        name: "imagePosition",
        label: "Image position",
        options: [
          { value: "left", label: "Image left" },
          { value: "right", label: "Image right" },
        ],
      },
      ...linkFields("cta", "CTA"),
    ],
    defaults: {
      eyebrow: "EN: About the company\nID: Tentang Perusahaan",
      title: "EN: A team built for your most demanding projects.\nID: Tim yang siap menangani proyek paling menantang Anda.",
      body: "EN: Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.\nID: Didirikan pada tahun 2013, PT Multi Daya Mitra menyediakan solusi kelistrikan, otomasi, dan sistem proteksi kebakaran di seluruh Indonesia.",
      bullets: [],
      imageUrl: "/placeholder.jpg",
      imageAlt: "",
      imagePosition: "left",
      ctaLabel: "",
      ctaHref: "",
    },
  },
  {
    type: "aboutIntro",
    label: "About Intro",
    description: "Company intro with image, story, and vision/mission/culture cards.",
    icon: "building",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "overview", label: "Opening paragraph" },
      { kind: "textarea", name: "body", label: "Second paragraph" },
      { kind: "image", name: "imageUrl", label: "Image" },
      { kind: "text", name: "imageAlt", label: "Image alt text" },
      { kind: "textarea", name: "vision", label: "Vision" },
      { kind: "textarea", name: "mission", label: "Mission" },
      { kind: "textarea", name: "culture", label: "Culture" },
    ],
    defaults: {
      eyebrow: "EN: About the company\nID: Tentang Perusahaan",
      title: "EN: A team built for your most demanding electrical projects.\nID: Tim berpengalaman untuk proyek kelistrikan paling krusial Anda.",
      overview:
        "EN: Established in 2012, PT Multi Daya Mitra was founded by a group of seasoned engineers with deep expertise in electricity, industrial automation, fire alarm systems, and mechanical works.\nID: Didirikan pada tahun 2012, PT Multi Daya Mitra dibangun oleh para insinyur berpengalaman dengan keahlian mendalam di bidang kelistrikan, otomasi industri, sistem proteksi kebakaran, dan mekanikal.",
      body:
        "EN: We have grown into one of the largest electrical service partners in East Java with over 400 clients and 200+ professionals — delivering projects across Indonesia and on selected overseas assignments. Our company culture of professional discipline drives every milestone, and we are certified to ISO 9001, ISO 14001, ISO 45001, Ecovadis Silver, and SMK3.\nID: Kami telah berkembang menjadi salah satu mitra jasa kelistrikan terbesar di Jawa Timur dengan lebih dari 400 klien dan 200+ profesional — menangani proyek di seluruh Indonesia dan penugasan luar negeri terpilih. Budaya disiplin profesional kami mendorong setiap pencapaian, didukung sertifikasi ISO 9001, ISO 14001, ISO 45001, Ecovadis Silver, dan SMK3.",
      imageUrl: "/placeholder.jpg",
      imageAlt: "Industrial automation control room with engineers monitoring SCADA systems",
      vision: "EN: Global Electrical, Automation and Fire Alarm Services Company.\nID: Perusahaan Layanan Kelistrikan, Otomasi, dan Proteksi Kebakaran Berstandar Global.",
      mission: "EN: Mutual Partnership and Professionalism in delivering every engineering engagement.\nID: Kemitraan Strategis dan Profesionalisme Tinggi dalam Menghadirkan Solusi Rekayasa.",
      culture:
        "EN: A professional, fast-moving organization driven by certified engineers (AK3 Listrik, AK3 Umum, AK3 Kebakaran), structured processes, and an uncompromising commitment to safety (Saya Pilih Selamat).\nID: Organisasi profesional dan tangkas yang digerakkan oleh insinyur bersertifikasi (AK3 Listrik, AK3 Umum, AK3 Kebakaran), proses terstruktur, serta komitmen keselamatan tanpa kompromi (Saya Pilih Selamat).",
    },
  },
  {
    type: "offices",
    label: "Office Locations",
    description: "Office cards with address, contacts, and an embedded map.",
    icon: "compass",
    fields: [
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
      {
        kind: "list",
        name: "items",
        label: "Offices",
        itemLabel: "Office",
        fields: [
          { kind: "text", name: "name", label: "Office name" },
          { kind: "textarea", name: "address", label: "Address" },
          { kind: "text", name: "phone", label: "Phone" },
          { kind: "text", name: "fax", label: "Fax" },
          { kind: "text", name: "email", label: "Email" },
          {
            kind: "text",
            name: "mapEmbedUrl",
            label: "Google Maps Embed URL (iframe src)",
            placeholder: "https://www.google.com/maps/embed?pb=...",
          },
        ],
      },
    ],
    defaults: {
      title: "EN: Our Offices\nID: Lokasi Kantor Kami",
      description: "EN: Find our physical offices across Indonesia.\nID: Temukan jaringan kantor fisik kami di seluruh Indonesia.",
      items: [
        {
          name: "EN: Head Office (Surabaya)\nID: Kantor Pusat (Surabaya)",
          address: "EN: Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia\nID: Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, Jawa Timur, Indonesia",
          phone: "+62 31 592 1256",
          fax: "+62 31 591 7845",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.574636906236!2d112.7747579!3d-7.2854787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbc8a9c411c1%3A0x3f527ebff4e81cdd!2sMulti%20Daya%20Mitra%20PT.!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid",
        },
        {
          name: "EN: Engineering Office & Workshop\nID: Kantor Rekayasa & Workshop",
          address: "EN: Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia\nID: Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, Jawa Timur, Indonesia",
          phone: "+62 811-8303-250 · +62 821-4007-4122",
          fax: "",
          email: "sales@multidayamitra.co.id",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1978.1062972986427!2d112.7157486!3d-7.4685927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e74726f32b8d%3A0xf8229e5934963dc6!2sPT.%20Multi%20Daya%20Mitra%20(Workshop)!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid",
        },
      ],
    },
  },
  {
    type: "contact",
    label: "Contact & Inquiry",
    description: "Interactive inquiry form, quick contact channels, and office location details.",
    icon: "mail",
    fields: [
      { kind: "text", name: "email", label: "Email", placeholder: "info@multidayamitra.co.id" },
      { kind: "text", name: "phone", label: "General Phone", placeholder: "+62 31 592 1256" },
      { kind: "text", name: "salesPhone", label: "Sales Hotline", placeholder: "+62 821-4007-4122" },
      { kind: "text", name: "technicalPhone", label: "Technical Phone", placeholder: "+62 811-8303-250" },
    ],
    defaults: {
      email: "info@multidayamitra.co.id",
      phone: "+62 31 592 1256",
      salesPhone: "+62 821-4007-4122",
      technicalPhone: "+62 811-8303-250",
    },
  },
  {
    type: "about",
    label: "About & Credentials",
    description: "Company overview, IMPACT values, ISO certifications, licensed experts, testing fleet, and partnerships.",
    icon: "building-2",
    fields: [
      { kind: "textarea", name: "overview", label: "Overview" },
      { kind: "textarea", name: "vision", label: "Vision" },
      { kind: "textarea", name: "mission", label: "Mission" },
      { kind: "textarea", name: "tagline", label: "Tagline" },
      { kind: "textarea", name: "culture", label: "Culture" },
      { kind: "text", name: "established", label: "Established Year" },
      { kind: "text", name: "experienceYears", label: "Experience Years" },
      { kind: "text", name: "clientCount", label: "Client Count" },
      { kind: "text", name: "teamCount", label: "Team Count" },
      { kind: "lines", name: "licensedExperts", label: "Licensed Experts (one per line)" },
      { kind: "lines", name: "certifications", label: "Certifications (one per line)" },
      { kind: "lines", name: "testingTools", label: "Testing Tools (one per line)" },
    ],
    defaults: {
      overview:
        "EN: Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.\nID: Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.",
      vision:
        "EN: Global Electrical, Automation and Fire Alarm Services Company.\nID: Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.",
      mission:
        "EN: Mutual Partnership and Professionalism in delivering every engineering engagement.\nID: Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.",
      tagline:
        "EN: Always Make an IMPACT — Powering Solution, Creating Impact\nID: Always Make an IMPACT — Solusi Kelistrikan Andal, Menciptakan Dampak Nyata",
      culture:
        "EN: Our culture of disciplined engineering, safety commitment, and innovation is built around six foundational principles.\nID: Budaya disiplin rekayasa teknik, komitmen keselamatan, dan inovasi kami dibangun di atas enam prinsip dasar.",
      established: "2012",
      experienceYears: "14+",
      clientCount: "400+",
      teamCount: "200+",
      licensedExperts: [
        "AK3 Listrik (Ahli K3 Listrik Kemnaker)",
        "AK3 Umum (Ahli K3 Umum)",
        "AK3 Kebakaran (Kelas A, B, C, D)",
        "Teknisi Kompetensi Tegangan Menengah ESDM",
        "Licensed Mechanical & Termination Specialists",
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
        "D&B Rating",
      ],
      testingTools: [
        "Partial Discharge Analyzer & Scanner",
        "Omicron Relay & CT/VT Analyzer",
        "Megger Insulation & Earth Tester",
        "Fluke Power Quality Analyzer",
        "Transformer Oil Treatment, BDV & DGA",
        "Breaker Analyzer & Contact Resistance Tester",
        "Secondary Injection Test Sets & Load Bank",
      ],
    },
  },
  {
    type: "capabilities",
    label: "Capabilities Grid",
    description: "Compact icon tiles listing engineering capabilities.",
    icon: "wrench",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
      {
        kind: "list",
        name: "items",
        label: "Capabilities",
        itemLabel: "Capability",
        fields: [
          { kind: "icon", name: "icon", label: "Icon" },
          { kind: "text", name: "label", label: "Label" },
        ],
      },
    ],
    defaults: {
      eyebrow: "EN: Capabilities\nID: Kapabilitas Kami",
      title: "EN: End-to-end engineering coverage.\nID: Solusi rekayasa komprehensif dari hulu ke hilir.",
      description:
        "EN: Our team combines hands-on field execution with deep engineering know-how — so we can support your plant from first installation through decades of operation.\nID: Tim kami memadukan eksekusi lapangan dengan keahlian rekayasa tingkat lanjut — mendukung fasilitas industri Anda mulai dari instalasi awal hingga pemeliharaan jangka panjang.",
      items: [
        { icon: "hard-hat", label: "EN: Installation\nID: Instalasi & Pemasangan" },
        { icon: "clipboard-list", label: "EN: Testing & Commissioning\nID: Pengujian & Komisioning" },
        { icon: "hammer", label: "EN: Construction\nID: Konstruksi Kelistrikan" },
        { icon: "wrench", label: "EN: Curative Maintenance\nID: Pemeliharaan Korektif" },
        { icon: "shield", label: "EN: Preventive Maintenance\nID: Pemeliharaan Preventif" },
        { icon: "activity", label: "EN: Testing & Measurement\nID: Pengujian & Pengukuran" },
        { icon: "cog", label: "EN: Operation & Maintenance\nID: Operasi & Pemeliharaan" },
        { icon: "microscope", label: "EN: Predictive Maintenance\nID: Pemeliharaan Prediktif" },
        { icon: "lightbulb", label: "EN: Innovation & Improvement\nID: Inovasi & Peningkatan" },
        { icon: "search", label: "EN: Assessment & Study\nID: Asesmen & Studi Kelayakan" },
        { icon: "stethoscope", label: "EN: Diagnostic\nID: Diagnostik & Analisis Gangguan" },
        { icon: "settings", label: "EN: Engineering Design\nID: Desain Rekayasa Teknis" },
      ],
    },
  },
  {
    type: "servicesShowcase",
    label: "Services Showcase",
    description: "The three service cards with detail lists, pulled from CMS services.",
    icon: "layout-grid",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
    ],
    defaults: {
      eyebrow: "EN: What we do\nID: Layanan Utama",
      title: "EN: Three core services. One trusted partner.\nID: Tiga pilar layanan utama. Satu mitra terpercaya.",
      description:
        "EN: From greenfield installation to long-term operation and maintenance, our certified engineers deliver high-quality solutions tailored to each plant and facility.\nID: Mulai dari instalasi proyek baru hingga operasi dan pemeliharaan jangka panjang, para insinyur tersertifikasi kami menghadirkan solusi berkualitas tinggi yang disesuaikan dengan kebutuhan fasilitas Anda.",
    },
  },
  {
    type: "richText",
    label: "Rich Text",
    description: "Visual editor with headings, lists, links, quotes, and images.",
    icon: "text",
    fields: [
      { kind: "richtext", name: "html", label: "Content" },
      {
        kind: "list",
        name: "blocks",
        label: "Legacy blocks (rendered after the content above)",
        itemLabel: "Block",
        fields: [
          {
            kind: "select",
            name: "type",
            label: "Type",
            options: [
              { value: "paragraph", label: "Paragraph" },
              { value: "heading", label: "Heading" },
              { value: "quote", label: "Quote" },
              { value: "list", label: "List (one item per line)" },
            ],
          },
          { kind: "textarea", name: "text", label: "Text" },
        ],
      },
    ],
    defaults: {
      html: "",
      blocks: [],
    },
  },
  {
    type: "features",
    label: "Feature Cards",
    description: "Icon cards in a grid, with intro copy (e.g. Why Us).",
    icon: "layout-grid",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
      {
        kind: "list",
        name: "items",
        label: "Cards",
        itemLabel: "Card",
        fields: [
          { kind: "icon", name: "icon", label: "Icon" },
          { kind: "text", name: "title", label: "Title" },
          { kind: "textarea", name: "body", label: "Body" },
        ],
      },
    ],
    defaults: {
      eyebrow: "EN: Why partner with us\nID: Mengapa Bermitra dengan Kami",
      title: "EN: Engineering you can rely on, every shift.\nID: Rekayasa yang dapat Anda andalkan di setiap operasional.",
      description:
        "EN: We combine technical depth with operational discipline so your assets stay reliable, safe, and ready for the next decade of production.\nID: Kami memadukan kompetensi teknis dengan disiplin operasional agar aset industri Anda tetap andal, aman, dan siap beroperasi optimal untuk jangka panjang.",
      items: [
        {
          icon: "users",
          title: "EN: Certified, experienced engineers\nID: Insinyur Berpengalaman & Tersertifikasi",
          body: "EN: A multidisciplinary team specialized in electrical, automation, fire alarm, and mechanical works.\nID: Tim multidisiplin dengan spesialisasi di bidang kelistrikan, otomasi, proteksi kebakaran, dan mekanikal.",
        },
        {
          icon: "shield-check",
          title: "EN: ISO-certified quality management\nID: Manajemen Mutu Bersertifikasi ISO",
          body: "EN: Standardized processes for design, execution, and maintenance — verified by recognized certification bodies.\nID: Proses terstandarisasi untuk perencanaan, pelaksanaan, dan pemeliharaan yang terverifikasi lembaga sertifikasi internasional.",
        },
        {
          icon: "award",
          title: "EN: End-to-end project delivery\nID: Eksekusi Proyek Menyeluruh",
          body: "EN: From engineering and construction to commissioning, predictive maintenance, and long-term operation.\nID: Mulai dari rancang bangun dan konstruksi hingga komisioning, pemeliharaan prediktif, serta pengoperasian jangka panjang.",
        },
        {
          icon: "headphones",
          title: "EN: Long-term service partnership\nID: Kemitraan Layanan Berkelanjutan",
          body: "EN: Operation & maintenance contracts that keep your plant safe, efficient, and always running.\nID: Kontrak operasi dan pemeliharaan yang menjaga fasilitas Anda tetap aman, efisien, dan terus berproduksi.",
        },
      ],
    },
  },
  {
    type: "stats",
    label: "Statistics",
    description: "Row of key numbers with labels.",
    icon: "bar-chart",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      {
        kind: "list",
        name: "items",
        label: "Numbers",
        itemLabel: "Number",
        max: 6,
        fields: [
          { kind: "text", name: "value", label: "Value", placeholder: "120+" },
          { kind: "text", name: "label", label: "Label", placeholder: "Projects delivered" },
        ],
      },
    ],
    defaults: {
      eyebrow: "",
      title: "",
      items: [
        { value: "2012", label: "EN: Established\nID: Didirikan" },
        { value: "400+", label: "EN: Corporate Clients\nID: Klien Korporat" },
        { value: "200+", label: "EN: Engineers & Staff\nID: Insinyur & Tim Ahli" },
      ],
    },
  },
  {
    type: "contentGrid",
    label: "Content Grid",
    description: "Latest services, products, or news pulled from the CMS.",
    icon: "database",
    fields: [
      {
        kind: "select",
        name: "source",
        label: "Content source",
        options: [
          { value: "services", label: "Services" },
          { value: "products", label: "Products" },
          { value: "news", label: "News" },
        ],
      },
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
      { kind: "number", name: "limit", label: "Max items", min: 1, max: 12 },
    ],
    defaults: {
      source: "services",
      eyebrow: "EN: What we do\nID: Layanan Kami",
      title: "EN: Our services\nID: Layanan Kami",
      description: "",
      limit: 6,
    },
  },
  {
    type: "industries",
    label: "Industries Band",
    description: "Dark band with icon tiles for industries served.",
    icon: "factory",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
      { kind: "image", name: "imageUrl", label: "Background image" },
      {
        kind: "list",
        name: "items",
        label: "Tiles",
        itemLabel: "Tile",
        fields: [
          { kind: "icon", name: "icon", label: "Icon" },
          { kind: "text", name: "label", label: "Label" },
        ],
      },
    ],
    defaults: {
      eyebrow: "EN: Industries we serve\nID: Industri yang Kami Layani",
      title: "EN: Trusted across heavy industry & critical infrastructure.\nID: Dipercaya di berbagai industri berat & infrastruktur kritis.",
      description:
        "EN: From power generation and oil & gas to pharmaceuticals and food processing, we deliver electrical and automation expertise where reliability matters most.\nID: Dari pembangkit listrik dan migas hingga farmasi serta makanan-minuman, kami menghadirkan keahlian kelistrikan dan otomasi di sektor yang menuntut keandalan tertinggi.",
      imageUrl: "/placeholder.jpg",
      items: [
        { icon: "factory", label: "EN: Industrial Plants\nID: Pabrik & Manufaktur" },
        { icon: "building", label: "EN: Buildings\nID: Gedung Komersial" },
        { icon: "flask", label: "EN: Petrochemical\nID: Petrokimia" },
        { icon: "droplets", label: "EN: Oil & Gas\nID: Minyak & Gas Bumi" },
        { icon: "zap", label: "EN: Power Plants\nID: Pembangkit Listrik" },
        { icon: "network", label: "EN: Infrastructure\nID: Infrastruktur Publik" },
        { icon: "utensils", label: "EN: Food & Beverage\nID: Makanan & Minuman" },
        { icon: "cog", label: "EN: Manufacturing\nID: Industri Manufaktur" },
        { icon: "layers", label: "EN: Cement\nID: Industri Semen" },
        { icon: "pill", label: "EN: Pharmaceuticals\nID: Farmasi & Medis" },
        { icon: "flame", label: "EN: Natural Gas\nID: Gas Alam" },
        { icon: "wheat", label: "EN: Agro-Industry\nID: Agroindustri & Kelapa Sawit" },
      ],
    },
  },
  {
    type: "gallery",
    label: "Image Gallery",
    description: "Responsive grid of images with optional captions.",
    icon: "images",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      {
        kind: "list",
        name: "images",
        label: "Images",
        itemLabel: "Image",
        fields: [
          { kind: "image", name: "url", label: "Image" },
          { kind: "text", name: "alt", label: "Alt text" },
          { kind: "text", name: "caption", label: "Caption" },
        ],
      },
    ],
    defaults: {
      eyebrow: "",
      title: "",
      images: [],
    },
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Accordion of questions and answers.",
    icon: "help-circle",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "title", label: "Title" },
      {
        kind: "list",
        name: "items",
        label: "Questions",
        itemLabel: "Question",
        fields: [
          { kind: "text", name: "question", label: "Question" },
          { kind: "textarea", name: "answer", label: "Answer" },
        ],
      },
    ],
    defaults: {
      eyebrow: "EN: FAQ\nID: Tanya Jawab",
      title: "EN: Frequently asked questions\nID: Pertanyaan yang sering diajukan",
      items: [{ question: "", answer: "" }],
    },
  },
  {
    type: "cta",
    label: "Call to Action",
    description: "Banner with heading, description, and buttons.",
    icon: "megaphone",
    fields: [
      { kind: "textarea", name: "title", label: "Title" },
      { kind: "textarea", name: "description", label: "Description" },
      ...linkFields("primary", "Primary button"),
      ...linkFields("secondary", "Secondary button"),
    ],
    defaults: {
      title: "EN: Ready to power your next project?\nID: Siap mengoptimalkan proyek kelistrikan Anda berikutnya?",
      description:
        "EN: Tell us about your facility — our engineers will respond with a tailored scope, approach, and quote.\nID: Ceritakan fasilitas dan sasaran operasional Anda — tim engineer kami akan segera menindaklanjuti dengan ruang lingkup teknis, metode pelaksanaan, dan penawaran yang terstruktur.",
      primaryLabel: "EN: Get in Touch\nID: Hubungi Kami",
      primaryHref: "/contact",
      secondaryLabel: "EN: View Services\nID: Lihat Layanan",
      secondaryHref: "/services",
    },
  },
  {
    type: "embed",
    label: "Embed / Video",
    description: "Embed a video, map, or other iframe by URL.",
    icon: "monitor-play",
    fields: [
      { kind: "text", name: "title", label: "Title" },
      { kind: "text", name: "url", label: "Embed URL (iframe src)", placeholder: "https://www.youtube.com/embed/..." },
      {
        kind: "select",
        name: "aspect",
        label: "Aspect ratio",
        options: [
          { value: "16/9", label: "16 : 9" },
          { value: "4/3", label: "4 : 3" },
          { value: "1/1", label: "Square" },
        ],
      },
      { kind: "text", name: "caption", label: "Caption" },
    ],
    defaults: {
      title: "",
      url: "",
      aspect: "16/9",
      caption: "",
    },
  },
  {
    type: "listing",
    label: "Resource Listing",
    description:
      "Marks where the automatic listing (with search, filters, and pagination) appears on the Services, Products, News, and Career pages.",
    icon: "database",
    fields: [
      {
        kind: "select",
        name: "source",
        label: "Listing source",
        options: [
          { value: "services", label: "Services" },
          { value: "products", label: "Products" },
          { value: "news", label: "News" },
          { value: "careers", label: "Careers" },
        ],
      },
    ],
    defaults: {
      source: "services",
    },
  },
]

export const sectionDefsByType: Record<string, SectionDef> = Object.fromEntries(
  sectionDefs.map((def) => [def.type, def]),
)

export function createSection(type: string): Section {
  const def = sectionDefsByType[type]
  return {
    id: makeSectionId(),
    type,
    props: def ? structuredClone(def.defaults) : {},
  }
}

export function makeSectionId() {
  return `sec-${Math.random().toString(36).slice(2, 10)}`
}

// Pages built with the builder store sections here; legacy pages only
// carry `blocks` and custom fields and keep rendering through RichText.
export function sectionsFromContent(content: unknown): Section[] {
  if (!content || typeof content !== "object") return []
  const raw = (content as { sections?: unknown }).sections
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "string" && item.id ? item.id : `sec-${index}`,
      type: typeof item.type === "string" ? item.type : "richText",
      props:
        item.props && typeof item.props === "object" ? (item.props as Record<string, unknown>) : {},
    }))
}

export function hasSections(content: unknown): boolean {
  return sectionsFromContent(content).length > 0
}

// --- prop coercion helpers used by section components ---

export function str(props: Record<string, unknown>, name: string, fallback = ""): string {
  const value = props[name]
  return typeof value === "string" ? value : fallback
}

export function num(props: Record<string, unknown>, name: string, fallback: number): number {
  const value = Number(props[name])
  return Number.isFinite(value) && value > 0 ? value : fallback
}

export function lines(props: Record<string, unknown>, name: string): string[] {
  const value = props[name]
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean)
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export function records(props: Record<string, unknown>, name: string): Record<string, string>[] {
  const value = props[name]
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) =>
      Object.fromEntries(
        Object.entries(item).map(([key, entryValue]) => [key, entryValue == null ? "" : String(entryValue)]),
      ),
    )
}

// --- presets replicating the live built-in pages ---
// Editing these in the admin edits exactly what visitors see, because the
// section defaults equal the hardcoded copy of the original components.

export function homePresetSections(): Section[] {
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "EN: Ready to power your next project?\nID: Siap mewujudkan keandalan sistem kelistrikan proyek Anda?",
    description:
      "EN: Tell us about your facility — our engineers will respond with a tailored scope, approach, and quote.\nID: Ceritakan kebutuhan fasilitas Anda — tim insinyur kami siap memberikan ruang lingkup, pendekatan teknis, serta estimasi biaya yang disesuaikan.",
    primaryLabel: "EN: Get in Touch\nID: Hubungi Kami",
    primaryHref: "/contact",
    secondaryLabel: "EN: View Services\nID: Lihat Layanan",
    secondaryHref: "/services",
  }
  return [
    createSection("hero"),
    createSection("servicesShowcase"),
    createSection("features"),
    createSection("industries"),
    cta,
  ]
}

export function aboutPresetSections(content: Record<string, unknown> = {}): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "EN: About Us\nID: Tentang Kami",
    title: "EN: A team built for your most demanding electrical projects.\nID: Tim ahli berpengalaman untuk proyek kelistrikan paling menantang.",
    description:
      "EN: Founded in 2012 by seasoned engineers, PT Multi Daya Mitra has grown into one of East Java's largest electrical service partners — delivering across Indonesia and selected overseas assignments.\nID: Didirikan sejak tahun 2012 oleh para insinyur berpengalaman, PT Multi Daya Mitra telah berkembang menjadi salah satu mitra layanan elektrikal terdepan di Jawa Timur — melayani seluruh Indonesia dan proyek mancanegara.",
  }

  const aboutSection = createSection("about")
  aboutSection.props = {
    ...aboutSection.props,
    ...content,
  }

  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "EN: Want to know more about our work?\nID: Ingin tahu lebih banyak tentang proyek kami?",
    description:
      "EN: Get in touch with our team to discuss your project, request company credentials, or schedule a site assessment.\nID: Hubungi tim kami untuk mendiskusikan kebutuhan proyek Anda, meminta profil perusahaan, atau menjadwalkan survei teknis.",
    primaryLabel: "EN: Contact Us\nID: Hubungi Kami",
    primaryHref: "/contact",
    secondaryLabel: "",
    secondaryHref: "",
  }

  return [
    pageHero,
    aboutSection,
    createSection("features"),
    createSection("capabilities"),
    cta,
  ]
}

function listingSection(source: string): Section {
  const listing = createSection("listing")
  listing.props = { source }
  return listing
}

export function servicesPresetSections(): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "EN: Our Business Units\nID: Unit Bisnis & Layanan",
    title: "EN: Integrated Electrical, Automation & Mechanical Services\nID: Layanan Terintegrasi Elektrikal, Otomasi & Mekanikal",
    description:
      "EN: From turnkey substation construction and automation integration to predictive maintenance, testing & commissioning, and mechanical supplies across Indonesia.\nID: Dari konstruksi gardu induk dan integrasi otomasi hingga pemeliharaan prediktif, testing & commissioning, serta pasokan mekanikal di seluruh Indonesia.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "EN: Need an engineering assessment or service quotation?\nID: Butuh asesmen teknis atau penawaran layanan?",
    description:
      "EN: Share your plant or facility requirements and our engineering team will respond with scope, timeline, and execution plan.\nID: Sampaikan kebutuhan fasilitas pabrik Anda dan tim insinyur kami akan merespons dengan ruang lingkup, jadwal pelaksanaan, serta estimasi biaya yang komprehensif.",
    primaryLabel: "EN: Consult with Engineers\nID: Konsultasi dengan Insinyur",
    primaryHref: "/contact",
    secondaryLabel: "EN: WhatsApp Hotline\nID: Hotline WhatsApp",
    secondaryHref: "https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20would%20like%20to%20inquire%20about%20your%20engineering%20and%20maintenance%20services.",
  }
  return [
    pageHero,
    createSection("servicesShowcase"),
    listingSection("services"),
    createSection("capabilities"),
    cta,
  ]
}

export function productsPresetSections(): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "EN: Products & Strategic Partners\nID: Produk & Mitra Strategis",
    title: "EN: Engineered electrical, automation & climate control products.\nID: Produk rekayasa elektrikal, otomasi & sistem kontrol iklim.",
    description:
      "EN: Official Authorized Distributor for Rittal, Certified System Integrator for Schneider Electric, and complete product lines for electrical distribution, automation, power quality & fire systems.\nID: Distributor Resmi Rittal, Certified System Integrator Schneider Electric, serta lini produk lengkap untuk distribusi daya, kontrol iklim, power quality, dan fire system.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "EN: Need a specific product quotation or datasheet?\nID: Butuh penawaran harga produk atau lembar data teknis spesifik?",
    description:
      "EN: Tell our engineering team what you are sourcing — we provide genuine hardware availability, custom assembly, and warranty support.\nID: Sampaikan kebutuhan pengadaan fasilitas Anda kepada tim insinyur kami — kami menyediakan ketersediaan perangkat keras asli, perakitan kustom, dan jaminan purnajual resmi.",
    primaryLabel: "EN: Request Quotation\nID: Minta Penawaran",
    primaryHref: "/contact",
    secondaryLabel: "EN: WhatsApp Sales Hotline\nID: Hotline Sales WhatsApp",
    secondaryHref: "https://wa.me/628118303250?text=Hello%20PT%20Multi%20Daya%20Mitra,%20I%20would%20like%20to%20inquire%20about%20product%20pricing%20and%20availability.",
  }
  return [pageHero, listingSection("products"), cta]
}

export function newsPresetSections(): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "EN: News & Insights\nID: Berita & Wawasan",
    title: "EN: Project milestones, company updates, and field-tested insights.\nID: Pencapaian proyek, kabar perusahaan, dan wawasan teknis industri.",
    description:
      "EN: Stay current on what our engineers are delivering across power, oil & gas, manufacturing, and infrastructure projects.\nID: Pantau kontribusi teknisi kami dalam menyukseskan proyek kelistrikan, migas, manufaktur, dan infrastruktur.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "EN: Have a project worth talking about?\nID: Punya proyek yang ingin didiskusikan?",
    description:
      "EN: We work with industrial owners, EPC partners, and infrastructure operators across Indonesia. Let's talk about your next milestone.\nID: Kami bekerja sama dengan pemilik industri, mitra EPC, dan operator infrastruktur di seluruh Indonesia. Mari diskusikan target pencapaian Anda berikutnya.",
    primaryLabel: "EN: Contact Us\nID: Hubungi Kami",
    primaryHref: "/contact",
    secondaryLabel: "",
    secondaryHref: "",
  }
  return [pageHero, listingSection("news"), cta]
}

export function careerPresetSections(): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "EN: Career\nID: Karir",
    title: "EN: Build your engineering career on real, large-scale projects.\nID: Bangun karir rekayasa teknik Anda dalam proyek-proyek industri nyata.",
    description:
      "EN: Join a team that designs, installs, and maintains the electrical and automation systems behind Indonesia's most demanding industries.\nID: Bergabunglah bersama tim yang merancang, memasang, dan memelihara sistem kelistrikan dan otomasi industri paling menantang di Indonesia.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "EN: Don't see the right role?\nID: Tidak menemukan posisi yang sesuai?",
    description:
      "EN: We're always interested in meeting talented engineers and operators. Send us your CV and we'll keep you in mind.\nID: Kami selalu tertarik untuk bertemu dengan para insinyur dan tenaga profesional berbakat. Kirimkan CV Anda dan kami akan menghubungi Anda saat ada posisi yang relevan.",
    primaryLabel: "EN: Send Your CV\nID: Kirimkan CV Anda",
    primaryHref: "mailto:hr@multidayamitra.co.id",
    secondaryLabel: "",
    secondaryHref: "",
  }
  return [pageHero, listingSection("careers"), cta]
}

function contactPresetSections(content: Record<string, unknown> = {}): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    ...pageHero.props,
    eyebrow: "EN: Get in Touch\nID: Hubungi Kami",
    title:
      "EN: Plan your next electrical or automation project with us.\nID: Rencanakan proyek kelistrikan atau otomasi Anda bersama kami.",
    description:
      "EN: Tell us about your facility and the outcomes you're after — our engineers will respond with a tailored scope, approach, and quote.\nID: Sampaikan kebutuhan fasilitas Anda — tim insinyur kami siap memberikan rekomendasi teknis, lingkup kerja, dan penawaran terbaik.",
  }
  const contact = createSection("contact")
  if (content.email || content.phone || content.offices) {
    contact.props = {
      ...contact.props,
      email: content.email ?? contact.props.email,
      phone: content.phone ?? contact.props.phone,
      salesPhone: content.salesPhone ?? contact.props.salesPhone,
      technicalPhone: content.technicalPhone ?? contact.props.technicalPhone,
      offices: content.offices ?? contact.props.offices,
    }
  }
  return [pageHero, contact]
}

// Sections to prefill the builder with when a built-in page has no sections
// yet — so the admin edits the same design the public already sees.
export function presetSectionsForKey(
  key: string,
  content: Record<string, unknown> = {},
): Section[] | null {
  switch (key) {
    case "home":
      return homePresetSections()
    case "about":
      return aboutPresetSections(content)
    case "contact":
      return contactPresetSections(content)
    case "services":
      return servicesPresetSections()
    case "products":
      return productsPresetSections()
    case "news":
      return newsPresetSections()
    case "career":
      return careerPresetSections()
    default:
      return null
  }
}

// Landing routes render their resource listing at the `listing` marker; the
// marker itself never renders. The listing must always appear, so a page
// whose marker was deleted gets it appended after every section.
export function splitSectionsAtListing(sections: Section[]): {
  before: Section[]
  after: Section[]
} {
  const index = sections.findIndex((section) => section.type === "listing")
  const withoutMarkers = (list: Section[]) => list.filter((section) => section.type !== "listing")
  if (index === -1) {
    return { before: withoutMarkers(sections), after: [] }
  }
  return {
    before: withoutMarkers(sections.slice(0, index)),
    after: withoutMarkers(sections.slice(index + 1)),
  }
}

// Page templates offered when starting a new page in the builder.
export const pageTemplates: { key: string; label: string; description: string; sections: () => Section[] }[] = [
  {
    key: "landing",
    label: "Homepage (current design)",
    description: "Hero, services showcase, why-us, industries, and CTA — matches the live homepage.",
    sections: homePresetSections,
  },
  {
    key: "profile",
    label: "Profile Page",
    description: "Page header, image + text, stats, and CTA.",
    sections: () => ["pageHero", "imageText", "stats", "cta"].map(createSection),
  },
  {
    key: "article",
    label: "Simple Content",
    description: "Page header and rich text.",
    sections: () => ["pageHero", "richText"].map(createSection),
  },
]
