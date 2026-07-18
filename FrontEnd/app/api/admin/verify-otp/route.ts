import { NextResponse, type NextRequest } from "next/server"
import { TRUST_COOKIE, adminCookieOptions, crossOriginPost, safeAdminNext } from "@/lib/admin-auth"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const AUTH_BASE = API_BASE.replace("/public", "/auth")

type VerifyBody = {
  challengeId?: string
  code?: string
  trustDevice?: boolean
  fingerprint?: string
  next?: string
}

// Step 3/4 of the sign-in: exchange the emailed code for a session, and
// optionally mint the 30-day trusted-device cookie.
export async function POST(request: NextRequest) {
  if (crossOriginPost(request)) {
    return NextResponse.json({ status: "error", code: "forbidden" }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as VerifyBody | null
  const nextPath = safeAdminNext(body?.next)

  const response = await fetch(`${AUTH_BASE}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      challengeId: String(body?.challengeId ?? ""),
      code: String(body?.code ?? ""),
      trustDevice: Boolean(body?.trustDevice),
      fingerprint: String(body?.fingerprint ?? "").slice(0, 128),
    }),
    cache: "no-store",
  }).catch(() => null)

  if (!response) {
    return NextResponse.json({ status: "error", code: "unavailable" }, { status: 502 })
  }
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After")) || 60
    return NextResponse.json({ status: "error", code: "locked", retryAfter }, { status: 429 })
  }
  if (!response.ok) {
    return NextResponse.json({ status: "error", code: "invalid_code" }, { status: 401 })
  }

  const payload = (await response.json()) as {
    tokens: {
      accessToken: string
      refreshToken: string
      accessTokenExpiresAt: string
      refreshTokenExpiresAt: string
    }
    trustToken?: string
    trustExpiresAt?: string
  }

  const okResponse = NextResponse.json({ status: "ok", next: nextPath })
  okResponse.cookies.set(
    "cms_admin_token",
    payload.tokens.accessToken,
    adminCookieOptions(request, new Date(payload.tokens.accessTokenExpiresAt)),
  )
  okResponse.cookies.set(
    "cms_refresh_token",
    payload.tokens.refreshToken,
    adminCookieOptions(request, new Date(payload.tokens.refreshTokenExpiresAt)),
  )
  if (payload.trustToken && payload.trustExpiresAt) {
    okResponse.cookies.set(
      TRUST_COOKIE,
      payload.trustToken,
      adminCookieOptions(request, new Date(payload.trustExpiresAt)),
    )
  }
  return okResponse
}
