import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const ADMIN_BASE = API_BASE.replace("/public", "/admin")

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("cms_admin_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "unauthorized", message: "Bearer token is required." },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "missing_file", message: "File is required." },
        { status: 400 }
      )
    }

    const forwardForm = new FormData()
    forwardForm.set("file", file)

    let response: Response | null = null
    const isDev = process.env.NODE_ENV === "development" && !process.env.VERCEL

    try {
      response = await fetch(`${ADMIN_BASE}/media/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: forwardForm,
        cache: "no-store",
      })
    } catch (err) {
      if (!isDev) throw err
    }

    if (isDev && (!response || !response.ok)) {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fs = await import("fs/promises")
        const path = await import("path")
        const uploadsDir = path.join(process.cwd(), "public", "uploads")
        await fs.mkdir(uploadsDir, { recursive: true })
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        await fs.writeFile(path.join(uploadsDir, safeName), buffer)
        return NextResponse.json(
          {
            url: `/uploads/${safeName}`,
            fileName: file.name,
            mimeType: file.type,
            sizeBytes: file.size,
          },
          { status: 201 },
        )
      } catch (err) {
        console.error("Local dev upload fallback failed:", err)
      }
    }

    if (!response) {
      return NextResponse.json({ error: "upload_failed", message: "Upload backend unreachable" }, { status: 503 })
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(
        data ?? { error: "upload_failed", message: "Upload failed." },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Upload proxy error:", error)
    return NextResponse.json(
      {
        error: "server_error",
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}
