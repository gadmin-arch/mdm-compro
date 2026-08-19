"use client"

import { useMemo, useState, useTransition } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ShieldCheck, Trash2, Users } from "lucide-react"
import { AdminCard, AdminDataView } from "@/components/admin/data-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteUserAction, updateUserRoleAction } from "@/app/admin/(workspace)/users/actions"

type UserRow = {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
}

type UsersTableProps = {
  users: UserRow[]
  currentUserId: string
  currentRole: string
}

function RoleForm({ user }: { user: UserRow }) {
  return (
    <form action={updateUserRoleAction} className="flex items-center gap-2">
      <input name="id" type="hidden" value={user.id} />
      <div className="relative flex items-center">
        <select
          aria-label={`Role for ${user.name || user.email}`}
          className="h-8 appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 pl-2.5 pr-7 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"
          defaultValue={user.role}
          name="role"
        >
          <option value="user" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">User</option>
          <option value="admin" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Admin</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      </div>
      <Button size="sm" type="submit" variant="outline" className="h-8 text-xs font-semibold">
        Update
      </Button>
    </form>
  )
}

export function UsersTable({ users, currentUserId, currentRole }: UsersTableProps) {
  const [rowToDelete, setRowToDelete] = useState<UserRow | null>(null)
  const [deleting, startDelete] = useTransition()

  // Dispatch via a transition, not a form submit: AlertDialogAction closes the
  // dialog on click, unmounting a form-in-dialog before React can dispatch its
  // action — so the delete silently never fired.
  function confirmDelete() {
    if (!rowToDelete) return
    const formData = new FormData()
    formData.set("id", rowToDelete.id)
    startDelete(() => deleteUserAction(formData))
  }

  const canManageRole = (user: UserRow) =>
    currentRole === "owner" && user.role !== "owner" && user.id !== currentUserId
  const canDelete = (user: UserRow) =>
    currentRole === "owner" && user.role !== "owner" && user.id !== currentUserId

  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        id: "user",
        size: 280,
        accessorFn: (row) => row.name || row.email,
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium">{row.original.name}</p>
            <p className="break-all text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        accessorKey: "role",
        size: 140,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        cell: ({ row }) => (
          <Badge variant={row.original.role === "owner" ? "default" : "outline"} className="gap-1">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            {row.original.role}
          </Badge>
        ),
      },
      {
        id: "status",
        size: 180,
        accessorFn: (row) => (row.isActive ? "active" : "pending"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? "Active" : "Pending verification"}
          </Badge>
        ),
      },
      {
        id: "actions",
        size: 280,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            {canManageRole(row.original) && <RoleForm user={row.original} />}
            {canDelete(row.original) && (
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setRowToDelete(row.original)}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete
              </Button>
            )}
          </div>
        ),
      },
    ],
    // canManageRole/canDelete close over the current user's identity only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole, currentUserId],
  )

  return (
    <>
      <AdminDataView
        columns={columns}
        data={users}
        paginated
        pageSize={20}
        empty={{
          title: "No users found.",
          description: "Invite a teammate to give them CMS access.",
          icon: <Users className="h-5 w-5" aria-hidden="true" />,
        }}
        renderCard={(user) => (
          <AdminCard
            key={user.id}
            title={user.name || user.email}
            subtitle={user.email}
            badges={
              <>
                <Badge variant={user.role === "owner" ? "default" : "outline"} className="gap-1">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  {user.role}
                </Badge>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? "Active" : "Pending verification"}
                </Badge>
              </>
            }
            actions={
              canManageRole(user) || canDelete(user) ? (
                <>
                  {canManageRole(user) && <RoleForm user={user} />}
                  {canDelete(user) && (
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      className="min-h-11 flex-1 text-destructive"
                      onClick={() => setRowToDelete(user)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Delete
                    </Button>
                  )}
                </>
              ) : undefined
            }
          />
        )}
      />

      <AlertDialog
        open={rowToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setRowToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user &ldquo;{rowToDelete?.name || rowToDelete?.email}
              &rdquo;? This will disable their access to the CMS dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
