import { type NextRequest } from "next/server"
import { relativeRedirect } from "@/lib/admin-auth"

const API_BASE = process.env.CMS_API_BASE_URL ?? "http://localhost:8080/api/v1/public"
const AUTH_BASE = API_BASE.replace("/public", "/auth")

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const email = String(form.get("email") ?? "").trim().toLowerCase()
  const response = await fetch(`${AUTH_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    cache: "no-store",
  }).catch(() => null)

  if (!response?.ok) return relativeRedirect("/admin/forgot-password?error=1")
  return relativeRedirect(`/admin/reset-password?sent=1&email=${encodeURIComponent(email)}`)
}
