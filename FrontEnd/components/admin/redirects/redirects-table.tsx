"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { Archive, Check, Copy, CopyPlus, Edit3, ExternalLink, Link2, QrCode, Trash2 } from "lucide-react"
import { AdminCard, AdminDataView } from "@/components/admin/data-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { AdminRedirect } from "@/lib/admin-api"
import {
  archiveRedirectAction,
  bulkDeleteRedirectsAction,
  duplicateRedirectAction,
} from "@/app/admin/(workspace)/redirects/actions"

function shortUrl(slug: string) {
  if (typeof window === "undefined") return `/${slug}`
  return `${window.location.origin}/${slug}`
}

function isExpired(item: AdminRedirect) {
  return Boolean(item.expiresAt && new Date(item.expiresAt).getTime() <= Date.now())
}

function StatusBadge({ item }: { item: AdminRedirect }) {
  if (isExpired(item)) {
    return (
      <Badge variant="outline" className="text-destructive">
        Expired
      </Badge>
    )
  }
  return item.isActive ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>
}

export function RedirectsTable({ redirects }: { redirects: AdminRedirect[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [toArchive, setToArchive] = useState<AdminRedirect | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [archiving, startArchive] = useTransition()

  const allSelected = redirects.length > 0 && selected.size === redirects.length
  const selectedIds = useMemo(() => JSON.stringify([...selected]), [selected])

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(redirects.map((item) => item.id)))
  }

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function copyLink(item: AdminRedirect) {
    try {
      await navigator.clipboard.writeText(shortUrl(item.slug))
      setCopiedId(item.id)
      setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1500)
    } catch {
      window.prompt("Copy the short link:", shortUrl(item.slug))
    }
  }

  // Dispatch via a transition, not a form submit: AlertDialogAction closes the
  // dialog on click, unmounting a form-in-dialog before React can dispatch its
  // action — so the archive silently never fired.
  function confirmArchive() {
    if (!toArchive) return
    const formData = new FormData()
    formData.set("id", toArchive.id)
    formData.set("version", String(toArchive.version))
    startArchive(() => archiveRedirectAction(formData))
  }

  function confirmBulkArchive() {
    const formData = new FormData()
    formData.set("ids", selectedIds)
    startArchive(() => bulkDeleteRedirectsAction(formData))
  }

  const columns = useMemo<ColumnDef<AdminRedirect>[]>(
    () => [
      {
        id: "select",
        size: 44,
        enableSorting: false,
        enableHiding: false,
        header: () => (
          <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selected.has(row.original.id)}
            onCheckedChange={() => toggleOne(row.original.id)}
            aria-label={`Select ${row.original.name}`}
          />
        ),
      },
      {
        accessorKey: "name",
        size: 220,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium text-foreground">{row.original.name}</p>
            {row.original.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground">{row.original.description}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "slug",
        size: 160,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Short link" />,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => copyLink(row.original)}
            className="inline-flex items-center gap-1.5 rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground hover:bg-secondary/70"
            title="Copy short link"
          >
            /{row.original.slug}
            {copiedId === row.original.id ? (
              <Check className="h-3 w-3 text-green-600" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
        ),
      },
      {
        accessorKey: "destination",
        size: 240,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Destination" />,
        cell: ({ row }) => (
          <a
            href={row.original.destination}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="line-clamp-1 break-all">{row.original.destination}</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
          </a>
        ),
      },
      {
        accessorKey: "redirectType",
        size: 90,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        cell: ({ row }) => <Badge variant="outline">{row.original.redirectType}</Badge>,
      },
      {
        id: "status",
        size: 110,
        accessorFn: (row) => (isExpired(row) ? "expired" : row.isActive ? "active" : "inactive"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => <StatusBadge item={row.original} />,
      },
      {
        accessorKey: "totalScans",
        size: 90,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Scans" />,
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.totalScans.toLocaleString()}</span>
        ),
      },
      {
        id: "actions",
        size: 220,
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/redirects/${row.original.id}`}>
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                Edit
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost" className="h-8 w-8" title="QR code">
              <Link href={`/admin/redirects/${row.original.id}#qr`}>
                <QrCode className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">QR code</span>
              </Link>
            </Button>
            <form action={duplicateRedirectAction}>
              <input type="hidden" name="id" value={row.original.id} />
              <Button size="icon" variant="ghost" className="h-8 w-8" type="submit" title="Duplicate">
                <CopyPlus className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Duplicate</span>
              </Button>
            </form>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive"
              type="button"
              title="Archive"
              onClick={() => setToArchive(row.original)}
            >
              <Archive className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Archive</span>
            </Button>
          </div>
        ),
      },
    ],
    // Selection and copy feedback are the only reactive inputs here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSelected, selected, copiedId],
  )

  return (
    <div className="mt-4">
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
          <span className="text-foreground">{selected.size} selected</span>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive"
            onClick={() => setBulkOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Archive selected
          </Button>
        </div>
      )}

      <AdminDataView
        columns={columns}
        data={redirects}
        empty={{
          title: "No short links yet.",
          description: "Create one to get a branded URL and QR code.",
          icon: <Link2 className="h-5 w-5" aria-hidden="true" />,
        }}
        renderCard={(item) => (
          <AdminCard
            key={item.id}
            title={item.name}
            href={`/admin/redirects/${item.id}`}
            subtitle={`/${item.slug} → ${item.destination}`}
            badges={
              <>
                <StatusBadge item={item} />
                <Badge variant="outline">{item.redirectType}</Badge>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {item.totalScans.toLocaleString()} scans
                </span>
              </>
            }
            meta={item.description}
            actions={
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 flex-1"
                  onClick={() => copyLink(item)}
                >
                  {copiedId === item.id ? (
                    <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                  ) : (
                    <Copy className="h-4 w-4" aria-hidden="true" />
                  )}
                  {copiedId === item.id ? "Copied" : "Copy"}
                </Button>
                <Button asChild size="sm" variant="outline" className="min-h-11 flex-1">
                  <Link href={`/admin/redirects/${item.id}#qr`}>
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    QR
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11 flex-1 text-destructive"
                  onClick={() => setToArchive(item)}
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
        open={toArchive !== null}
        onOpenChange={(open) => {
          if (!open) setToArchive(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive short link?</AlertDialogTitle>
            <AlertDialogDescription>
              “/{toArchive?.slug}” will stop redirecting immediately. Scan history is kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={archiving} onClick={confirmArchive}>
              {archiving ? "Archiving…" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive {selected.size} short links?</AlertDialogTitle>
            <AlertDialogDescription>
              All selected links stop redirecting immediately. Scan history is kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={archiving} onClick={confirmBulkArchive}>
              {archiving ? "Archiving…" : "Archive selected"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
