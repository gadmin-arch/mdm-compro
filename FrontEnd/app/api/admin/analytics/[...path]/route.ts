import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const ADMIN_BASE = API_BASE.replace("/public", "/admin")

// Browser-facing endpoints the analytics dashboard may call directly (the
// realtime poller and export downloads need the admin token attached
// server-side; everything else is fetched in Server Components).
const ALLOWED = new Set(["realtime", "export", "dashboard", "admin-activity", "options"])

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params
  if (!path?.length || !ALLOWED.has(path[0])) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("cms_admin_token")?.value
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const search = request.nextUrl.search
  const response = await fetch(`${ADMIN_BASE}/analytics/${path.join("/")}${search}`, {
    headers: { Accept: "*/*", Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  const headers = new Headers()
  for (const name of ["content-type", "content-disposition", "cache-control"]) {
    const value = response.headers.get(name)
    if (value) headers.set(name, value)
  }
  return new NextResponse(response.body, { status: response.status, headers })
}
