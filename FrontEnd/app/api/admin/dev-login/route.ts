import { NextResponse, type NextRequest } from "next/server"
import { adminCookieOptions, adminMarkerCookieOptions } from "@/lib/admin-auth"
import { generateDevAdminJwt } from "@/lib/dev-jwt"

/**
 * Development-only login bypass.
 * STRICTLY DISABLED IN PRODUCTION / VERCEL.
 */
export async function GET(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development" && !process.env.VERCEL
  if (!isDev) {
    return NextResponse.json({ error: "Dev login bypass is strictly disabled in production" }, { status: 403 })
  }

  const next = request.nextUrl.searchParams.get("next") || "/admin"
  const safeNext = next.startsWith("/admin") ? next : "/admin"
  const targetUrl = new URL(safeNext, request.nextUrl.origin)

  const response = NextResponse.redirect(targetUrl, 303)
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const devToken = generateDevAdminJwt()

  response.cookies.set("cms_admin_token", devToken, adminCookieOptions(request, expires))
  response.cookies.set("cms_refresh_token", devToken, adminCookieOptions(request, expires))
  response.cookies.set("cms_admin_session", "1", adminMarkerCookieOptions(request, expires))

  return response
}
