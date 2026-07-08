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
      eyebrow: "Trusted partner since 2013",
      title: "Powering industry with reliable electrical & automation services.",
      highlight: "reliable",
      description:
        "PT Multi Daya Mitra delivers end-to-end electrical, industrial automation, and fire alarm solutions for power, oil & gas, manufacturing, and infrastructure projects across Indonesia and beyond.",
      primaryLabel: "Start a Project",
      primaryHref: "/contact",
      secondaryLabel: "Explore Services",
      secondaryHref: "/services",
      imageUrl: "/placeholder.jpg",
      imageAlt: "Engineer inspecting medium voltage substation switchgear",
      stats: [
        { label: "Established", value: "2013" },
        { label: "Industries served", value: "10+" },
        { label: "Certified team", value: "ISO" },
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
    type: "richText",
    label: "Rich Text",
    description: "Headings, paragraphs, quotes, and lists.",
    icon: "text",
    fields: [
      {
        kind: "list",
        name: "blocks",
        label: "Blocks",
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
      blocks: [{ type: "paragraph", text: "" }],
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
        { value: "2013", label: "Established" },
        { value: "120+", label: "Projects delivered" },
        { value: "10+", label: "Industries served" },
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

// Page templates offered when starting a new page in the builder.
export const pageTemplates: { key: string; label: string; description: string; sections: () => Section[] }[] = [
  {
    key: "landing",
    label: "Landing Page",
    description: "Hero, services grid, features, industries, and CTA.",
    sections: () => ["hero", "contentGrid", "features", "industries", "cta"].map(createSection),
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
