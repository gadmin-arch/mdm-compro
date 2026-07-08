import { type NextRequest } from "next/server"
import { adminCookieOptions, relativeRedirect, safeAdminNext } from "@/lib/admin-auth"

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

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const email = String(form.get("email") ?? "").trim().toLowerCase()
  const password = String(form.get("password") ?? "")
  const nextPath = safeAdminNext(form.get("next"))
  const attemptKey = loginAttemptKey(request, email)
  const now = Date.now()

  if (isLoginLocked(attemptKey, now)) {
    return loginRedirect("rate_limited", nextPath)
  }

  if (!email || !password) {
    return loginRedirect("1", nextPath)
  }

  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  }).catch(() => null)

  if (!response?.ok) {
    if (response?.status === 429) {
      // The API's durable lockout tripped (account or IP throttle).
      return loginRedirect("rate_limited", nextPath)
    }
    if (response?.status === 403) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      if (payload?.error === "verification_required") {
        return loginRedirect("verification_required", nextPath)
      }
    }
    if (response && [400, 401].includes(response.status) && recordLoginFailure(attemptKey, now)) {
      return loginRedirect("rate_limited", nextPath)
    }
    return loginRedirect("1", nextPath)
  }

  const payload = (await response.json()) as {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
    refreshTokenExpiresAt: string
  }
  clearLoginFailure(attemptKey)
  const redirectResponse = relativeRedirect(nextPath)
  redirectResponse.cookies.set(
    "cms_admin_token",
    payload.accessToken,
    adminCookieOptions(request, new Date(payload.accessTokenExpiresAt)),
  )
  redirectResponse.cookies.set(
    "cms_refresh_token",
    payload.refreshToken,
    adminCookieOptions(request, new Date(payload.refreshTokenExpiresAt)),
  )

  return redirectResponse
}

function loginRedirect(error: string, nextPath: string) {
  const params = new URLSearchParams({ error, next: nextPath })
  return relativeRedirect(`/admin/login?${params.toString()}`)
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
