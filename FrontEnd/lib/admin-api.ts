import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminLoginLocation, adminRefreshLocation } from "@/lib/admin-auth"
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
  ) {
    super(message)
  }
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {},
  nextPath = "/admin",
  opts: { redirectOn401?: boolean } = {},
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("cms_admin_token")?.value
  if (!token) {
    const refreshToken = cookieStore.get("cms_refresh_token")?.value
    redirect(refreshToken ? adminRefreshLocation(nextPath) : adminLoginLocation(nextPath))
  }

  const headers = new Headers(init.headers)
  headers.set("Accept", "application/json")
  headers.set("Authorization", `Bearer ${token}`)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${ADMIN_BASE}${path}`, {
    ...init,
    headers,
    cache: init.cache ?? "no-store",
  })

  // Some endpoints use 401 for domain errors (e.g. wrong current password);
  // callers that expect that pass redirectOn401: false and handle it.
  if (response.status === 401 && opts.redirectOn401 !== false) {
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
    const payload = (await response.json()) as { error?: string; message?: string }
    return new AdminApiError(
      response.status,
      payload.message ?? "Admin API request failed.",
      payload.error,
    )
  } catch {
    return new AdminApiError(response.status, "Admin API request failed.")
  }
}
