"use client"

import { useState, useTransition } from "react"
import { ShieldCheck, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { SortableHead } from "@/components/admin/sortable-head"
import { TableEmpty } from "@/components/admin/table-empty"
import { useClientSort } from "@/components/admin/use-client-sort"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { deleteUserAction, updateUserRoleAction } from "@/app/admin/users/actions"

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

type SortField = "name" | "role" | "status"

const USERS_PER_PAGE = 20

function sortValue(user: UserRow, field: SortField) {
  if (field === "name") return user.name || user.email || ""
  if (field === "status") return user.isActive ? "active" : "pending"
  return user[field] || ""
}

export function UsersTable({ users, currentUserId, currentRole }: UsersTableProps) {
  const { field, direction, toggle, sorted: sortedUsers } = useClientSort(users, sortValue)
  const [rowToDelete, setRowToDelete] = useState<UserRow | null>(null)
  const [deleting, startDelete] = useTransition()
  // GET /admin/users returns the full list — page it client-side.
  const [page, setPage] = useState(1)

  // Dispatch via a transition, not a form submit: AlertDialogAction closes the
  // dialog on click, unmounting a form-in-dialog before React can dispatch its
  // action — so the delete silently never fired.
  function confirmDelete() {
    if (!rowToDelete) return
    const formData = new FormData()
    formData.set("id", rowToDelete.id)
    startDelete(() => deleteUserAction(formData))
  }
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / USERS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const pagedUsers = sortedUsers.slice((currentPage - 1) * USERS_PER_PAGE, currentPage * USERS_PER_PAGE)

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <SortableHead
              active={field === "name"}
              direction={direction}
              onSort={() => toggle("name")}
              className="w-1/3 min-w-[160px]"
            >
              User
            </SortableHead>
            <SortableHead
              active={field === "role"}
              direction={direction}
              onSort={() => toggle("role")}
              className="w-1/4 min-w-[100px]"
            >
              Role
            </SortableHead>
            <SortableHead
              active={field === "status"}
              direction={direction}
              onSort={() => toggle("status")}
              className="w-44"
            >
              Status
            </SortableHead>
            <TableHead className="w-[280px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedUsers.map((user) => {
            const isSelf = currentUserId === user.id
            const canManageRole = currentRole === "owner" && user.role !== "owner" && !isSelf
            const canDelete = !isSelf && user.role !== "owner" && currentRole === "owner"

            return (
              <TableRow key={user.id}>
                <TableCell className="whitespace-normal break-words">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground break-all">{user.email}</p>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={user.role === "owner" ? "default" : "outline"}>
                    <ShieldCheck className="h-3 w-3 mr-1 inline-block" />
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Pending verification"}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    {canManageRole && (
                      <form action={updateUserRoleAction} className="flex gap-2">
                        <input name="id" type="hidden" value={user.id} />
                        <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" defaultValue={user.role} name="role">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button size="sm" type="submit" variant="outline">Update</Button>
                      </form>
                    )}
                    {canDelete && (
                      <Button 
                        size="sm" 
                        type="button" 
                        variant="ghost"
                        onClick={() => setRowToDelete(user)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
          {sortedUsers.length === 0 && (
            <TableEmpty
              colSpan={4}
              icon={<Users className="h-5 w-5" aria-hidden="true" />}
              title="No users found."
              description="Invite a teammate to give them CMS access."
            />
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages} · {sortedUsers.length} users
          </span>
          <div className="flex gap-2">
            <Button
              disabled={currentPage <= 1}
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={rowToDelete !== null} onOpenChange={(open) => { if (!open) setRowToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user &ldquo;{rowToDelete?.name || rowToDelete?.email}&rdquo;? This will disable their access to the CMS dashboard.
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
    </div>
  )
}
