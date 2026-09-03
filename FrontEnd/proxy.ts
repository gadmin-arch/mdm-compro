import { NextResponse, type NextRequest } from "next/server"
import { adminLoginLocation, adminRefreshLocation, externalUrl } from "@/lib/admin-auth"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Branded short links: single-segment paths that aren't known routes get
  // one fast (memory-cached) resolve call; hits redirect with a real
  // 301/302, misses fall through to the CMS [pageKey] route.
  if (!pathname.startsWith("/admin")) {
    const shortLink = await resolveShortLink(request)
    if (shortLink) return shortLink
    return NextResponse.next()
  }

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
    "/admin/:path*",
    // One lowercase slug segment that is not a known route, an asset, or a
    // Next internal — the short-link candidates.
    "/:slug((?!admin$|api$|_next|home$|about$|contact$|services$|products$|industries$|news$|career$|careers$|search$|login$|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$|.*\\.)[a-z0-9-]+)",
  ],
}
