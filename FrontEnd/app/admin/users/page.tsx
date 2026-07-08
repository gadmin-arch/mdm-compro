import { UserPlus } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminApiError, adminFetch, type AdminUsersResponse } from "@/lib/admin-api"
import { inviteUserAction } from "./actions"
import { UsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ invited?: string; saved?: string; deleted?: string; error?: string }>
}) {
  const query = await searchParams
  let response: AdminUsersResponse | null = null
  let forbidden = false
  try {
    response = await adminFetch<AdminUsersResponse>("/users", {}, "/admin/users")
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 403) forbidden = true
    else throw error
  }

  const message = query.invited
    ? "Invitation email sent."
    : query.saved
      ? "User role updated."
      : query.deleted
        ? "User deleted."
        : query.error === "email_exists"
          ? "A user with this email already exists."
          : query.error
            ? "The user request failed."
            : ""

  return (
    <AdminShell active="users" eyebrow="Access control" title="Users">
      {message && <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm">{message}</p>}
      {forbidden ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Your role cannot manage user accounts.
        </p>
      ) : (
        <>
          {response?.currentRole === "owner" ? (
            <form action={inviteUserAction} className="mt-8 grid gap-4 rounded-lg border border-border bg-background p-4 md:grid-cols-[1fr_1fr_160px_auto] md:items-end">
              <div>
                <label className="text-sm font-medium" htmlFor="name">Name</label>
                <Input className="mt-2" id="name" name="name" required />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input className="mt-2" id="email" name="email" required type="email" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="role">Role</label>
                <select className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm" id="role" name="role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button type="submit"><UserPlus className="h-4 w-4" />Invite</Button>
            </form>
          ) : (
            <p className="mt-8 rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
              Only the owner account can invite or remove users.
            </p>
          )}

          <UsersTable
            users={response?.data ?? []}
            currentUserId={response?.currentUserId ?? ""}
            currentRole={response?.currentRole ?? ""}
          />
        </>
      )}
    </AdminShell>
  )
}
