import { User, KeyRound, Save } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { adminFetch, type AdminUser } from "@/lib/admin-api"
import { updateProfileAction, changePasswordAction } from "./actions"

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const query = await searchParams
  let user: AdminUser | null = null
  let loadError = false

  try {
    user = await adminFetch<AdminUser>("/profile", {}, "/admin/settings")
  } catch (error) {
    loadError = true
  }

  const successMessage = query.saved ? "Informasi profil berhasil diperbarui." : ""
  
  let errorMessage = ""
  if (query.error === "email_exists") {
    errorMessage = "Email sudah digunakan oleh pengguna lain."
  } else if (query.error === "invalid_current_password") {
    errorMessage = "Password saat ini salah."
  } else if (query.error === "password_mismatch") {
    errorMessage = "Konfirmasi password baru tidak cocok."
  } else if (query.error === "newPassword") {
    errorMessage = "Password baru harus minimal 8 karakter."
  } else if (query.error) {
    errorMessage = "Terjadi kesalahan saat memproses permintaan."
  }

  return (
    <AdminShell active="settings" eyebrow="Pengaturan" title="Pengaturan Akun">
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
          Gagal memuat profil pengguna. Silakan coba lagi nanti.
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
                <CardTitle className="font-display text-lg font-semibold">Informasi Pribadi</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Perbarui nama dan alamat email akun Anda.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form action={updateProfileAction} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="name">
                    Nama Lengkap
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
                    Alamat Email
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
                    <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
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
                <CardTitle className="font-display text-lg font-semibold">Ubah Password</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Pastikan akun Anda menggunakan password yang aman.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form action={changePasswordAction} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="currentPassword">
                    Password Saat Ini
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
                    Password Baru
                  </label>
                  <Input
                    className="mt-2"
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
                    Konfirmasi Password Baru
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
                    <KeyRound className="mr-2 h-4 w-4" /> Perbarui Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminShell>
  )
}
