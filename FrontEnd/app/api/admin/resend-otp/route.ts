import { NextResponse, type NextRequest } from "next/server"
import { crossOriginPost } from "@/lib/admin-auth"

const API_BASE =
  process.env.CMS_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ??
  "http://localhost:8080/api/v1/public"

const AUTH_BASE = API_BASE.replace("/public", "/auth")

// Re-sends the sign-in code for a pending challenge (cooldown enforced by
// the API; 429 carries Retry-After).
export async function POST(request: NextRequest) {
  if (crossOriginPost(request)) {
    return NextResponse.json({ status: "error", code: "forbidden" }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as { challengeId?: string } | null

  const response = await fetch(`${AUTH_BASE}/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ challengeId: String(body?.challengeId ?? "") }),
    cache: "no-store",
  }).catch(() => null)

  if (!response) {
    return NextResponse.json({ status: "error", code: "unavailable" }, { status: 502 })
  }
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After")) || 60
    return NextResponse.json({ status: "error", code: "cooldown", retryAfter }, { status: 429 })
  }
  if (!response.ok) {
    return NextResponse.json({ status: "error", code: "invalid_challenge" }, { status: 401 })
  }

  const payload = (await response.json()) as {
    challengeId: string
    expiresAt?: string
    resendCooldownSec?: number
  }
  return NextResponse.json({
    status: "otp_required",
    challengeId: payload.challengeId,
    expiresAt: payload.expiresAt,
    resendCooldownSec: payload.resendCooldownSec ?? 60,
  })
}
