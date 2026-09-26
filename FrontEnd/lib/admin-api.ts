import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminLoginLocation, adminRefreshLocation } from "@/lib/admin-auth"
import { generateDevAdminJwt } from "@/lib/dev-jwt"
import type { Career, ContentNode, ListResponse, NewsItem, PageContent } from "@/lib/cms"

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

// In-memory dev store for local development when Go backend is offline
let devPagesInitialized = false
const devPagesMap = new Map<string, PageContent>()

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
