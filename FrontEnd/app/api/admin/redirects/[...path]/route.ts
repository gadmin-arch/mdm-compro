import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const ADMIN_BASE = API_BASE.replace("/public", "/admin")

// Browser-facing downloads for the redirects module: QR images (inline
// preview + attachment) and the CSV export. Everything else goes through
// Server Components/actions.
function allowed(path: string[]): boolean {
  if (path.length === 1 && path[0] === "export") return true
  if (path.length === 2 && path[1] === "qr") return true
  return false
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params
  if (!path?.length || !allowed(path)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get("cms_admin_token")?.value
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const response = await fetch(`${ADMIN_BASE}/redirects/${path.join("/")}${request.nextUrl.search}`, {
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
