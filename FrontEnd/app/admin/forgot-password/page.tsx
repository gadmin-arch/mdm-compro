import { AuthCard } from "@/components/admin/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <AuthCard
      title="Forgot password"
      description="Receive a one-time reset code by email"
      message={error ? "The reset email could not be sent. Try again shortly." : undefined}
      destructive={Boolean(error)}
    >
      <form action="/api/admin/forgot-password" className="mt-6 space-y-4" method="post">
        <div>
          <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
          <Input className="mt-2" id="email" name="email" required type="email" autoComplete="email" />
        </div>
        <Button className="w-full" type="submit">Send reset code</Button>
      </form>
    </AuthCard>
  )
}
