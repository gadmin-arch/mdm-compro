import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminLoginLocation, adminRefreshLocation } from "@/lib/admin-auth"
import { generateDevAdminJwt } from "@/lib/dev-jwt"
import { defaultMenuItems, type Career, type ContentNode, type ListResponse, type MenuItem, type NewsItem, type PageContent } from "@/lib/cms"


const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const ADMIN_BASE = API_BASE.replace("/public", "/admin")

export type AdminPagesResponse = ListResponse<PageContent>
export type AdminContentResponse = ListResponse<ContentNode>
export type AdminNewsResponse = ListResponse<NewsItem>
export type AdminCareersResponse = ListResponse<Career>
export type AdminUser = {
  id: string
  email: string
  name: string
  isActive: boolean
  role: "owner" | "admin" | "user"
  permissions: string[]
  createdAt: string
}

export type AdminUsersResponse = {
  data: AdminUser[]
  currentUserId: string
  currentRole: "owner" | "admin" | "user"
}

export type AdminDashboardResponse = {
  counts?: Record<string, number>
  statuses?: Record<string, Record<string, number>>
}

export type AdminContactInquiry = {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: string
  createdAt: string
  version: number
}

export type AdminContactsResponse = {
  data: AdminContactInquiry[] | null
  pagination: { page: number; perPage: number; total: number; totalPages: number }
}

export type AdminActivityEntry = {
  id: string
  action: string
  entityType: string
  entityId?: string
  label?: string
  actorName?: string
  createdAt: string
}

export type ArchivedItem = {
  id: string
  title: string
  type: "page" | "service" | "product" | "news" | "career"
  deletedAt: string
  version: number
}

export type AdminArchiveResponse = {
  data: ArchivedItem[]
}


export type AdminMediaUpload = {
  id: string
  fileName: string
  objectKey: string
  url: string
  mimeType: string
  sizeBytes: number
  createdAt?: string
}

export type AdminMediaResponse = ListResponse<AdminMediaUpload>

// One row of the backend settings key/value store (e.g. key "site").
export type AdminSetting = {
  id?: string
  key: string
  value: Record<string, unknown>
  version: number
  updatedAt?: string
}

export type PageUpdatePayload = {
  key: string
  title: string
  content: unknown
  status: string
  publishedAt: string | null
  seo: {
    title?: string
    description?: string
    canonical?: string
    noIndex?: boolean
  }
  version: number
}

export type PageCreatePayload = Omit<PageUpdatePayload, "version">

export type ContentItemPayload = {
  parentId?: string | null
  slug: string
  title: string
  summary: string
  content: unknown
  imageUrl: string
  specs?: Record<string, string>
  datasheetUrl?: string
  status: string
  publishedAt: string | null
  sortOrder: number
  seo?: {
    title?: string
    description?: string
    canonical?: string
    noIndex?: boolean
  }
  version?: number
}

export type NewsPayload = {
  slug: string
  title: string
  excerpt: string
  body: unknown
  category: string
  featuredImageUrl: string
  featured: boolean
  status: string
  publishedAt: string | null
  seo?: {
    title?: string
    description?: string
    canonical?: string
    noIndex?: boolean
  }
  version?: number
}

export type CareerPayload = {
  slug: string
  title: string
  summary: string
  description: unknown
  department: string
  location: string
  employmentType: string
  applyUrl: string
  deadline: string | null
  status: string
  publishedAt: string | null
  version?: number
}

// --- analytics ---

export type AnalyticsOverview = {
  visitors: number
  uniqueVisitors: number
  sessions: number
  pageViews: number
  newVisitors: number
  returningVisitors: number
  avgSessionSec: number
  bounceRate: number
}

export type AnalyticsTimePoint = { bucket: string; views: number; sessions: number; visitors: number }
export type AnalyticsBreakdownRow = { value: string; sessions: number }
export type AnalyticsPageRow = {
  path: string
  views: number
  uniqueViews: number
  avgTimeSec: number
  avgScroll: number
  entries: number
  exits: number
  exitRate: number
  engagement: number
}
export type AnalyticsEntryExitRow = { path: string; sessions: number }
export type AnalyticsEventRow = { name: string; count: number }
export type AnalyticsVitalRow = { metric: string; avg: number; max: number; samples: number; rating: string }
export type AnalyticsSlowPageRow = { path: string; avgMs: number; samples: number }

export type AnalyticsDashboardResponse = {
  overview: AnalyticsOverview
  previous: AnalyticsOverview
  timeSeries: AnalyticsTimePoint[] | null
  interval: string
  breakdowns: Record<string, AnalyticsBreakdownRow[] | null>
  pages: AnalyticsPageRow[] | null
  entryPages: AnalyticsEntryExitRow[] | null
  exitPages: AnalyticsEntryExitRow[] | null
  events: AnalyticsEventRow[] | null
  vitals: AnalyticsVitalRow[] | null
  slowPages: AnalyticsSlowPageRow[] | null
  api: { requests: number; errors: number; avgMs: number }
  clientErrors: number
  from: string
  to: string
}

export type AnalyticsRealtimeResponse = {
  activeVisitors: number
  pages: AnalyticsEntryExitRow[] | null
  events: { at: string; type: string; name: string; path: string; country: string; device: string }[] | null
}

export type AnalyticsAdminActivityResponse = {
  logins: number
  failedLogins: number
  contentCreated: number
  contentUpdated: number
  contentPublished: number
  recentAudit: AdminActivityEntry[] | null
}

export type AnalyticsFilterOptionsResponse = { paths: string[] | null; countries: string[] | null }

// --- security / two-factor ---

export type AdminTrustedDevice = {
  id: string
  label: string
  ip: string
  createdAt: string
  lastUsedAt: string
  expiresAt: string
}

export type AdminLoginHistoryEntry = {
  id: string
  action: string
  ip: string
  userAgent: string
  createdAt: string
}

// --- short links / redirects ---

export type AdminRedirect = {
  id: string
  name: string
  slug: string
  destination: string
  description: string
  redirectType: number
  isActive: boolean
  expiresAt?: string | null
  createdAt: string
  updatedAt: string
  version: number
  totalScans: number
}

export type AdminRedirectsResponse = ListResponse<AdminRedirect>

export type RedirectTrendPoint = { bucket: string; scans: number; uniques: number }

export type RedirectScan = {
  at: string
  country: string
  device: string
  browser: string
  os: string
  referrer: string
}

export type RedirectScanStats = {
  totalScans: number
  uniqueScans: number
  trend: RedirectTrendPoint[] | null
  countries: AnalyticsBreakdownRow[] | null
  devices: AnalyticsBreakdownRow[] | null
  browsers: AnalyticsBreakdownRow[] | null
  os: AnalyticsBreakdownRow[] | null
  referrers: AnalyticsBreakdownRow[] | null
  recent: RedirectScan[] | null
}

export type RedirectStatsResponse = {
  redirect: AdminRedirect
  stats: RedirectScanStats
  shortUrl: string
}

export type RedirectDashboardResponse = {
  top: { slug: string; name: string; scans: number; active: boolean }[] | null
  trend: RedirectTrendPoint[] | null
  recent: (RedirectScan & { slug: string })[] | null
  geo: AnalyticsBreakdownRow[] | null
}

export type RedirectPayload = {
  name: string
  slug: string
  destination: string
  description: string
  redirectType: number
  isActive: boolean
  expiresAt: string | null
  version?: number
}

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: string,
    // Per-field validation messages from the API (keyed by field name).
    readonly fields?: Record<string, string>,
  ) {
    super(message)
  }
}

import {
  aboutPresetSections,
  presetSectionsForKey,
} from "@/lib/sections"
import { BILINGUAL_PRODUCT_CATALOG, enrichProductWithBilingual } from "@/lib/product-bilingual"
import { BILINGUAL_SERVICE_CATALOG, enrichServiceWithBilingual } from "@/lib/service-bilingual"
import { BILINGUAL_NEWS_CATALOG, enrichNewsWithBilingual } from "@/lib/news-bilingual"
import { BILINGUAL_CAREER_CATALOG, enrichCareerWithBilingual } from "@/lib/career-bilingual"

// In-memory dev store for local development when Go backend is offline
let devPagesInitialized = false
const devPagesMap = new Map<string, PageContent>()

let devCatalogInitialized = false
const devProductsMap = new Map<string, ContentNode>()
const devServicesMap = new Map<string, ContentNode>()
const devNewsMap = new Map<string, NewsItem>()
const devCareersMap = new Map<string, Career>()
let devNavigationItems: MenuItem[] = [...defaultMenuItems]
let devNavigationVersion = 1
let devRedirectsList: Array<{
  id: string
  code: string
  targetUrl: string
  title?: string
  status: string
  createdAt: string
  scanCount: number
}> = []
let devArchiveList: ArchivedItem[] = []


function initDevCatalog() {
  if (devCatalogInitialized) return
  devCatalogInitialized = true
  try {
    for (const [key, entry] of Object.entries(BILINGUAL_PRODUCT_CATALOG)) {
      const enriched = enrichProductWithBilingual(null, key)
      if (enriched) {
        const id = entry.id || enriched.id || key
        const item: ContentNode = { ...enriched, id, version: 1 }
        devProductsMap.set(id, item)
        devProductsMap.set(entry.slug, item)
      }
    }

    for (const [key, entry] of Object.entries(BILINGUAL_SERVICE_CATALOG)) {
      const enriched = enrichServiceWithBilingual(null, key)
      if (enriched) {
        const id = entry.id || enriched.id || key
        const item: ContentNode = { ...enriched, id, version: 1 }
        devServicesMap.set(id, item)
        devServicesMap.set(entry.slug, item)
      }
    }

    for (const [key, entry] of Object.entries(BILINGUAL_NEWS_CATALOG)) {
      const enriched = enrichNewsWithBilingual(null, key)
      if (enriched) {
        const id = entry.id || enriched.id || key
        const item: NewsItem = { ...enriched, id, version: 1 }
        devNewsMap.set(id, item)
        devNewsMap.set(entry.slug, item)
      }
    }

    for (const [key, entry] of Object.entries(BILINGUAL_CAREER_CATALOG)) {
      const enriched = enrichCareerWithBilingual(null, key)
      if (enriched) {
        const id = entry.id || enriched.id || key
        const item: Career = { ...enriched, id, version: 1 }
        devCareersMap.set(id, item)
        devCareersMap.set(entry.slug, item)
      }
    }
  } catch (e) {
    console.error("Failed to initialize dev catalog:", e)
  }
}

function initDevPages() {
  if (devPagesInitialized) return
  devPagesInitialized = true
  try {
    const pages: PageContent[] = [
      {
        id: "00000000-0000-0000-0000-000000000401",
        key: "about",
        title: "EN: About PT Multi Daya Mitra\nID: Tentang PT Multi Daya Mitra",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: aboutPresetSections() },
      },
      {
        id: "00000000-0000-0000-0000-000000000403",
        key: "home",
        title: "EN: Home\nID: Beranda",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: presetSectionsForKey("home") ?? [] },
      },
      {
        id: "00000000-0000-0000-0000-000000000404",
        key: "services",
        title: "EN: Services\nID: Layanan",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: presetSectionsForKey("services") ?? [] },
      },
      {
        id: "00000000-0000-0000-0000-000000000405",
        key: "products",
        title: "EN: Products\nID: Produk",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: presetSectionsForKey("products") ?? [] },
      },
      {
        id: "00000000-0000-0000-0000-000000000406",
        key: "news",
        title: "EN: News & Insights\nID: Berita & Artikel",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: presetSectionsForKey("news") ?? [] },
      },
      {
        id: "00000000-0000-0000-0000-000000000407",
        key: "career",
        title: "EN: Careers\nID: Karir",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: presetSectionsForKey("career") ?? [] },
      },
      {
        id: "00000000-0000-0000-0000-000000000402",
        key: "contact",
        title: "EN: Contact PT Multi Daya Mitra\nID: Hubungi PT Multi Daya Mitra",
        status: "published",
        publishedAt: "2026-01-01T00:00:00Z",
        version: 1,
        content: { sections: presetSectionsForKey("contact") ?? [] },
      },
    ]

    for (const p of pages) {
      devPagesMap.set(p.id, p)
      devPagesMap.set(p.key, p)
    }
  } catch (e) {
    console.error("Failed to initialize dev pages:", e)
  }
}

function handleDevFallback<T>(path: string, init: RequestInit = {}): T | undefined {
  initDevPages()
  initDevCatalog()

  if (path === "/profile") {
    return {
      id: "00000000-0000-0000-0000-000000000301",
      email: "irfanzuhdiabdillah@gmail.com",
      name: "Irfan Zuhdi Abdillah (Dev)",
      role: "owner",
      isActive: true,
      permissions: ["*"],
      createdAt: "2026-01-01T00:00:00Z",
    } as T
  }

  if (path === "/dashboard") {
    return {
      counts: { pages: 7, services: 3, products: 3, news: 2, careers: 2 },
      statuses: { pages: { published: 7 } },
    } as T
  }

  if (path === "/contacts" || path.startsWith("/contacts?")) {
    return { data: [], pagination: { page: 1, perPage: 20, total: 0, totalPages: 0 } } as T
  }

  if (path === "/activity" || path.startsWith("/activity?")) {
    return { data: [] } as T
  }

  if (path === "/users" || path.startsWith("/users?")) {
    return {
      data: [
        {
          id: "00000000-0000-0000-0000-000000000301",
          email: "irfanzuhdiabdillah@gmail.com",
          name: "Irfan Zuhdi Abdillah (Dev)",
          role: "owner",
          isActive: true,
          permissions: ["*"],
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
      currentUserId: "00000000-0000-0000-0000-000000000301",
      currentRole: "owner",
    } as T
  }

  if (path === "/media" || path.startsWith("/media?")) {
    return { data: [], pagination: { page: 1, perPage: 20, total: 0, totalPages: 0 } } as T
  }

  if (path.startsWith("/settings/")) {
    const key = path.replace("/settings/", "")
    return { id: `dev-${key}`, key, value: {}, version: 1 } as T
  }

  if (path === "/navigation") {
    const method = (init.method || "GET").toUpperCase()
    if (method === "GET") {
      return {
        items: devNavigationItems,
        version: devNavigationVersion,
      } as T
    }

    if (method === "PUT" || method === "PATCH") {
      let payload: { items?: MenuItem[]; version?: number } = {}
      try {
        if (typeof init.body === "string") payload = JSON.parse(init.body)
      } catch {}
      if (Array.isArray(payload.items)) {
        devNavigationItems = payload.items
      }
      devNavigationVersion += 1
      return {
        items: devNavigationItems,
        version: devNavigationVersion,
      } as T
    }
  }

  if (path === "/redirects" || path.startsWith("/redirects?")) {
    return {
      data: devRedirectsList,
      pagination: { page: 1, perPage: 20, total: devRedirectsList.length, totalPages: 1 },
    } as T
  }

  if (path === "/redirects/dashboard") {
    return {
      totalLinks: devRedirectsList.length,
      activeLinks: devRedirectsList.filter((r) => r.status === "active").length,
      totalScans: devRedirectsList.reduce((acc, curr) => acc + (curr.scanCount || 0), 0),
      topLinks: [],
      recentScans: [],
      trend: [],
    } as T
  }

  if (path === "/archive" || path.startsWith("/archive?")) {
    const searchParams = new URL(path, "http://localhost").searchParams
    const q = (searchParams.get("q") ?? "").toLowerCase().trim()
    const filtered = q
      ? devArchiveList.filter((item) => item.title.toLowerCase().includes(q))
      : devArchiveList
    return { data: filtered } as T
  }

  const archiveRestoreMatch = path.match(/^\/archive\/([^/]+)\/([^/]+)\/restore$/)
  if (archiveRestoreMatch && (init.method || "GET").toUpperCase() === "POST") {
    const [, itemType, itemId] = archiveRestoreMatch
    devArchiveList = devArchiveList.filter((item) => item.id !== itemId)
    return { ok: true } as T
  }

  const archiveDeleteMatch = path.match(/^\/archive\/([^/]+)\/([^/]+)$/)
  if (archiveDeleteMatch && (init.method || "GET").toUpperCase() === "DELETE") {
    const [, itemType, itemId] = archiveDeleteMatch
    devArchiveList = devArchiveList.filter((item) => item.id !== itemId)
    return { ok: true } as T
  }

  // Handling /pages
  if (path === "/pages" || path.startsWith("/pages?")) {
    const list = Array.from(
      new Set(Array.from(devPagesMap.values()).map((p) => p.id)),
    ).map((id) => devPagesMap.get(id)!)

    return {
      data: list,
      pagination: {
        page: 1,
        perPage: 20,
        total: list.length,
        totalPages: 1,
      },
    } as T
  }

  // Handling /pages/[id]
  const pageMatch = path.match(/^\/pages\/([^?]+)/)
  if (pageMatch) {
    const pageId = pageMatch[1]
    const method = (init.method || "GET").toUpperCase()

    if (method === "GET") {
      const page = devPagesMap.get(pageId)
      if (page) return page as T
      // If not found by exact id, search by key
      for (const p of devPagesMap.values()) {
        if (p.key === pageId || p.id === pageId) return p as T
      }
      // Fallback dummy page
      return {
        id: pageId,
        key: pageId,
        title: pageId.charAt(0).toUpperCase() + pageId.slice(1),
        status: "published",
        publishedAt: new Date().toISOString(),
        version: 1,
        content: { sections: [] },
      } as T
    }

    if (method === "PUT" || method === "PATCH") {
      let payload: Partial<PageContent> = {}
      try {
        if (typeof init.body === "string") {
          payload = JSON.parse(init.body)
        }
      } catch {}

      const existing = devPagesMap.get(pageId) || {
        id: pageId,
        key: payload.key || pageId,
        title: payload.title || "Page",
        status: payload.status || "published",
        publishedAt: payload.publishedAt || new Date().toISOString(),
        version: 1,
        content: payload.content || {},
      }

      const updated: PageContent = {
        ...existing,
        ...payload,
        id: existing.id,
        version: (existing.version || 1) + 1,
      }

      devPagesMap.set(updated.id, updated)
      devPagesMap.set(updated.key, updated)
      return updated as T
    }

    if (method === "DELETE") {
      devPagesMap.delete(pageId)
      return null as T
    }
  }

  if (path === "/pages" && init.method === "POST") {
    let payload: Partial<PageContent> = {}
    try {
      if (typeof init.body === "string") {
        payload = JSON.parse(init.body)
      }
    } catch {}

    const newId = `dev-page-${Date.now()}`
    const created: PageContent = {
      id: newId,
      key: payload.key || `page-${Date.now()}`,
      title: payload.title || "New Page",
      status: payload.status || "draft",
      publishedAt: payload.publishedAt || undefined,
      version: 1,
      content: payload.content || { sections: [] },
    }

    devPagesMap.set(created.id, created)
    devPagesMap.set(created.key, created)
    return created as T
  }

  // Handling /products
  if (path === "/products" || path.startsWith("/products?")) {
    const list = Array.from(new Set(Array.from(devProductsMap.values()).map((p) => p.id))).map((id) => devProductsMap.get(id)!)
    return {
      data: list,
      pagination: {
        page: 1,
        perPage: 100,
        total: list.length,
        totalPages: 1,
      },
    } as T
  }

  const productMatch = path.match(/^\/products\/([^?]+)/)
  if (productMatch) {
    const productId = productMatch[1]
    const method = (init.method || "GET").toUpperCase()

    if (method === "GET") {
      const item = devProductsMap.get(productId) || Array.from(devProductsMap.values()).find((p) => p.slug === productId || p.id === productId)
      if (item) return item as T
      return undefined
    }

    if (method === "PUT" || method === "PATCH") {
      let payload: any = {}
      try {
        if (typeof init.body === "string") payload = JSON.parse(init.body)
      } catch {}

      const existing = devProductsMap.get(productId) || Array.from(devProductsMap.values()).find((p) => p.slug === productId || p.id === productId)
      const updated: ContentNode = {
        ...(existing || {}),
        ...payload,
        id: existing?.id || productId,
        version: ((existing?.version ?? 0) || 1) + 1,
      }
      devProductsMap.set(updated.id, updated)
      devProductsMap.set(updated.slug, updated)
      return updated as T
    }

    if (method === "DELETE") {
      devProductsMap.delete(productId)
      return null as T
    }
  }

  if (path === "/products" && init.method === "POST") {
    let payload: any = {}
    try {
      if (typeof init.body === "string") payload = JSON.parse(init.body)
    } catch {}
    const newId = `dev-prod-${Date.now()}`
    const created: ContentNode = {
      id: newId,
      slug: payload.slug || `prod-${Date.now()}`,
      fullPath: payload.fullPath || payload.slug || `prod-${Date.now()}`,
      title: payload.title || "New Product",
      summary: payload.summary || "",
      status: payload.status || "draft",
      sortOrder: payload.sortOrder || 1,
      depth: 0,
      version: 1,
      children: [],
      ...payload,
    }
    devProductsMap.set(created.id, created)
    devProductsMap.set(created.slug, created)
    return created as T
  }

  // Handling /services
  if (path === "/services" || path.startsWith("/services?")) {
    const list = Array.from(new Set(Array.from(devServicesMap.values()).map((p) => p.id))).map((id) => devServicesMap.get(id)!)
    return {
      data: list,
      pagination: {
        page: 1,
        perPage: 100,
        total: list.length,
        totalPages: 1,
      },
    } as T
  }

  const serviceMatch = path.match(/^\/services\/([^?]+)/)
  if (serviceMatch) {
    const serviceId = serviceMatch[1]
    const method = (init.method || "GET").toUpperCase()

    if (method === "GET") {
      const item = devServicesMap.get(serviceId) || Array.from(devServicesMap.values()).find((p) => p.slug === serviceId || p.id === serviceId)
      if (item) return item as T
      return undefined
    }

    if (method === "PUT" || method === "PATCH") {
      let payload: any = {}
      try {
        if (typeof init.body === "string") payload = JSON.parse(init.body)
      } catch {}

      const existing = devServicesMap.get(serviceId) || Array.from(devServicesMap.values()).find((p) => p.slug === serviceId || p.id === serviceId)
      const updated: ContentNode = {
        ...(existing || {}),
        ...payload,
        id: existing?.id || serviceId,
        version: ((existing?.version ?? 0) || 1) + 1,
      }
      devServicesMap.set(updated.id, updated)
      devServicesMap.set(updated.slug, updated)
      return updated as T
    }

    if (method === "DELETE") {
      devServicesMap.delete(serviceId)
      return null as T
    }
  }

  if (path === "/services" && init.method === "POST") {
    let payload: any = {}
    try {
      if (typeof init.body === "string") payload = JSON.parse(init.body)
    } catch {}
    const newId = `dev-serv-${Date.now()}`
    const created: ContentNode = {
      id: newId,
      slug: payload.slug || `serv-${Date.now()}`,
      fullPath: payload.fullPath || payload.slug || `serv-${Date.now()}`,
      title: payload.title || "New Service",
      summary: payload.summary || "",
      status: payload.status || "draft",
      sortOrder: payload.sortOrder || 1,
      depth: 0,
      version: 1,
      children: [],
      ...payload,
    }
    devServicesMap.set(created.id, created)
    devServicesMap.set(created.slug, created)
    return created as T
  }

  // Handling /news
  if (path === "/news" || path.startsWith("/news?")) {
    const list = Array.from(new Set(Array.from(devNewsMap.values()).map((p) => p.id))).map((id) => devNewsMap.get(id)!)
    return {
      data: list,
      pagination: {
        page: 1,
        perPage: 50,
        total: list.length,
        totalPages: 1,
      },
    } as T
  }

  const newsMatch = path.match(/^\/news\/([^?]+)/)
  if (newsMatch) {
    const newsId = newsMatch[1]
    const method = (init.method || "GET").toUpperCase()

    if (method === "GET") {
      const item = devNewsMap.get(newsId) || Array.from(devNewsMap.values()).find((p) => p.slug === newsId || p.id === newsId)
      if (item) return item as T
      return undefined
    }

    if (method === "PUT" || method === "PATCH") {
      let payload: any = {}
      try {
        if (typeof init.body === "string") payload = JSON.parse(init.body)
      } catch {}

      const existing = devNewsMap.get(newsId) || Array.from(devNewsMap.values()).find((p) => p.slug === newsId || p.id === newsId)
      const updated: NewsItem = {
        ...(existing || {}),
        ...payload,
        id: existing?.id || newsId,
        version: ((existing?.version ?? 0) || 1) + 1,
      }
      devNewsMap.set(updated.id, updated)
      devNewsMap.set(updated.slug, updated)
      return updated as T
    }

    if (method === "DELETE") {
      devNewsMap.delete(newsId)
      return null as T
    }
  }

  if (path === "/news" && init.method === "POST") {
    let payload: any = {}
    try {
      if (typeof init.body === "string") payload = JSON.parse(init.body)
    } catch {}
    const newId = `dev-news-${Date.now()}`
    const created: NewsItem = {
      id: newId,
      slug: payload.slug || `news-${Date.now()}`,
      title: payload.title || "New Article",
      excerpt: payload.excerpt || "",
      category: payload.category || "Company",
      status: payload.status || "draft",
      version: 1,
      ...payload,
    }
    devNewsMap.set(created.id, created)
    devNewsMap.set(created.slug, created)
    return created as T
  }

  // Handling /careers
  if (path === "/careers" || path.startsWith("/careers?")) {
    const list = Array.from(new Set(Array.from(devCareersMap.values()).map((p) => p.id))).map((id) => devCareersMap.get(id)!)
    return {
      data: list,
      pagination: {
        page: 1,
        perPage: 50,
        total: list.length,
        totalPages: 1,
      },
    } as T
  }

  const careerMatch = path.match(/^\/careers\/([^?]+)/)
  if (careerMatch) {
    const careerId = careerMatch[1]
    const method = (init.method || "GET").toUpperCase()

    if (method === "GET") {
      const item = devCareersMap.get(careerId) || Array.from(devCareersMap.values()).find((p) => p.slug === careerId || p.id === careerId)
      if (item) return item as T
      return undefined
    }

    if (method === "PUT" || method === "PATCH") {
      let payload: any = {}
      try {
        if (typeof init.body === "string") payload = JSON.parse(init.body)
      } catch {}

      const existing = devCareersMap.get(careerId) || Array.from(devCareersMap.values()).find((p) => p.slug === careerId || p.id === careerId)
      const updated: Career = {
        ...(existing || {}),
        ...payload,
        id: existing?.id || careerId,
        version: ((existing?.version ?? 0) || 1) + 1,
      }
      devCareersMap.set(updated.id, updated)
      devCareersMap.set(updated.slug, updated)
      return updated as T
    }

    if (method === "DELETE") {
      devCareersMap.delete(careerId)
      return null as T
    }
  }

  if (path === "/careers" && init.method === "POST") {
    let payload: any = {}
    try {
      if (typeof init.body === "string") payload = JSON.parse(init.body)
    } catch {}
    const newId = `dev-career-${Date.now()}`
    const created: Career = {
      id: newId,
      slug: payload.slug || `career-${Date.now()}`,
      title: payload.title || "New Position",
      summary: payload.summary || "",
      department: payload.department || "Engineering",
      location: payload.location || "Surabaya, East Java",
      employmentType: payload.employmentType || "full_time",
      status: payload.status || "draft",
      version: 1,
      ...payload,
    }
    devCareersMap.set(created.id, created)
    devCareersMap.set(created.slug, created)
    return created as T
  }

  if (path.startsWith("/analytics/dashboard")) {
    return {
      overview: { visitors: 1, uniqueVisitors: 1, sessions: 1, pageViews: 1, newVisitors: 1, returningVisitors: 0, avgSessionSec: 60, bounceRate: 0 },
      previous: { visitors: 0, uniqueVisitors: 0, sessions: 0, pageViews: 0, newVisitors: 0, returningVisitors: 0, avgSessionSec: 0, bounceRate: 0 },
      timeSeries: [{ bucket: new Date().toISOString().slice(0, 10), views: 1, sessions: 1, visitors: 1 }],
      interval: "day",
      breakdowns: { browser: [], city: [], country: [], device: [], language: [], os: [], screen: [], source: [] },
      pages: [{ path: "/", views: 1, uniqueViews: 1, avgTimeSec: 60, avgScroll: 0, entries: 1, exits: 0, exitRate: 0, engagement: 100 }],
      entryPages: [{ path: "/", sessions: 1 }],
      exitPages: [],
      events: null,
      vitals: [{ metric: "TTFB", avg: 6.0, max: 6.1, samples: 1, rating: "good" }],
      slowPages: null,
      api: { requests: 1, errors: 0, avgMs: 5 },
      clientErrors: 0,
      from: new Date().toISOString(),
      to: new Date().toISOString(),
    } as T
  }

  if (path === "/analytics/realtime") {
    return { activeVisitors: 1, pages: [{ path: "/", count: 1 }], events: [] } as T
  }

  if (path === "/analytics/admin-activity") {
    return { data: [], total: 0 } as T
  }

  if (path === "/analytics/options") {
    return { paths: ["/", "/about", "/services", "/products", "/contact"], countries: ["ID"] } as T
  }

  return undefined
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
  nextPath = "/admin",
  opts: { redirectOn401?: boolean } = {},
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("cms_admin_token")?.value
  const isDev = process.env.NODE_ENV === "development" && !process.env.VERCEL

  if (!token && !isDev) {
    const refreshToken = cookieStore.get("cms_refresh_token")?.value
    redirect(refreshToken ? adminRefreshLocation(nextPath) : adminLoginLocation(nextPath))
  }

  let effectiveToken = token
  if (isDev && (!token || token === "dev-bypass-admin-token")) {
    effectiveToken = generateDevAdminJwt()
  }

  const headers = new Headers(init.headers)
  headers.set("Accept", "application/json")
  if (effectiveToken) {
    headers.set("Authorization", `Bearer ${effectiveToken}`)
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  let response: Response | null = null
  let networkFailed = false

  try {
    response = await fetch(`${ADMIN_BASE}${path}`, {
      ...init,
      headers,
      cache: init.cache ?? "no-store",
    })
  } catch (err) {
    if (isDev) {
      networkFailed = true
    } else {
      throw err
    }
  }

  // In local development, if Go backend is not reachable or returns error:
  if (isDev && (networkFailed || (response && (!response.ok && (response.status === 401 || response.status === 404 || response.status >= 500))))) {
    const fallback = handleDevFallback<T>(path, init)
    if (fallback !== undefined) {
      return fallback
    }
  }

  if (!response) {
    throw new AdminApiError(503, "Backend service unavailable")
  }

  // Some endpoints use 401 for domain errors (e.g. wrong current password);
  // callers that expect that pass redirectOn401: false and handle it.
  if (response.status === 401 && opts.redirectOn401 !== false) {
    if (isDev) {
      const fallback = handleDevFallback<T>(path, init)
      if (fallback !== undefined) {
        return fallback
      }
    }
    const refreshToken = cookieStore.get("cms_refresh_token")?.value
    redirect(refreshToken ? adminRefreshLocation(nextPath) : adminLoginLocation(nextPath))
  }

  if (!response.ok) {
    throw await toAdminApiError(response)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}

export async function adminUpload(formData: FormData, nextPath = "/admin"): Promise<AdminMediaUpload> {
  const cookieStore = await cookies()
  const token = cookieStore.get("cms_admin_token")?.value
  if (!token) {
    const refreshToken = cookieStore.get("cms_refresh_token")?.value
    redirect(refreshToken ? adminRefreshLocation(nextPath) : adminLoginLocation(nextPath))
  }

  const response = await fetch(`${ADMIN_BASE}/media/upload`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: "no-store",
  })

  if (response.status === 401) {
    const refreshToken = cookieStore.get("cms_refresh_token")?.value
    redirect(refreshToken ? adminRefreshLocation(nextPath) : adminLoginLocation(nextPath))
  }

  if (!response.ok) {
    throw await toAdminApiError(response)
  }

  return (await response.json()) as AdminMediaUpload
}

async function toAdminApiError(response: Response) {
  try {
    const payload = (await response.json()) as {
      error?: string
      message?: string
      fields?: Record<string, string>
    }
    return new AdminApiError(
      response.status,
      payload.message ?? "Admin API request failed.",
      payload.error,
      payload.fields,
    )
  } catch {
    return new AdminApiError(response.status, "Admin API request failed.")
  }
}
