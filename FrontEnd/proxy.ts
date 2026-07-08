import { NextResponse, type NextRequest } from "next/server"
import { adminLoginLocation, adminRefreshLocation, externalUrl } from "@/lib/admin-auth"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const publicAdminPaths = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/verify-invite",
  ]
  if (!pathname.startsWith("/admin") || publicAdminPaths.some((path) => pathname.startsWith(path))) {
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

export const config = {
  matcher: ["/admin/:path*"],
}
