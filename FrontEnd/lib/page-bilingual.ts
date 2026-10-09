import type { SEO } from "@/lib/cms"
import { parseMarkedPair, type LocalizedText } from "@/lib/i18n"
import { OFFICE_COPY } from "@/lib/section-defaults"

export type BilingualPageEntry = {
  key: string
  title: {
    en: string
    id: string
  }
  seo?: {
    title: { en: string; id: string }
    description: { en: string; id: string }
  }
}

export const BILINGUAL_PAGE_CATALOG: Record<string, BilingualPageEntry> = {
  about: {
    key: "about",
    title: {
      en: "About PT Multi Daya Mitra",
      id: "Tentang PT Multi Daya Mitra",
    },
    seo: {
      title: {
        en: "About PT Multi Daya Mitra",
        id: "Tentang PT Multi Daya Mitra",
      },
      description: {
        en: "Profile of PT Multi Daya Mitra — Established in 2012 by experienced engineers, trusted electrical, industrial automation (PLC/SCADA), and fire alarm engineering contractor across Indonesia.",
        id: "Profil PT Multi Daya Mitra — Didirikan tahun 2012 oleh insinyur berpengalaman, kontraktor rekayasa elektrik, otomasi industri (PLC/SCADA), dan sistem fire alarm terpercaya di Indonesia.",
      },
    },
  },
  contact: {
    key: "contact",
    title: {
      en: "Contact PT Multi Daya Mitra",
      id: "Hubungi PT Multi Daya Mitra",
    },
    seo: {
      title: {
        en: "Contact PT Multi Daya Mitra",
        id: "Hubungi PT Multi Daya Mitra",
      },
      description: {
        en: "Get in touch with PT Multi Daya Mitra for turnkey electrical engineering, industrial automation, and fire protection solutions across Indonesia.",
        id: "Hubungi PT Multi Daya Mitra untuk konsultasi rekayasa elektrik, otomasi industri, dan pengadaan sistem kelistrikan di seluruh Indonesia.",
      },
    },
  },
  home: {
    key: "home",
    title: {
      en: "Home",
      id: "Beranda",
    },
    seo: {
      title: {
        en: "Home — PT Multi Daya Mitra",
        id: "Beranda — PT Multi Daya Mitra",
      },
      description: {
        en: "PT Multi Daya Mitra — Delivering reliable electrical engineering, industrial automation (PLC/SCADA), and fire alarm solutions across Indonesia.",
        id: "PT Multi Daya Mitra — Menghadirkan solusi rekayasa elektrik, otomasi industri (PLC/SCADA), dan proteksi kebakaran terpercaya di Indonesia.",
      },
    },
  },
  services: {
    key: "services",
    title: {
      en: "Services",
      id: "Layanan",
    },
    seo: {
      title: {
        en: "Engineering Services — PT Multi Daya Mitra",
        id: "Layanan Rekayasa Teknik — PT Multi Daya Mitra",
      },
      description: {
        en: "Comprehensive electrical engineering, PLC/SCADA automation integration, predictive maintenance, and testing & commissioning services.",
        id: "Layanan lengkap rekayasa elektrikal, integrasi otomasi PLC/SCADA, pemeliharaan prediktif, serta pengujian dan commissioning industri.",
      },
    },
  },
  products: {
    key: "products",
    title: {
      en: "Products",
      id: "Produk",
    },
    seo: {
      title: {
        en: "Industrial Products & Strategic Partners — PT Multi Daya Mitra",
        id: "Produk & Solusi Industri — PT Multi Daya Mitra",
      },
      description: {
        en: "Authorized Rittal Distributor, Schneider Electric Certified Integrator, and full lines for power distribution, climate control, and industrial automation.",
        id: "Distributor Resmi Rittal, Integrator Schneider Electric, serta lini produk lengkap untuk distribusi daya, kontrol iklim, dan otomasi industri.",
      },
    },
  },
  news: {
    key: "news",
    title: {
      en: "News & Insights",
      id: "Berita & Wawasan",
    },
    seo: {
      title: {
        en: "News & Engineering Insights — PT Multi Daya Mitra",
        id: "Berita & Wawasan Industri — PT Multi Daya Mitra",
      },
      description: {
        en: "Latest project milestones, corporate updates, and field-tested engineering insights from PT Multi Daya Mitra.",
        id: "Pembaruan proyek terkini, kabar perusahaan, dan wawasan teknis kelistrikan dari tim insinyur PT Multi Daya Mitra.",
      },
    },
  },
  career: {
    key: "career",
    title: {
      en: "Careers",
      id: "Karir",
    },
    seo: {
      title: {
        en: "Careers — PT Multi Daya Mitra",
        id: "Karir & Peluang Kerja — PT Multi Daya Mitra",
      },
      description: {
        en: "Join our engineering team delivering high-impact electrical and industrial automation projects across Indonesia.",
        id: "Bergabunglah bersama tim insinyur dan profesional PT Multi Daya Mitra dalam menangani proyek rekayasa industri berskala besar.",
      },
    },
  },
}
 
export const BILINGUAL_PAGE_FIELDS: Record<string, Record<string, { en: string; id: string }>> = {
  about: {
    overview: {
      en: "Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.",
      id: "Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional.",
    },
    vision: {
      en: "Global Electrical, Automation and Fire Alarm Services Company.",
      id: "Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia.",
    },
    mission: {
      en: "Mutual Partnership and Professionalism in delivering every engineering engagement.",
      id: "Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik.",
    },
    tagline: {
      en: "Always Make an IMPACT - Powering Solution, Creating Impact",
      id: "Always Make an IMPACT - Solusi Kelistrikan Andal, Menciptakan Dampak Nyata",
    },
    culture: {
      en: "The company culture in a professional manner brings the company to move fast in achieving every step of its vision.",
      id: "Budaya perusahaan yang menjunjung tinggi profesionalisme mendorong gerak cepat perusahaan dalam mewujudkan setiap langkah visinya.",
    },
  },
}

/**
 * Fills a system page's title and SEO with the built-in copy when the CMS has
 * none, and reads seeded single-language content as its bilingual copy (see
 * pairSeededPageContent). Stored values always win — what the admin saved is
 * what renders.
 */
export function enrichPageWithBilingual<
  T extends {
    key?: string
    title?: string
    seo?: SEO
    content?: Record<string, unknown>
  }
>(page: T, fallbackKey?: string): T {
  if (!page) return page
  const pageKey = (page.key || fallbackKey || "").toLowerCase().trim()
  const entry = BILINGUAL_PAGE_CATALOG[pageKey]
  if (!entry) return page

  const pair = (value: { en: string; id: string }) => `EN: ${value.en}\nID: ${value.id}`
  return {
    ...page,
    content: page.content ? pairSeededPageContent(pageKey, page.content) : page.content,
    title: page.title?.trim() ? page.title : pair(entry.title),
    seo: entry.seo
      ? {
          ...page.seo,
          title: page.seo?.title?.trim() ? page.seo.title : pair(entry.seo.title),
          description: page.seo?.description?.trim() ? page.seo.description : pair(entry.seo.description),
        }
      : page.seo,
  }
}

export const LICENSED_EXPERTS: Required<LocalizedText>[] = [
  { id: "AK3 Listrik (Ahli K3 Listrik Kemnaker)", en: "AK3 Listrik (Electrical Safety Expert, Ministry of Manpower)" },
  { id: "AK3 Umum (Ahli K3 Umum)", en: "AK3 Umum (General Occupational Safety & Health Expert)" },
  { id: "AK3 Kebakaran (Kelas A, B, C, D)", en: "AK3 Kebakaran (Fire Safety Expert, Classes A, B, C, D)" },
  { id: "Teknisi Kompetensi Tegangan Menengah ESDM", en: "ESDM-Certified Medium Voltage Technicians" },
  { id: "Spesialis Mekanikal & Terminasi Berlisensi", en: "Licensed Mechanical & Termination Specialists" },
]

export const DEFAULT_TESTING_TOOLS = [
  "Partial Discharge Analyzer & Scanner",
  "Omicron Relay & CT/VT Analyzer",
  "Megger Insulation & Earth Tester",
  "Fluke Power Quality Analyzer",
  "Transformer Oil Treatment, BDV & DGA",
  "Breaker Analyzer & Contact Resistance Tester",
  "Secondary Injection Test Sets & Load Bank",
]

export const DEFAULT_PARTNERSHIPS = [
  "Schneider Electric (Authorized Partner)",
  "Rittal (Authorized Partner)",
  "xArrow (Authorized Partner)",
  "Bosch (Authorized Partner)",
  "ABB",
  "Siemens",
  "Fluke",
  "Megger",
  "FLIR",
  "Danfoss",
  "Omron",
]

export const DEFAULT_BILINGUAL_IMPACT_VALUES = [
  {
    letter: "I",
    title: "EN: Integrity & Innovation\nID: Integritas & Inovasi",
    desc: "EN: Building trust through honesty and responsibility while advancing with modern, up-to-date technologies.\nID: Membangun kepercayaan melalui kejujuran dan tanggung jawab seraya terus berinovasi dengan teknologi termutakhir.",
  },
  {
    letter: "M",
    title: "EN: Mastery & Intelligent Problem-Solving\nID: Keahlian Teknis & Solusi Cerdas",
    desc: "EN: Deep technical mastery in electrical and automation systems with structured precision engineering — not assumptions.\nID: Penguasaan teknis mendalam di bidang sistem kelistrikan dan otomasi melalui rekayasa presisi yang terstruktur — bukan asumsi.",
  },
  {
    letter: "P",
    title: "EN: Professional & Trusted Partnership\nID: Kemitraan Profesional & Terpercaya",
    desc: "EN: Discipline, consistency, and high execution standards that position us as a strategic long-term partner.\nID: Disiplin, konsistensi, dan standar eksekusi tinggi yang menempatkan kami sebagai mitra strategis jangka panjang.",
  },
  {
    letter: "A",
    title: "EN: Agile & Adaptable Execution\nID: Eksekusi Tangkas & Adaptif",
    desc: "EN: Swift, resilient response to evolving site dynamics, operational challenges, and technological demands.\nID: Tanggap dan tangguh dalam merespons dinamika lapangan yang berkembang, tantangan operasional, dan tuntutan teknologi.",
  },
  {
    letter: "C",
    title: "EN: Commitment to Safety & Customer First\nID: Komitmen Keselamatan (K3) & Utamakan Pelanggan",
    desc: "EN: Safety is non-negotiable. Prioritizing operational continuity, asset reliability, and zero-accident culture.\nID: Keselamatan tidak dapat ditawar. Memprioritaskan kontinuitas operasional, keandalan aset, dan budaya nihil kecelakaan kerja.",
  },
  {
    letter: "T",
    title: "EN: Total Engineering Solutions\nID: Solusi Rekayasa Teknik Menyeluruh",
    desc: "EN: End-to-end coverage from design, assembly, and installation to testing, commissioning, and lifecycle maintenance.\nID: Cakupan menyeluruh dari perancangan, perakitan, dan instalasi hingga pengujian, commissioning, serta pemeliharaan siklus hidup aset.",
  },
]

// --- single-language seeds ---

// Migrations before 040 seeded About and Contact copy in one language without
// EN:/ID: markers; 040 rewrote About bilingually, but a database where it did
// not run still holds the old text. A stored value that exactly matches a
// known seed reads as its bilingual copy. Anything else was edited by an
// admin and is left untouched — the builder flags it as missing a language.
type SeedCopy = { id: string; en: string; seeds?: string[] }

const ABOUT_OVERVIEW_SEED =
  "PT Multi Daya Mitra was established in 2012 as a multidisciplinary engineering company specializing in electrical systems, industrial automation, fire alarm solutions, and mechanical works. With over 14 years of business experience, 400+ clients across multi-segments, and a dedicated team of over 200 engineers and professionals, we deliver reliable, safe, and integrated engineering solutions across Indonesia and international assignments."

// IMPACT descriptions as migration 017 wrote them, by letter.
const IMPACT_DESC_SEEDS: Record<string, string> = {
  I: "Building trust through honesty, responsibility, and advancing through modern technology.",
  M: "Deep technical mastery, analytical thinking, precision engineering without assumptions.",
  P: "Discipline, consistency, and long-term strategic engineering partnership.",
  A: "Swift response to evolving project conditions and technological changes.",
  C: "Safety is non-negotiable, operational continuity, asset reliability.",
  T: "End-to-end solutions from design & installation to testing, commissioning & lifecycle maintenance.",
}

function markedPair(value: string): SeedCopy {
  const pair = parseMarkedPair(value)
  return { id: pair?.id ?? value, en: pair?.en ?? value }
}

const ABOUT_SEEDS: SeedCopy[] = [
  { ...BILINGUAL_PAGE_FIELDS.about.overview, seeds: [ABOUT_OVERVIEW_SEED] },
  BILINGUAL_PAGE_FIELDS.about.vision,
  BILINGUAL_PAGE_FIELDS.about.mission,
  BILINGUAL_PAGE_FIELDS.about.tagline,
  BILINGUAL_PAGE_FIELDS.about.culture,
  ...DEFAULT_BILINGUAL_IMPACT_VALUES.flatMap((value) => [
    markedPair(value.title),
    { ...markedPair(value.desc), seeds: [IMPACT_DESC_SEEDS[value.letter]] },
  ]),
  ...LICENSED_EXPERTS,
]

const CONTACT_SEEDS: SeedCopy[] = OFFICE_COPY.flatMap((office) => [office.name, office.address])

const MARKER_LINE = /(^|\n)[ \t]*(EN|ID)[ \t]*:/
const normalizeSeed = (text: string) => text.replace(/\s+/g, " ").trim()

function withSeedTranslation(value: unknown, seeds: SeedCopy[]): unknown {
  if (typeof value !== "string" || MARKER_LINE.test(value)) return value
  const text = normalizeSeed(value)
  if (!text) return value
  // Numbers and symbols ("14+", "400+") read the same in both languages.
  if (!/\p{L}/u.test(text)) return { id: text, en: text }
  const match = seeds.find((entry) =>
    [entry.id, entry.en, ...(entry.seeds ?? [])].some((seed) => normalizeSeed(seed) === text),
  )
  return match ? { id: match.id, en: match.en } : value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

// Reads the seeded single-language fields of a built-in page's content as
// { id, en } pairs (see the seed tables above); every other value passes
// through.
export function pairSeededPageContent(key: string, content: Record<string, unknown>): Record<string, unknown> {
  if (key === "about") {
    const pair = (value: unknown) => withSeedTranslation(value, ABOUT_SEEDS)
    const next: Record<string, unknown> = { ...content }
    for (const field of ["overview", "vision", "mission", "tagline", "culture", "experienceYears"]) {
      if (field in next) next[field] = pair(next[field])
    }
    if (Array.isArray(next.impactValues)) {
      next.impactValues = next.impactValues.map((item) =>
        isRecord(item) ? { ...item, title: pair(item.title), desc: pair(item.desc) } : item,
      )
    }
    if (Array.isArray(next.licensedExperts)) next.licensedExperts = next.licensedExperts.map(pair)
    return next
  }
  if (key === "contact" && Array.isArray(content.offices)) {
    const pair = (value: unknown) => withSeedTranslation(value, CONTACT_SEEDS)
    return {
      ...content,
      offices: content.offices.map((office) =>
        isRecord(office) ? { ...office, name: pair(office.name), address: pair(office.address) } : office,
      ),
    }
  }
  return content
}

