import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

        {reset ? (
          <p className="mt-5 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
            Password updated. You can sign in now.
          </p>
        ) : error === "rate_limited" ? (
          <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Too many sign-in attempts. Please wait a few minutes before trying again.
          </p>
        ) : error === "verification_required" ? (
          <p className="mt-5 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
            Your account still needs email verification. Use the invitation code sent to your email.
          </p>
        ) : error ? (
          <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Invalid credentials or the admin API is unavailable.
          </p>
        ) : null}

        <form action="/api/admin/login" method="post" className="mt-6 space-y-4" autoComplete="on">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              required
              spellCheck={false}
              className="mt-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
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
