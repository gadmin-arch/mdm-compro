"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Archive, Edit3, ExternalLink, Inbox } from "lucide-react"
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

type Action = (formData: FormData) => void | Promise<void>

export type AdminResourceRow = {
  id: string
  title: string
  slug: string
  path?: string
  status: string
  version?: number
  meta?: string
}

type AdminResourceTableProps = {
  basePath: string
  deleteAction: Action
  empty: string
  publicBasePath: string
  resource?: "services" | "products"
  rows: AdminResourceRow[]
}

export function AdminResourceTable({
  basePath,
  deleteAction,
  empty,
  publicBasePath,
  resource,
  rows,
}: AdminResourceTableProps) {
  const [rowToArchive, setRowToArchive] = useState<AdminResourceRow | null>(null)
  const [archiving, startArchive] = useTransition()

  // Dispatch via a transition, not a form submit: AlertDialogAction closes the
  // dialog on click, unmounting a form-in-dialog before React can dispatch its
  // action — so the archive silently never fired.
  function confirmArchive() {
    if (!rowToArchive) return
    const formData = new FormData()
    if (resource) formData.set("resource", resource)
    formData.set("id", rowToArchive.id)
    formData.set("version", String(rowToArchive.version ?? 0))
    formData.set(resource ? "oldPath" : "oldSlug", rowToArchive.path || rowToArchive.slug)
    startArchive(() => deleteAction(formData))
  }

  const columns = useMemo<ColumnDef<AdminResourceRow>[]>(
    () => [
      {
        accessorKey: "title",
        // Column sizes drive the fixed layout, so no cell can stretch the
        // table and push the action column out of view.
        size: 240,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        id: "slug",
        size: 220,
        accessorFn: (row) => row.path || row.slug,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Slug" />,
        cell: ({ row }) => (
          <span className="block break-all text-muted-foreground">
            {row.original.path || row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "status",
        size: 110,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge variant={row.original.status === "published" ? "default" : "outline"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "meta",
        size: 260,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Info" />,
        cell: ({ row }) => (
          <span className="line-clamp-2 text-muted-foreground">{row.original.meta ?? "-"}</span>
        ),
      },
      {
        id: "actions",
        size: 250,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`${basePath}/${row.original.id}`}>
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                Edit
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link
                href={`${publicBasePath}/${row.original.path || row.original.slug}`}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View
              </Link>
            </Button>
            <Button size="sm" type="button" variant="ghost" onClick={() => setRowToArchive(row.original)}>
              <Archive className="h-4 w-4" aria-hidden="true" />
              Archive
            </Button>
          </div>
        ),
      },
    ],
    [basePath, publicBasePath],
  )

  return (
    <>
      <AdminDataView
        columns={columns}
        data={rows}
        empty={{
          title: empty,
          description: "Adjust the search or status filter, or add a new item.",
          icon: <Inbox className="h-5 w-5" aria-hidden="true" />,
        }}
        renderCard={(row) => (
          <AdminCard
            key={row.id}
            title={row.title}
            href={`${basePath}/${row.id}`}
            subtitle={row.path || row.slug}
            badges={
              <Badge variant={row.status === "published" ? "default" : "outline"}>{row.status}</Badge>
            }
            meta={row.meta}
            actions={
              <>
                <Button asChild size="sm" variant="outline" className="min-h-11 flex-1">
                  <Link href={`${publicBasePath}/${row.path || row.slug}`} rel="noreferrer" target="_blank">
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    View
                  </Link>
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="ghost"
                  className="min-h-11 flex-1 text-destructive"
                  onClick={() => setRowToArchive(row)}
                >
                  <Archive className="h-4 w-4" aria-hidden="true" />
                  Archive
                </Button>
              </>
            }
          />
        )}
      />

      <AlertDialog
        open={rowToArchive !== null}
        onOpenChange={(open) => {
          if (!open) setRowToArchive(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive &ldquo;{rowToArchive?.title}&rdquo;? You can restore it
              later from the Archive folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={archiving} onClick={confirmArchive}>
              {archiving ? "Archiving…" : "Confirm Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
