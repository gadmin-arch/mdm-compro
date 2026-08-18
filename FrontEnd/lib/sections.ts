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
      eyebrow: "Trusted partner since 2012",
      title: "Powering industry with reliable electrical & automation services.",
      highlight: "reliable",
      description:
        "PT Multi Daya Mitra delivers end-to-end electrical, industrial automation, and fire alarm solutions with 14+ years of engineering experience across Indonesia and beyond.",
      primaryLabel: "Start a Project",
      primaryHref: "/contact",
      secondaryLabel: "Explore Services",
      secondaryHref: "/services",
      imageUrl: "/uploads/hero-project.jpg",
      imageAlt: "Engineer inspecting medium voltage substation switchgear",
      stats: [
        { label: "Established", value: "2012" },
        { label: "Corporate Clients", value: "400+" },
        { label: "Certified Team", value: "ISO & ESDM" },
      ],
      cardEyebrow: "Now offering",
      cardTitle: "Energy Monitoring System for Sustainability & ESG Reporting",
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
      eyebrow: "Page",
      title: "Page title",
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
      eyebrow: "About the company",
      title: "A team built for your most demanding projects.",
      body: "Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.",
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
      eyebrow: "About the company",
      title: "A team built for your most demanding electrical projects.",
      overview:
        "Established in 2012, PT Multi Daya Mitra was founded by a group of seasoned engineers with deep expertise in electricity, industrial automation, fire alarm systems, and mechanical works.",
      body:
        "We have grown into one of the largest electrical service partners in East Java with over 400 clients and 200+ professionals — delivering projects across Indonesia and on selected overseas assignments. Our company culture of professional discipline drives every milestone, and we are certified to ISO 9001, ISO 14001, ISO 45001, Ecovadis Silver, and SMK3.",
      imageUrl: "/placeholder.jpg",
      imageAlt: "Industrial automation control room with engineers monitoring SCADA systems",
      vision: "Global Electrical, Automation and Fire Alarm Services Company.",
      mission: "Mutual Partnership and Professionalism in delivering every engineering engagement.",
      culture:
        "A professional, fast-moving organization driven by certified engineers (AK3 Listrik, AK3 Umum, AK3 Kebakaran), structured processes, and an uncompromising commitment to safety (Saya Pilih Selamat).",
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
      title: "Our Offices",
      description: "Find our physical offices across Indonesia.",
      items: [
        {
          name: "Head Office (Surabaya)",
          address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
          phone: "+62 31 592 1256",
          fax: "+62 31 591 7845",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid",
        },
        {
          name: "Jakarta Branch Office",
          address: "Gedung Buncit 36, Jl. Warung Jati Barat No. 36, Ragunan, Pasar Minggu, Jakarta Selatan 12550, Indonesia",
          phone: "+62 21 3049 6101",
          fax: "",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.845345719391!2d106.82239457426868!3d-6.2840599937048745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3d53fb7969f%3A0x6e9f16ef0e85d95e!2sGedung%20Buncit%2036!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid",
        },
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
      eyebrow: "Capabilities",
      title: "End-to-end engineering coverage.",
      description:
        "Our team combines hands-on field execution with deep engineering know-how — so we can support your plant from first installation through decades of operation.",
      items: [
        { icon: "hard-hat", label: "Installation" },
        { icon: "clipboard-list", label: "Testing & Commissioning" },
        { icon: "hammer", label: "Construction" },
        { icon: "wrench", label: "Curative Maintenance" },
        { icon: "shield", label: "Preventive Maintenance" },
        { icon: "activity", label: "Testing & Measurement" },
        { icon: "cog", label: "Operation & Maintenance" },
        { icon: "microscope", label: "Predictive Maintenance" },
        { icon: "lightbulb", label: "Innovation & Improvement" },
        { icon: "search", label: "Assessment & Study" },
        { icon: "stethoscope", label: "Diagnostic" },
        { icon: "settings", label: "Engineering Design" },
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
      eyebrow: "What we do",
      title: "Three core services. One trusted partner.",
      description:
        "From greenfield installation to long-term operation and maintenance, our certified engineers deliver high-quality solutions tailored to each plant and facility.",
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
      eyebrow: "Why partner with us",
      title: "Engineering you can rely on, every shift.",
      description:
        "We combine technical depth with operational discipline so your assets stay reliable, safe, and ready for the next decade of production.",
      items: [
        {
          icon: "users",
          title: "Certified, experienced engineers",
          body: "A multidisciplinary team specialized in electrical, automation, fire alarm, and mechanical works.",
        },
        {
          icon: "shield-check",
          title: "ISO-certified quality management",
          body: "Standardized processes for design, execution, and maintenance — verified by recognized certification bodies.",
        },
        {
          icon: "award",
          title: "End-to-end project delivery",
          body: "From engineering and construction to commissioning, predictive maintenance, and long-term operation.",
        },
        {
          icon: "headphones",
          title: "Long-term service partnership",
          body: "Operation & maintenance contracts that keep your plant safe, efficient, and always running.",
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
        { value: "2012", label: "Established" },
        { value: "400+", label: "Corporate Clients" },
        { value: "200+", label: "Engineers & Staff" },
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
      eyebrow: "What we do",
      title: "Our services",
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
      eyebrow: "Industries we serve",
      title: "Trusted across heavy industry & critical infrastructure.",
      description:
        "From power generation and oil & gas to pharmaceuticals and food processing, we deliver electrical and automation expertise where reliability matters most.",
      imageUrl: "/placeholder.jpg",
      items: [
        { icon: "factory", label: "Industrial Plants" },
        { icon: "building", label: "Buildings" },
        { icon: "flask", label: "Petrochemical" },
        { icon: "droplets", label: "Oil & Gas" },
        { icon: "zap", label: "Power Plants" },
        { icon: "network", label: "Infrastructure" },
        { icon: "utensils", label: "Food & Beverage" },
        { icon: "cog", label: "Manufacturing" },
        { icon: "layers", label: "Cement" },
        { icon: "pill", label: "Pharmaceuticals" },
        { icon: "flame", label: "Natural Gas" },
        { icon: "wheat", label: "Agro-Industry" },
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
      eyebrow: "FAQ",
      title: "Frequently asked questions",
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
      title: "Ready to power your next project?",
      description:
        "Tell us about your facility — our engineers will respond with a tailored scope, approach, and quote.",
      primaryLabel: "Get in Touch",
      primaryHref: "/contact",
      secondaryLabel: "View Services",
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
    title: "Ready to power your next project?",
    description:
      "Tell us about your facility — our engineers will respond with a tailored scope, approach, and quote.",
    primaryLabel: "Get in Touch",
    primaryHref: "/contact",
    secondaryLabel: "View Services",
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
    eyebrow: "About Us",
    title: "A team built for your most demanding electrical projects.",
    description:
      "Founded in 2012 by seasoned engineers, PT Multi Daya Mitra has grown into one of East Java's largest electrical service partners — delivering across Indonesia and selected overseas assignments.",
  }

  // Carry over whatever the legacy about page already stored.
  const intro = createSection("aboutIntro")
  for (const field of ["overview", "vision", "mission"] as const) {
    const value = content[field]
    if (typeof value === "string" && value.trim()) {
      intro.props[field] = value
    }
  }

  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "Want to know more about our work?",
    description:
      "Get in touch with our team to discuss your project, request company credentials, or schedule a site assessment.",
    primaryLabel: "Contact Us",
    primaryHref: "/contact",
    secondaryLabel: "",
    secondaryHref: "",
  }

  return [
    pageHero,
    intro,
    createSection("offices"),
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
    eyebrow: "Our Services",
    title: "Three core services. One trusted engineering partner.",
    description:
      "From greenfield installation to long-term operation and maintenance, we deliver high-quality solutions tailored to each plant and facility.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "Have a specific scope in mind?",
    description:
      "Share your facility details and we'll respond with engineering scope, timeline, and a tailored quotation.",
    primaryLabel: "Request a Quote",
    primaryHref: "/contact",
    secondaryLabel: "See Products",
    secondaryHref: "/products",
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
    eyebrow: "Products",
    title: "Industrial products for testing, protection, and instrumentation.",
    description:
      "Explore CMS-managed product categories, datasheets, specifications, galleries, and product details.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "Need a specific product or datasheet?",
    description:
      "Tell us what you are sourcing and our team will respond with availability, specifications, and support options.",
    primaryLabel: "Ask Our Team",
    primaryHref: "/contact",
    secondaryLabel: "View Services",
    secondaryHref: "/services",
  }
  return [pageHero, listingSection("products"), cta]
}

export function newsPresetSections(): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "News & Insights",
    title: "Project milestones, company updates, and field-tested insights.",
    description:
      "Stay current on what our engineers are delivering across power, oil & gas, manufacturing, and infrastructure projects.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "Have a project worth talking about?",
    description:
      "We work with industrial owners, EPC partners, and infrastructure operators across Indonesia. Let's talk about your next milestone.",
    primaryLabel: "Contact Us",
    primaryHref: "/contact",
    secondaryLabel: "",
    secondaryHref: "",
  }
  return [pageHero, listingSection("news"), cta]
}

export function careerPresetSections(): Section[] {
  const pageHero = createSection("pageHero")
  pageHero.props = {
    eyebrow: "Career",
    title: "Build your engineering career on real, large-scale projects.",
    description:
      "Join a team that designs, installs, and maintains the electrical and automation systems behind Indonesia's most demanding industries.",
  }
  const cta = createSection("cta")
  cta.props = {
    ...cta.props,
    title: "Don't see the right role?",
    description:
      "We're always interested in meeting talented engineers and operators. Send us your CV and we'll keep you in mind.",
    primaryLabel: "Send Your CV",
    primaryHref: "mailto:hr@multidayamitra.co.id",
    secondaryLabel: "",
    secondaryHref: "",
  }
  return [pageHero, listingSection("careers"), cta]
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
