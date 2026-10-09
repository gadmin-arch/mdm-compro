import { NextResponse, type NextRequest } from "next/server"
import { adminLoginLocation, adminRefreshLocation, externalUrl } from "@/lib/admin-auth"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return guardAdmin(request)
  }

  // Branded short links: single-segment paths that aren't known routes get
  // one fast (memory-cached) resolve call; hits redirect with a real
  // 301/302, misses fall through to the CMS [pageKey] route.
  if (isShortLinkCandidate(pathname)) {
    const shortLink = await resolveShortLink(request)
    if (shortLink) return shortLink
  }

  // On to the language rewrite in next.config.mjs ("/x" → app/[lang] with
  // lang "id").
  return NextResponse.next()
}

function guardAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl
  const publicAdminPaths = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/verify-invite",
  ]
  // Exact or whole-segment match, never a bare prefix: with startsWith(), any
  // future route beginning with one of these strings (e.g. /admin/login-audit)
  // would silently become world-readable.
  if (publicAdminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next()
  }

  const token = request.cookies.get("cms_admin_token")
  if (!token?.value) {
    const refreshToken = request.cookies.get("cms_refresh_token")
    const location = refreshToken?.value ? adminRefreshLocation(pathname) : adminLoginLocation(pathname)
    return NextResponse.redirect(externalUrl(request, location), 307)
  }

  return NextResponse.next()
}

// First path segments that belong to real routes (or the language prefix)
// and must never be looked up as short links. The matcher below repeats the
// list, as matchers must be static.
const RESERVED_SEGMENTS = new Set([
  "admin",
  "api",
  "en",
  "id",
  "home",
  "about",
  "contact",
  "services",
  "products",
  "industries",
  "news",
  "career",
  "careers",
  "search",
  "login",
])

function isShortLinkCandidate(pathname: string): boolean {
  const match = /^\/([a-z0-9-]+)$/.exec(pathname)
  return Boolean(match && !RESERVED_SEGMENTS.has(match[1]))
}

// Visitor context forwarded so the API can log the scan (asynchronously)
// with the real device/referrer/geo rather than this server's.
const FORWARDED_HEADERS = [
  "user-agent",
  "referer",
  "accept-language",
  "x-forwarded-for",
  "x-real-ip",
  "cf-ipcountry",
  "cf-ipcity",
  "x-vercel-ip-country",
  "x-vercel-ip-city",
] as const

async function resolveShortLink(request: NextRequest): Promise<NextResponse | null> {
  const slug = request.nextUrl.pathname.slice(1)
  const headers: Record<string, string> = {}
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers[name] = value
  }

  try {
    const response = await fetch(
      `${API_BASE}/redirects/resolve?slug=${encodeURIComponent(slug)}`,
      { headers, cache: "no-store", signal: AbortSignal.timeout(1500) },
    )
    if (!response.ok) return null
    const data = (await response.json().catch(() => null)) as
      | { found?: boolean; destination?: string; redirectType?: number }
      | null
    if (!data?.found || !data.destination) return null
    return NextResponse.redirect(data.destination, data.redirectType === 301 ? 301 : 302)
  } catch {
    // API unreachable — never block normal page rendering.
    return null
  }
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Single-segment paths outside RESERVED_SEGMENTS: possible short links.
    // Every other page skips the proxy, so cached pages are served without
    // running any code.
    "/((?!(?:admin|api|en|id|home|about|contact|services|products|industries|news|career|careers|search|login)(?:/|$))[a-z0-9-]+)",
  ],
}
