import crypto from "node:crypto"

function base64Url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

/**
 * Generates a valid HMAC-SHA256 JWT recognized by the Go backend in local development.
 * This corresponds to the seeded owner user in Backend migrations:
 * Email: irfanzuhdiabdillah@gmail.com
 * Role: owner
 */
export function generateDevAdminJwt(): string {
  const secret = process.env.JWT_SECRET || "change-me-in-production"
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const now = Math.floor(Date.now() / 1000)
  const payload = base64Url(
    JSON.stringify({
      userId: "00000000-0000-0000-0000-000000000301",
      email: "irfanzuhdiabdillah@gmail.com",
      role: "owner",
      permissions: [
        "admin:*",
        "content:read",
        "content:write",
        "media:write",
        "contacts:read",
        "users:manage",
      ],
      jti: crypto.randomUUID(),
      sub: "00000000-0000-0000-0000-000000000301",
      iat: now,
      exp: now + 30 * 24 * 60 * 60, // 30 days valid
    }),
  )
  const data = `${header}.${payload}`
  const signature = base64Url(crypto.createHmac("sha256", secret).update(data).digest())
  return `${data}.${signature}`
}
