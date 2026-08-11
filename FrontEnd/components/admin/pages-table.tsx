"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Archive, Copy, Edit3, FileText, Lock } from "lucide-react"
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
import { isSystemPageKey, type PageContent } from "@/lib/cms"
import { deletePageAction, duplicatePageAction } from "@/app/admin/(workspace)/pages/actions"

export function PagesTable({ pages }: { pages: PageContent[] }) {
  const [rowToArchive, setRowToArchive] = useState<PageContent | null>(null)
  const [archiving, startArchive] = useTransition()

  // Dispatch via a transition, not a form submit: AlertDialogAction closes the
  // dialog on click, unmounting a form-in-dialog before React can dispatch its
  // action — so the archive silently never fired.
  function confirmArchive() {
    if (!rowToArchive) return
    const formData = new FormData()
    formData.set("id", rowToArchive.id)
    formData.set("version", String(rowToArchive.version))
    formData.set("key", rowToArchive.key)
    startArchive(() => deletePageAction(formData))
  }

  const columns = useMemo<ColumnDef<PageContent>[]>(
    () => [
      {
        accessorKey: "title",
        size: 260,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: "key",
        size: 240,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Key" />,
        cell: ({ row }) => (
          <span className="block break-all text-muted-foreground">{row.original.key}</span>
        ),
      },
      {
        accessorKey: "status",
        size: 120,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge variant={row.original.status === "published" ? "default" : "outline"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "version",
        size: 100,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Version" />,
        cell: ({ row }) => <span className="text-muted-foreground">{row.original.version}</span>,
      },
      {
        id: "actions",
        size: 280,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/pages/${row.original.id}`}>
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                Edit
              </Link>
            </Button>
            <form action={duplicatePageAction}>
              <input name="id" type="hidden" value={row.original.id} />
              <Button size="sm" type="submit" variant="outline">
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy
              </Button>
            </form>
            {isSystemPageKey(row.original.key) ? (
              <Button
                size="sm"
                type="button"
                variant="ghost"
                disabled
                title="System page — the website routes here, so it cannot be archived."
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                System
              </Button>
            ) : (
              <Button size="sm" type="button" variant="ghost" onClick={() => setRowToArchive(row.original)}>
                <Archive className="h-4 w-4" aria-hidden="true" />
                Archive
              </Button>
            )}
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
        data={pages}
        empty={{
          title: "No pages found.",
          description: "Create a page to manage its content here.",
          icon: <FileText className="h-5 w-5" aria-hidden="true" />,
        }}
        renderCard={(page) => (
          <AdminCard
            key={page.id}
            title={page.title}
            href={`/admin/pages/${page.id}`}
            subtitle={page.key}
            badges={
              <>
                <Badge variant={page.status === "published" ? "default" : "outline"}>
                  {page.status}
                </Badge>
                <span className="text-xs text-muted-foreground">v{page.version}</span>
                {isSystemPageKey(page.key) && (
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    System
                  </Badge>
                )}
              </>
            }
            actions={
              <>
                <form action={duplicatePageAction} className="flex-1">
                  <input name="id" type="hidden" value={page.id} />
                  <Button size="sm" type="submit" variant="outline" className="min-h-11 w-full">
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    Duplicate
                  </Button>
                </form>
                {!isSystemPageKey(page.key) && (
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    className="min-h-11 flex-1 text-destructive"
                    onClick={() => setRowToArchive(page)}
                  >
                    <Archive className="h-4 w-4" aria-hidden="true" />
                    Archive
                  </Button>
                )}
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
            <AlertDialogTitle>Archive Page?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive page &ldquo;{rowToArchive?.title}&rdquo;? You can
              restore it later from the Archive folder.
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
