"use client"

import { useMemo, useState, useTransition } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Archive, RotateCcw, Trash2 } from "lucide-react"
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
import type { ArchivedItem } from "@/lib/admin-api"
import { restoreItemAction, hardDeleteItemAction } from "./actions"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ArchiveTable({ items }: { items: ArchivedItem[] }) {
  const [itemToRestore, setItemToRestore] = useState<ArchivedItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ArchivedItem | null>(null)
  const [pending, startAction] = useTransition()

  // Dispatch via a transition, not a form submit: AlertDialogAction closes the
  // dialog on click, unmounting a form-in-dialog before React can dispatch its
  // action — so restore/delete silently never fired.
  function confirmRestore() {
    if (!itemToRestore) return
    const formData = new FormData()
    formData.set("id", itemToRestore.id)
    formData.set("type", itemToRestore.type)
    startAction(() => restoreItemAction(formData))
  }

  function confirmHardDelete() {
    if (!itemToDelete) return
    const formData = new FormData()
    formData.set("id", itemToDelete.id)
    formData.set("type", itemToDelete.type)
    startAction(() => hardDeleteItemAction(formData))
  }

  const columns = useMemo<ColumnDef<ArchivedItem>[]>(
    () => [
      {
        accessorKey: "title",
        size: 300,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: "type",
        size: 140,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.type}
          </Badge>
        ),
      },
      {
        accessorKey: "deletedAt",
        size: 220,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date Archived" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatDate(row.original.deletedAt)}</span>
        ),
      },
      {
        id: "actions",
        size: 300,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setItemToRestore(row.original)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Restore
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setItemToDelete(row.original)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete Permanently
            </Button>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <>
      <AdminDataView
        columns={columns}
        data={items}
        empty={{
          title: "No archived items found.",
          description: "Items you archive from the content lists show up here.",
          icon: <Archive className="h-5 w-5" aria-hidden="true" />,
        }}
        renderCard={(item) => (
          <AdminCard
            key={`${item.type}-${item.id}`}
            title={item.title}
            badges={
              <>
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(item.deletedAt)}</span>
              </>
            }
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 flex-1"
                  onClick={() => setItemToRestore(item)}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Restore
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11 flex-1 text-destructive"
                  onClick={() => setItemToDelete(item)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete
                </Button>
              </>
            }
          />
        )}
      />

      <AlertDialog
        open={itemToRestore !== null}
        onOpenChange={(open) => {
          if (!open) setItemToRestore(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Archived Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore &ldquo;{itemToRestore?.title}&rdquo; (
              {itemToRestore?.type})? It will return to the active lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={confirmRestore}>
              {pending ? "Restoring…" : "Confirm Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={itemToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Permanently Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &ldquo;{itemToDelete?.title}&rdquo; (
              {itemToDelete?.type})? This action is irreversible and will delete all data related to
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={confirmHardDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {pending ? "Deleting…" : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
