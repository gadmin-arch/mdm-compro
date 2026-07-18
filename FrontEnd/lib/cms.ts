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
    id: "service-electrical",
    slug: "electrical-engineering",
    fullPath: "electrical-engineering",
    title: "Electrical Engineering",
    summary: "Complete electrical lifecycle support for industrial and infrastructure facilities.",
    imageUrl: "/placeholder.jpg",
    status: "published",
    sortOrder: 1,
    depth: 0,
  },
  {
    id: "service-automation",
    slug: "automation",
    fullPath: "automation",
    title: "Automation",
    summary: "PLC, HMI, SCADA, monitoring, and control system integration.",
    imageUrl: "/placeholder.jpg",
    status: "published",
    sortOrder: 2,
    depth: 0,
  },
  {
    id: "service-maintenance",
    slug: "maintenance",
    fullPath: "maintenance",
    title: "Maintenance",
    summary: "Predictive, preventive, and operational maintenance services.",
    imageUrl: "/placeholder.jpg",
    status: "published",
    sortOrder: 3,
    depth: 0,
  },
]

export const fallbackProducts: ContentNode[] = [
  {
    id: "product-testing",
    slug: "testing-equipment",
    fullPath: "testing-equipment",
    title: "Testing Equipment",
    summary: "Electrical testing equipment and commissioning tools.",
    imageUrl: "/placeholder.jpg",
    specs: { Category: "Testing" },
    status: "published",
    sortOrder: 1,
    depth: 0,
  },
  {
    id: "product-relay",
    slug: "protection-relay",
    fullPath: "protection-relay",
    title: "Protection Relay",
    summary: "Protection relay devices and related engineering support.",
    imageUrl: "/placeholder.jpg",
    specs: { Category: "Protection" },
    status: "published",
    sortOrder: 2,
    depth: 0,
  },
  {
    id: "product-instrumentation",
    slug: "instrumentation",
    fullPath: "instrumentation",
    title: "Instrumentation",
    summary: "Instrumentation devices for monitoring and control.",
    imageUrl: "/placeholder.jpg",
    specs: { Category: "Instrumentation" },
    status: "published",
    sortOrder: 3,
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
        "Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.",
      vision: "To become a global electrical, automation, and fire alarm services company.",
      mission: "Build mutual partnerships and deliver every engagement with professional excellence.",
      values: ["Safety", "Reliability", "Professionalism", "Partnership"],
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
          name: "Workshop",
          address: "Ruko Jati Kepuh Indah E-21, Sidoarjo 61271, East Java, Indonesia",
          phone: "+62 811 830 3250",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
        },
        {
          name: "Surabaya Operations Branch",
          address: "Royal Park Residence Blok R No. 23, Gunung Anyar Tambak, Gunung Anyar, Surabaya 60294, Jawa Timur, Indonesia",
          email: "info@multidayamitra.co.id"
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
export async function cmsFetch<T>(path: string, fallback: T, revalidate = 300): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate, tags: ["cms"] },
      headers: { Accept: "application/json" },
    })
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
  socials: { label: string; url: string }[]
}

export const fallbackSiteSettings: SiteSettings = {
  tagline: "Electrical · Automation · Fire System",
  footerDescription:
    "Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013.",
  email: "info@multidayamitra.co.id",
  phone: "+62 31 592 1256",
  fax: "+62 31 591 7845",
  address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
  socials: [],
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
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value))
}

export function employmentTypeLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
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
