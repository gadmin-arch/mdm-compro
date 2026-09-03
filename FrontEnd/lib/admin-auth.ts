import { NextResponse, type NextRequest } from "next/server"

const LOCAL_NEXT_FALLBACK = "/admin"

// HTTP-only cookie carrying the opaque trusted-device token (30-day 2FA skip).
export const TRUST_COOKIE = "cms_trusted_device"

export function safeAdminNext(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string" || value.trim() === "") {
    return LOCAL_NEXT_FALLBACK
  }

  const candidate = value.trim()
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return LOCAL_NEXT_FALLBACK
  }

  return candidate.startsWith("/admin/login") ? LOCAL_NEXT_FALLBACK : candidate
}

export function relativeRedirect(location: string, status = 303) {
  return new NextResponse(null, {
    status,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}

export function adminLoginLocation(nextPath: string) {
  const params = new URLSearchParams({ next: safeAdminNext(nextPath) })
  return `/admin/login?${params.toString()}`
}

export function adminRefreshLocation(nextPath: string) {
  const params = new URLSearchParams({ next: safeAdminNext(nextPath) })
  return `/api/admin/refresh?${params.toString()}`
}

export function externalUrl(request: NextRequest, path: string) {
  return new URL(path, requestOrigin(request))
}

// crossOriginPost rejects browser POSTs whose Origin doesn't match the site
// (CSRF hardening for the cookie-setting auth routes). Requests without an
// Origin header (curl, same-origin form GETs) pass through.
export function crossOriginPost(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return false
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? ""
  try {
    return new URL(origin).host !== host
  } catch {
    return true
  }
}

// A non-httpOnly companion to the session cookie, carrying no secret — just
// "someone is signed into the CMS in this browser". The analytics tracker runs
// in the browser and cannot see the httpOnly session cookie, and reading
// cookies server-side in the public layout would opt the whole site out of
// static rendering. This marker keeps both properties.
export const ADMIN_MARKER_COOKIE = "cms_admin_session"

export function adminMarkerCookieOptions(request: NextRequest, expires: Date) {
  return { ...adminCookieOptions(request, expires), httpOnly: false }
}

export function adminCookieOptions(request: NextRequest, expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookies(request),
    expires,
    path: "/",
  }
}

function shouldUseSecureCookies(request: NextRequest) {
  const configured = process.env.CMS_COOKIE_SECURE?.trim().toLowerCase()
  if (configured === "true") return true
  if (configured === "false") return false

  const forwardedProto = request.headers.get("x-forwarded-proto")
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https"
  }

  if (request.nextUrl.protocol === "https:") {
    return true
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (siteUrl) {
    try {
      return new URL(siteUrl).protocol === "https:"
    } catch {
      return false
    }
  }

  return false
}

function requestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host")
  const forwardedProto = request.headers.get("x-forwarded-proto")
  const protocol = forwardedProto?.split(",")[0]?.trim() || request.nextUrl.protocol.replace(":", "")

  if (host && !looksLikeDockerHostname(host)) {
    return `${protocol}://${host}`
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (siteUrl) {
    return siteUrl
  }

  return request.nextUrl.origin
}

function looksLikeDockerHostname(host: string) {
  const hostname = host.split(":")[0] ?? ""
  return /^[a-f0-9]{12,64}$/i.test(hostname)
}
