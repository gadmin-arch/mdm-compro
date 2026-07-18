import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "@/components/admin/login-form"
import { safeAdminNext } from "@/lib/admin-auth"

export const metadata: Metadata = {
  title: "CMS Login — PT Multi Daya Mitra",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; reset?: string }>
}) {
  const { error, next, reset } = await searchParams
  const nextPath = safeAdminNext(next)

  const initialBanner = reset
    ? { tone: "info" as const, text: "Password updated. You can sign in now." }
    : error === "rate_limited"
      ? { tone: "error" as const, text: "Too many sign-in attempts. Please wait a few minutes before trying again." }
      : error === "verification_required"
        ? { tone: "info" as const, text: "Your account still needs email verification. Use the invitation code sent to your email." }
        : error
          ? { tone: "error" as const, text: "Invalid credentials or the admin API is unavailable." }
          : null

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-8 sm:py-10">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <Image
            src="/Logo PT MDM.png"
            alt="PT Multi Daya Mitra Logo"
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">CMS Admin</h1>
            <p className="text-sm text-muted-foreground">Protected content access</p>
          </div>
        </div>

        <LoginForm nextPath={nextPath} initialBanner={initialBanner} />

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link className="text-muted-foreground hover:text-foreground" href="/admin/forgot-password">
            Forgot password?
          </Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/admin/verify-invite">
            Verify invitation
          </Link>
        </div>
      </div>
    </main>
  )
}
