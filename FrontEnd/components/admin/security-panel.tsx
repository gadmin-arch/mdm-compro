import { CheckCircle2, History, MonitorSmartphone, ShieldX, Trash2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminLoginHistoryEntry, AdminTrustedDevice } from "@/lib/admin-api"
import { revokeAllDevicesAction, revokeDeviceAction } from "@/app/admin/settings/actions"

function formatWhen(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function TrustedDevicesCard({ devices }: { devices: AdminTrustedDevice[] }) {
  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MonitorSmartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="font-display text-lg font-semibold">Trusted Devices</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            These browsers skip email verification when signing in.
          </CardDescription>
        </div>
        {devices.length > 0 && (
          <form action={revokeAllDevicesAction}>
            <Button type="submit" size="sm" variant="outline" className="text-destructive">
              <ShieldX className="h-4 w-4" />
              Revoke all
            </Button>
          </form>
        )}
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            No trusted devices. Tick “Trust this device” during sign-in to add one.
          </p>
        ) : (
          <ul className="space-y-3">
            {devices.map((device) => (
              <li key={device.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{device.label || "Unknown device"}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.ip && <>IP {device.ip} · </>}
                    Last used {formatWhen(device.lastUsedAt)} · expires {formatWhen(device.expiresAt)}
                  </p>
                </div>
                <form action={revokeDeviceAction}>
                  <input type="hidden" name="id" value={device.id} />
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    aria-label={`Revoke ${device.label || "device"}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

const ACTION_LABELS: Record<string, { label: string; failed?: boolean }> = {
  "auth.login_success": { label: "Signed in" },
  "auth.login_trusted_device": { label: "Signed in (trusted device)" },
  "auth.login_failed": { label: "Failed sign-in", failed: true },
  "auth.login_locked": { label: "Account locked", failed: true },
  "auth.otp_sent": { label: "Verification code sent" },
  "auth.otp_resent": { label: "Verification code resent" },
  "auth.otp_verified": { label: "Code verified" },
  "auth.otp_failed": { label: "Wrong verification code", failed: true },
  "auth.otp_locked": { label: "Verification locked", failed: true },
  "auth.device_trusted": { label: "Device trusted" },
  "auth.trusted_device_revoked": { label: "Trusted device revoked" },
  "auth.password_reset": { label: "Password reset" },
  "auth.reset_requested": { label: "Password reset requested" },
}

function shortDevice(userAgent: string) {
  const ua = userAgent.toLowerCase()
  const browser = ua.includes("edg/")
    ? "Edge"
    : ua.includes("firefox/")
      ? "Firefox"
      : ua.includes("chrome/")
        ? "Chrome"
        : ua.includes("safari/")
          ? "Safari"
          : "Browser"
  const os = ua.includes("windows")
    ? "Windows"
    : ua.includes("android")
      ? "Android"
      : ua.includes("iphone") || ua.includes("ipad")
        ? "iOS"
        : ua.includes("mac os")
          ? "macOS"
          : ua.includes("linux")
            ? "Linux"
            : ""
  return os ? `${browser} on ${os}` : browser
}

export function LoginHistoryCard({ entries }: { entries: AdminLoginHistoryEntry[] }) {
  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <History className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="font-display text-lg font-semibold">Login History</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Recent sign-in activity on your account, including failures.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
            No sign-in activity recorded yet.
          </p>
        ) : (
          <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {entries.map((entry) => {
              const meta = ACTION_LABELS[entry.action] ?? { label: entry.action }
              return (
                <li key={entry.id} className="flex items-start gap-2.5 rounded-md border border-border px-3 py-2 text-sm">
                  {meta.failed ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{meta.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {entry.userAgent ? `${shortDevice(entry.userAgent)} · ` : ""}
                      {entry.ip ? `IP ${entry.ip} · ` : ""}
                      {formatWhen(entry.createdAt)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
