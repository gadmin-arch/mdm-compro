import { type NextRequest } from "next/server"
import { adminCookieOptions, relativeRedirect } from "@/lib/admin-auth"

const API_BASE = process.env.CMS_API_BASE_URL ?? "http://localhost:8080/api/v1/public"
const AUTH_BASE = API_BASE.replace("/public", "/auth")

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const email = String(form.get("email") ?? "").trim().toLowerCase()
  const code = String(form.get("code") ?? "").trim()
  const password = String(form.get("password") ?? "")
  const response = await fetch(`${AUTH_BASE}/verify-invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, password }),
    cache: "no-store",
  }).catch(() => null)

  if (!response?.ok) {
    const errorCode = response?.status === 429 ? "locked" : "1"
    return relativeRedirect(`/admin/verify-invite?error=${errorCode}&email=${encodeURIComponent(email)}`)
  }

  const payload = (await response.json()) as {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
    refreshTokenExpiresAt: string
  }
  const redirectResponse = relativeRedirect("/admin")
  redirectResponse.cookies.set("cms_admin_token", payload.accessToken, adminCookieOptions(request, new Date(payload.accessTokenExpiresAt)))
  redirectResponse.cookies.set("cms_refresh_token", payload.refreshToken, adminCookieOptions(request, new Date(payload.refreshTokenExpiresAt)))
  return redirectResponse
}
