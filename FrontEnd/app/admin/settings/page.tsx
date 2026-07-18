import { User, KeyRound, Save } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginHistoryCard, TrustedDevicesCard } from "@/components/admin/security-panel"
import {
  adminFetch,
  type AdminLoginHistoryEntry,
  type AdminTrustedDevice,
  type AdminUser,
} from "@/lib/admin-api"
import { updateProfileAction, changePasswordAction } from "./actions"

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const query = await searchParams
  let user: AdminUser | null = null
  let devices: AdminTrustedDevice[] = []
  let history: AdminLoginHistoryEntry[] = []
  let loadError = false

  try {
    const [profile, deviceList, historyList] = await Promise.all([
      adminFetch<AdminUser>("/profile", {}, "/admin/settings"),
      adminFetch<{ data: AdminTrustedDevice[] | null }>("/profile/devices", {}, "/admin/settings").catch(() => null),
      adminFetch<{ data: AdminLoginHistoryEntry[] | null }>("/profile/login-history", {}, "/admin/settings").catch(() => null),
    ])
    user = profile
    devices = deviceList?.data ?? []
    history = historyList?.data ?? []
  } catch {
    loadError = true
  }

  const successMessage = query.saved
    ? query.saved === "device_revoked"
      ? "Trusted device revoked. That browser will need a verification code next time."
      : query.saved === "devices_revoked"
        ? "All trusted devices revoked."
        : "Profile updated."
    : ""

  let errorMessage = ""
  if (query.error === "email_exists") {
    errorMessage = "This email is already used by another user."
  } else if (query.error === "invalid_current_password") {
    errorMessage = "The current password is incorrect."
  } else if (query.error === "password_mismatch") {
    errorMessage = "The new password confirmation does not match."
  } else if (query.error === "weak_password") {
    errorMessage = "The new password must be at least 10 characters and include letters and numbers."
  } else if (query.error) {
    errorMessage = "Something went wrong while processing the request."
  }

  return (
    <AdminShell active="settings" eyebrow="Settings" title="Account Settings">
      {successMessage && (
        <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      {loadError || !user ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          The user profile could not be loaded. Please try again later.
        </p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Card: Info Pribadi */}
          <Card className="shadow-sm border-border bg-card">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-display text-lg font-semibold">Personal Information</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Update your account name and email address.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form action={updateProfileAction} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="name">
                    Full Name
                  </label>
                  <Input
                    className="mt-2"
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="email">
                    Email Address
                  </label>
                  <Input
                    className="mt-2"
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card: Keamanan Akun */}
          <Card className="shadow-sm border-border bg-card">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="font-display text-lg font-semibold">Change Password</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Make sure your account uses a strong password.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form action={changePasswordAction} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <Input
                    className="mt-2"
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="newPassword">
                    New Password
                  </label>
                  <Input
                    className="mt-2"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="At least 10 characters with letters and numbers"
                    minLength={10}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <Input
                    className="mt-2"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" variant="default" className="w-full sm:w-auto">
                    <KeyRound className="mr-2 h-4 w-4" /> Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <TrustedDevicesCard devices={devices} />
          <LoginHistoryCard entries={history} />
        </div>
      )}
    </AdminShell>
  )
}
