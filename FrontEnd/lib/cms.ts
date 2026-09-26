import { enrichNewsWithBilingual, BILINGUAL_NEWS_CATALOG } from "@/lib/news-bilingual"
import { enrichCareerWithBilingual, BILINGUAL_CAREER_CATALOG } from "@/lib/career-bilingual"
import { buildBilingualProductTree, enrichProductWithBilingual } from "@/lib/product-bilingual"
import { buildBilingualServiceTree, enrichServiceWithBilingual } from "@/lib/service-bilingual"
import { enrichPageWithBilingual, DEFAULT_BILINGUAL_IMPACT_VALUES } from "@/lib/page-bilingual"
import { aboutPresetSections } from "@/lib/sections"

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
  body?: unknown
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
  description?: unknown
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

export const fallbackServices: ContentNode[] = buildBilingualServiceTree()

export const fallbackProducts: ContentNode[] = buildBilingualProductTree()


const catalogNewsList: NewsItem[] = Object.keys(BILINGUAL_NEWS_CATALOG)
  .map((slug) => enrichNewsWithBilingual(null, slug))
  .filter((item): item is NewsItem => Boolean(item))

export const fallbackNews: ListResponse<NewsItem> = {
  data: catalogNewsList.length > 0 ? catalogNewsList : [
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
  pagination: { page: 1, perPage: 10, total: catalogNewsList.length || 2, totalPages: 1 },
}

const catalogCareerList: Career[] = Object.keys(BILINGUAL_CAREER_CATALOG)
  .map((slug) => enrichCareerWithBilingual(null, slug))
  .filter((item): item is Career => Boolean(item))

export const fallbackCareers: ListResponse<Career> = {
  data: catalogCareerList.length > 0 ? catalogCareerList : [
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
  pagination: { page: 1, perPage: 20, total: catalogCareerList.length || 2, totalPages: 1 },
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
      licensedExperts: [
        "AK3 Listrik (Ahli K3 Listrik Kemnaker)",
        "AK3 Umum (Ahli K3 Umum)",
        "AK3 Kebakaran (Kelas A, B, C, D)",
        "Teknisi Kompetensi Tegangan Menengah ESDM",
        "Licensed Mechanical & Termination Specialists",
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
      partnerships: [
        "Schneider Electric (Authorized Partner)",
        "Rittal (Authorized Partner)",
        "xArrow (Authorized Partner)",
        "Bosch (Authorized Partner)",
        "ABB", "Siemens", "Fluke", "Megger", "FLIR", "Danfoss", "Omron",
      ],
      impactValues: DEFAULT_BILINGUAL_IMPACT_VALUES,
      sections: aboutPresetSections(),
    },
  },
  contact: {
    id: "page-contact",
    key: "contact",
    title: "EN: Contact PT Multi Daya Mitra\nID: Hubungi PT Multi Daya Mitra",
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
  const page = await cmsFetch<PageContent | null>(`/pages/${key}`, fallbackPages[key] ?? null)
  return page ? enrichPageWithBilingual(page, key) : null
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
  tagline: "EN: Electrical · Automation · Fire System\nID: Elektrikal · Otomasi · Sistem Fire Alarm",
  footerDescription:
    "EN: Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2012.\nID: Perusahaan layanan rekayasa elektrikal, otomasi industri, dan sistem fire alarm terkemuka di Indonesia — menghadirkan solusi andal untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur sejak 2012.",
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

  let tagline = site.tagline ?? fallbackSiteSettings.tagline
  if (tagline && !tagline.includes("ID:") && !tagline.includes("EN:")) {
    tagline = `EN: ${tagline}\nID: Elektrikal · Otomasi · Sistem Fire Alarm`
  }

  let footerDescription = site.footerDescription ?? fallbackSiteSettings.footerDescription
  if (footerDescription && !footerDescription.includes("ID:") && !footerDescription.includes("EN:")) {
    footerDescription = `EN: ${footerDescription}\nID: Perusahaan layanan rekayasa elektrikal, otomasi industri, dan sistem fire alarm terkemuka di Indonesia — menghadirkan solusi andal untuk sektor ketenagalistrikan, migas, manufaktur, dan infrastruktur sejak 2012.`
  }

  return {
    tagline,
    footerDescription,
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

function enrichServiceTree(node: ContentNode): ContentNode {
  const enriched = enrichServiceWithBilingual(node, node.fullPath || node.slug) || node
  if (enriched.children && enriched.children.length > 0) {
    enriched.children = enriched.children.map(enrichServiceTree)
  }
  return enriched
}

export async function getServices(): Promise<ContentNode[]>
export async function getServices(filters: PageFilters): Promise<ListResponse<ContentNode>>
export async function getServices(filters?: PageFilters): Promise<ContentNode[] | ListResponse<ContentNode>> {
  if (!filters) {
    const res = await cmsFetch<ContentNode[]>("/services", fallbackServices)
    return Array.isArray(res) ? res.map(enrichServiceTree) : fallbackServices
  }
  const query = new URLSearchParams()
  if (filters.search) query.set("search", filters.search)
  if (filters.category) query.set("category", filters.category)
  if (filters.sort) query.set("sort", filters.sort)
  if (filters.page) query.set("page", filters.page.toString())
  if (filters.limit) query.set("limit", filters.limit.toString())

  const queryString = query.toString()
  const path = queryString ? `/services?${queryString}` : "/services"
  const response = await cmsListFetch<ContentNode>(path, createContentFallback(fallbackServices, filters))
  if (response && Array.isArray(response.data)) {
    response.data = response.data.map((item) => enrichServiceWithBilingual(item, item.fullPath || item.slug) || item)
  }
  return response
}

export async function getService(path: string) {
  const fallback = findByPath(fallbackServices, path)
  const item = await cmsFetch<ContentNode | null>(`/services/${path}`, fallback)
  if (!item) return null
  return enrichServiceTree(item)
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

function enrichProductTree(node: ContentNode): ContentNode {
  const enriched = enrichProductWithBilingual(node, node.fullPath || node.slug) || node
  const path = node.fullPath || node.slug
  const fallbackNode = findByPath(fallbackProducts, path)

  const existingChildren = (enriched.children || []).map(enrichProductTree)
  const existingSlugs = new Set(existingChildren.map((c) => c.slug))
  const extraChildren = (fallbackNode?.children || []).filter((c) => !existingSlugs.has(c.slug))

  return {
    ...enriched,
    children: [...existingChildren, ...extraChildren],
  }
}

export async function getProducts(): Promise<ContentNode[]>
export async function getProducts(filters: PageFilters): Promise<ListResponse<ContentNode>>
export async function getProducts(filters?: PageFilters): Promise<ContentNode[] | ListResponse<ContentNode>> {
  if (!filters) {
    const res = await cmsFetch<ContentNode[]>("/products", fallbackProducts)
    const list = Array.isArray(res) ? res.map(enrichProductTree) : fallbackProducts
    const existingSlugs = new Set(list.map((r) => r.slug))
    const missingRoots = fallbackProducts.filter((fb) => !existingSlugs.has(fb.slug))
    return [...list, ...missingRoots]
  }
  const query = new URLSearchParams()
  if (filters.search) query.set("search", filters.search)
  if (filters.category) query.set("category", filters.category)
  if (filters.sort) query.set("sort", filters.sort)
  if (filters.page) query.set("page", filters.page.toString())
  if (filters.limit) query.set("limit", filters.limit.toString())

  const queryString = query.toString()
  const path = queryString ? `/products?${queryString}` : "/products"
  const response = await cmsListFetch<ContentNode>(path, createContentFallback(fallbackProducts, filters))
  if (response && Array.isArray(response.data)) {
    const enrichedData = response.data.map((item) => enrichProductWithBilingual(item, item.fullPath || item.slug) || item)
    const existingPaths = new Set(enrichedData.map((d) => d.fullPath || d.slug))
    const fallbackList = createContentFallback(fallbackProducts, filters).data
    const missingFallback = fallbackList.filter((fb) => !existingPaths.has(fb.fullPath || fb.slug))
    response.data = [...enrichedData, ...missingFallback]
  }
  return response
}

export async function getProduct(path: string) {
  const fallback = findByPath(fallbackProducts, path)
  const item = await cmsFetch<ContentNode | null>(`/products/${path}`, fallback)
  if (!item) return fallback ? enrichProductTree(fallback) : null
  return enrichProductTree(item)
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

    let bodyText = ""
    if (item.body && typeof item.body === "object") {
      const b = item.body as Record<string, unknown>
      if (Array.isArray(b.blocks)) {
        bodyText += (b.blocks as Array<{ text?: string; html?: string }>).map((bl) => bl.text || bl.html || "").join(" ")
      }
      const bEn = b.en as { blocks?: Array<{ text?: string; html?: string }> } | undefined
      if (Array.isArray(bEn?.blocks)) {
        bodyText += " " + bEn.blocks.map((bl) => bl.text || bl.html || "").join(" ")
      }
      const bId = b.id as { blocks?: Array<{ text?: string; html?: string }> } | undefined
      if (Array.isArray(bId?.blocks)) {
        bodyText += " " + bId.blocks.map((bl) => bl.text || bl.html || "").join(" ")
      }
    }
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

  const response = await cmsListFetch<NewsItem>(`/news?${query.toString()}`, createNewsFallback(filters))
  if (response && Array.isArray(response.data)) {
    response.data = response.data.map((item) => enrichNewsWithBilingual(item, item.slug) || item)
  }
  return response
}

export async function getNewsItem(slug: string) {
  const fallback = fallbackNews.data.find((item) => item.slug === slug) ?? enrichNewsWithBilingual(null, slug)
  const item = await cmsFetch<NewsItem | null>(`/news/${slug}`, fallback)
  return enrichNewsWithBilingual(item, slug)
}

function careerMatchesLocation(item: Career, location: string): boolean {
  if (!item.location) return false
  const current = item.location.trim().toLowerCase()
  const requested = location.trim().toLowerCase()
  return (
    current === requested ||
    current.includes(requested) ||
    requested.includes(current) ||
    normalizeFilterValue(item.location) === normalizeFilterValue(location)
  )
}

function careerMatchesDepartment(item: Career, department: string): boolean {
  if (!item.department) return false
  const current = item.department.trim().toLowerCase()
  const requested = department.trim().toLowerCase()
  return (
    current === requested ||
    current.includes(requested) ||
    requested.includes(current) ||
    normalizeFilterValue(item.department) === normalizeFilterValue(department)
  )
}

function createCareerFallback(filters?: CareerFilters): ListResponse<Career> {
  const search = filters?.search?.trim().toLowerCase() ?? ""
  const location = filters?.location?.trim().toLowerCase() ?? ""
  const department = filters?.department?.trim().toLowerCase() ?? ""
  const employmentType = filters?.type?.trim().toLowerCase() ?? ""

  let data = fallbackCareers.data.filter((item) => {
    if (location && !careerMatchesLocation(item, location)) return false
    if (department && !careerMatchesDepartment(item, department)) return false
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
  const response = await cmsListFetch<Career>(`/careers?${query.toString()}`, fallback)
  if (response && Array.isArray(response.data)) {
    response.data = response.data.map((item) => enrichCareerWithBilingual(item, item.slug) || item)
  }
  return response
}

export async function getCareer(slug: string) {
  const fallback = fallbackCareers.data.find((item) => item.slug === slug) ?? enrichCareerWithBilingual(null, slug)
  const item = await cmsFetch<Career | null>(`/careers/${slug}`, fallback)
  return enrichCareerWithBilingual(item, slug)
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
  const res = await cmsListFetch<PageContent>(path, defaultFallback)
  return {
    ...res,
    data: res.data.map((page) => enrichPageWithBilingual(page, page.key)),
  }
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
  const result: ContentNode[] = []
  function collect(nodes: ContentNode[]) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      result.push(node)
      if (node.children && node.children.length > 0) {
        collect(node.children)
      }
    }
  }
  collect(items)
  return result
}

// Memoized pre-sorted node caches for O(log n) binary search
let sortedFallbackProductsCache: ContentNode[] | null = null
let sortedFallbackServicesCache: ContentNode[] | null = null

function getSortedFallbackProducts(): ContentNode[] {
  if (!sortedFallbackProductsCache) {
    sortedFallbackProductsCache = flattenContent(fallbackProducts).sort((a, b) =>
      (a.fullPath || a.slug).localeCompare(b.fullPath || b.slug)
    )
  }
  return sortedFallbackProductsCache
}

function getSortedFallbackServices(): ContentNode[] {
  if (!sortedFallbackServicesCache) {
    sortedFallbackServicesCache = flattenContent(fallbackServices).sort((a, b) =>
      (a.fullPath || a.slug).localeCompare(b.fullPath || b.slug)
    )
  }
  return sortedFallbackServicesCache
}

/**
 * Performs a binary search on a lexicographically sorted array of ContentNodes.
 * Complexity: O(log n) comparisons vs O(n) linear tree scan.
 */
export function binarySearchByPath(sortedNodes: ContentNode[], targetPath: string): ContentNode | null {
  let low = 0
  let high = sortedNodes.length - 1

  while (low <= high) {
    const mid = (low + high) >>> 1
    const midNode = sortedNodes[mid]
    const midPath = midNode.fullPath || midNode.slug

    if (midPath === targetPath) {
      return midNode
    } else if (midPath < targetPath) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return null
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
  if (items === fallbackProducts) {
    return binarySearchByPath(getSortedFallbackProducts(), path)
  }
  if (items === fallbackServices) {
    return binarySearchByPath(getSortedFallbackServices(), path)
  }
  for (const item of items) {
    if (item.fullPath === path || item.slug === path) return item
    if (item.children && item.children.length > 0) {
      const found = findNodeInTree(item.children, path)
      if (found) return found
    }
  }
  return null
}

function findByPath(items: ContentNode[], path: string): ContentNode | null {
  if (items === fallbackProducts) {
    return binarySearchByPath(getSortedFallbackProducts(), path)
  }
  if (items === fallbackServices) {
    return binarySearchByPath(getSortedFallbackServices(), path)
  }
  return findNodeInTree(items, path)
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
