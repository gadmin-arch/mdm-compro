"use client"

import { useMemo, useState } from "react"
import { ShieldCheck, Trash2, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"
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

export function UsersTable({ users, currentUserId, currentRole }: UsersTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [rowToDelete, setRowToDelete] = useState<UserRow | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedUsers = useMemo(() => {
    if (!sortField) return users

    return [...users].sort((a, b) => {
      let aVal = ""
      let bVal = ""

      if (sortField === "name") {
        aVal = a.name || a.email || ""
        bVal = b.name || b.email || ""
      } else if (sortField === "status") {
        aVal = a.isActive ? "active" : "pending"
        bVal = b.isActive ? "active" : "pending"
      } else {
        aVal = a[sortField] || ""
        bVal = b[sortField] || ""
      }

      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [users, sortField, sortDirection])

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 inline-block text-muted-foreground/45" />
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-3.5 w-3.5 inline-block text-primary" />
    ) : (
      <ChevronDown className="ml-1 h-3.5 w-3.5 inline-block text-primary" />
    )
  }

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead 
              onClick={() => handleSort("name")}
              className="cursor-pointer select-none w-1/3 min-w-[160px] hover:bg-secondary/40 transition-colors"
            >
              User {renderSortIcon("name")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("role")}
              className="cursor-pointer select-none w-1/4 min-w-[100px] hover:bg-secondary/40 transition-colors"
            >
              Role {renderSortIcon("role")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("status")}
              className="cursor-pointer select-none w-44 hover:bg-secondary/40 transition-colors"
            >
              Status {renderSortIcon("status")}
            </TableHead>
            <TableHead className="w-[280px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => {
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
            <TableRow>
              <TableCell className="py-8 text-center text-muted-foreground" colSpan={4}>
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {rowToDelete && (
              <form action={async (formData) => {
                await deleteUserAction(formData);
                setRowToDelete(null);
              }}>
                <input name="id" type="hidden" value={rowToDelete.id} />
                <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Confirm Delete
                </AlertDialogAction>
              </form>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
