import { NextResponse, type NextRequest } from "next/server"
import { TRUST_COOKIE, adminCookieOptions, crossOriginPost, safeAdminNext } from "@/lib/admin-auth"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const AUTH_BASE = API_BASE.replace("/public", "/auth")
const LOGIN_WINDOW_MS = 10 * 60 * 1000
const LOGIN_LOCK_MS = 15 * 60 * 1000
const MAX_LOGIN_ATTEMPTS = 5

type LoginAttempt = {
  count: number
  resetAt: number
  lockedUntil: number
}

const loginAttempts = new Map<string, LoginAttempt>()

type LoginBody = {
  email?: string
  password?: string
  fingerprint?: string
  next?: string
}

// Step 1 of the sign-in. Called with fetch(JSON); responds with either
// { status: "ok" } (cookies set) or { status: "otp_required", ... }.
export async function POST(request: NextRequest) {
  if (crossOriginPost(request)) {
    return NextResponse.json({ status: "error", code: "forbidden" }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as LoginBody | null
  const email = String(body?.email ?? "").trim().toLowerCase()
  const password = String(body?.password ?? "")
  const fingerprint = String(body?.fingerprint ?? "").slice(0, 128)
  const nextPath = safeAdminNext(body?.next)
  const attemptKey = loginAttemptKey(request, email)
  const now = Date.now()

  if (isLoginLocked(attemptKey, now)) {
    return NextResponse.json({ status: "error", code: "rate_limited" }, { status: 429 })
  }
  if (!email || !password) {
    return NextResponse.json({ status: "error", code: "invalid" }, { status: 400 })
  }

  const trustedToken = request.cookies.get(TRUST_COOKIE)?.value ?? ""

  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, trustedToken, fingerprint }),
    cache: "no-store",
  }).catch(() => null)

  if (!response) {
    return NextResponse.json({ status: "error", code: "unavailable" }, { status: 502 })
  }
  if (!response.ok) {
    if (response.status === 429) {
      return NextResponse.json({ status: "error", code: "rate_limited" }, { status: 429 })
    }
    if (response.status === 403) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (payload?.error === "verification_required") {
        return NextResponse.json({ status: "error", code: "verification_required" }, { status: 403 })
      }
    }
    if ([400, 401].includes(response.status) && recordLoginFailure(attemptKey, now)) {
      return NextResponse.json({ status: "error", code: "rate_limited" }, { status: 429 })
    }
    return NextResponse.json({ status: "error", code: "invalid" }, { status: 401 })
  }

  clearLoginFailure(attemptKey)
  const payload = (await response.json()) as {
    status: "ok" | "otp_required"
    tokens?: {
      accessToken: string
      refreshToken: string
      accessTokenExpiresAt: string
      refreshTokenExpiresAt: string
    }
    challengeId?: string
    maskedEmail?: string
    codeLength?: number
    expiresAt?: string
    resendCooldownSec?: number
    trustDays?: number
  }

  if (payload.status === "otp_required") {
    const otpResponse = NextResponse.json({
      status: "otp_required",
      challengeId: payload.challengeId,
      maskedEmail: payload.maskedEmail,
      codeLength: payload.codeLength ?? 6,
      expiresAt: payload.expiresAt,
      resendCooldownSec: payload.resendCooldownSec ?? 60,
      trustDays: payload.trustDays ?? 30,
      next: nextPath,
    })
    // A trust cookie was presented but did not skip the OTP step, so it is
    // stale (expired, revoked, or another user's) — drop it.
    if (trustedToken) {
      otpResponse.cookies.delete(TRUST_COOKIE)
    }
    return otpResponse
  }

  if (!payload.tokens) {
    return NextResponse.json({ status: "error", code: "unavailable" }, { status: 502 })
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
  return okResponse
}

function loginAttemptKey(request: NextRequest, email: string) {
  return `${clientAddress(request)}:${email || "unknown"}`
}

function clientAddress(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwardedFor || request.headers.get("x-real-ip") || "local"
}

function isLoginLocked(key: string, now: number) {
  pruneLoginAttempts(now)
  const attempt = loginAttempts.get(key)
  if (!attempt) return false
  if (attempt.lockedUntil > now) return true
  if (attempt.resetAt <= now) {
    loginAttempts.delete(key)
  }
  return false
}

function recordLoginFailure(key: string, now: number) {
  const existing = loginAttempts.get(key)
  const attempt =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + LOGIN_WINDOW_MS, lockedUntil: 0 }

  attempt.count += 1
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = now + LOGIN_LOCK_MS
    attempt.resetAt = attempt.lockedUntil
  }
  loginAttempts.set(key, attempt)
  return attempt.lockedUntil > now
}

function clearLoginFailure(key: string) {
  loginAttempts.delete(key)
}

function pruneLoginAttempts(now: number) {
  if (loginAttempts.size < 1000) return
  for (const [key, attempt] of loginAttempts.entries()) {
    if (attempt.resetAt <= now && attempt.lockedUntil <= now) {
      loginAttempts.delete(key)
    }
  }
}
