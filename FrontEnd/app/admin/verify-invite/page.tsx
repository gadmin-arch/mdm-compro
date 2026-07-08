import { AuthCard } from "@/components/admin/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function VerifyInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  const query = await searchParams
  return (
    <AuthCard
      title="Activate account"
      description="Verify your invitation and create a password"
      message={
        query.error === "locked"
          ? "Too many attempts. Try again in a few minutes."
          : query.error
            ? "The invitation code is invalid or expired."
            : undefined
      }
      destructive={Boolean(query.error)}
    >
      <form action="/api/admin/verify-invite" className="mt-6 space-y-4" method="post">
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
          <Input className="mt-2" defaultValue={query.email} id="email" name="email" required type="email" autoComplete="email" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="code">Invitation code</label>
          <Input className="mt-2" id="code" inputMode="numeric" maxLength={6} name="code" required />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="password">Create password</label>
          <Input className="mt-2" id="password" minLength={10} name="password" required type="password" autoComplete="new-password" />
          <p className="mt-1.5 text-xs text-muted-foreground">At least 10 characters with letters and numbers.</p>
        </div>
        <Button className="w-full" type="submit">Activate and sign in</Button>
      </form>
    </AuthCard>
  )
}
