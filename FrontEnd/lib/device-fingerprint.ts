// Coarse, stable device fingerprint the trusted-device token is bound to.
// Deliberately excludes the user-agent version (which changes on every
// browser update) so trust survives upgrades but not a different machine.
export async function deviceFingerprint(): Promise<string> {
  try {
    const parts = [
      navigator.platform ?? "",
      navigator.language ?? "",
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? "",
      `${screen.width}x${screen.height}x${screen.colorDepth}`,
      String(navigator.hardwareConcurrency ?? 0),
    ]
    if (!crypto?.subtle) return ""
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(parts.join("|")))
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  } catch {
    return ""
  }
}
