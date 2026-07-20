"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Archive, Check, Copy, CopyPlus, Edit3, ExternalLink, Link2, QrCode, Trash2 } from "lucide-react"
import { TableEmpty } from "@/components/admin/table-empty"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { AdminRedirect } from "@/lib/admin-api"
import {
  archiveRedirectAction,
  bulkDeleteRedirectsAction,
  duplicateRedirectAction,
} from "@/app/admin/redirects/actions"

function shortUrl(slug: string) {
  if (typeof window === "undefined") return `/${slug}`
  return `${window.location.origin}/${slug}`
}

function isExpired(item: AdminRedirect) {
  return Boolean(item.expiresAt && new Date(item.expiresAt).getTime() <= Date.now())
}

export function RedirectsTable({ redirects }: { redirects: AdminRedirect[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [toArchive, setToArchive] = useState<AdminRedirect | null>(null)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const allSelected = redirects.length > 0 && selected.size === redirects.length
  const selectedIds = useMemo(() => JSON.stringify([...selected]), [selected])

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(redirects.map((r) => r.id)))
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

  return (
    <div className="mt-4">
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm">
          <span className="text-foreground">{selected.size} selected</span>
          <Button size="sm" variant="outline" className="text-destructive" onClick={() => setBulkOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Archive selected
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                <TableHead className="min-w-[160px]">Name</TableHead>
                <TableHead className="min-w-[140px]">Short link</TableHead>
                <TableHead className="min-w-[200px]">Destination</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Scans</TableHead>
                <TableHead className="w-[210px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redirects.map((item) => {
                const expired = isExpired(item)
                return (
                  <TableRow key={item.id} className={!item.isActive || expired ? "opacity-60" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(item.id)}
                        onCheckedChange={() => toggleOne(item.id)}
                        aria-label={`Select ${item.name}`}
                      />
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <p className="truncate font-medium text-foreground">{item.name}</p>
                      {item.description && (
                        <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => copyLink(item)}
                        className="inline-flex items-center gap-1.5 rounded bg-secondary px-2 py-1 font-mono text-xs text-foreground hover:bg-secondary/70"
                        title="Copy short link"
                      >
                        /{item.slug}
                        {copiedId === item.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <a
                        href={item.destination}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1 truncate text-sm text-muted-foreground hover:text-foreground"
                      >
                        <span className="truncate">{item.destination}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.redirectType}</Badge>
                    </TableCell>
                    <TableCell>
                      {expired ? (
                        <Badge variant="outline" className="text-destructive">Expired</Badge>
                      ) : item.isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{item.totalScans.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/redirects/${item.id}`}>
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8" title="QR code">
                          <Link href={`/admin/redirects/${item.id}#qr`}>
                            <QrCode className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={duplicateRedirectAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <Button size="icon" variant="ghost" className="h-8 w-8" type="submit" title="Duplicate">
                            <CopyPlus className="h-4 w-4" />
                          </Button>
                        </form>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          type="button"
                          title="Archive"
                          onClick={() => setToArchive(item)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {redirects.length === 0 && (
                <TableEmpty
                  colSpan={8}
                  icon={<Link2 className="h-5 w-5" aria-hidden="true" />}
                  title="No short links yet."
                  description="Create one to get a branded URL and QR code."
                />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={toArchive !== null} onOpenChange={(open) => { if (!open) setToArchive(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive short link?</AlertDialogTitle>
            <AlertDialogDescription>
              “/{toArchive?.slug}” will stop redirecting immediately. Scan history is kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {toArchive && (
              <form action={archiveRedirectAction}>
                <input type="hidden" name="id" value={toArchive.id} />
                <input type="hidden" name="version" value={toArchive.version} />
                <AlertDialogAction type="submit">Archive</AlertDialogAction>
              </form>
            )}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={bulkDeleteRedirectsAction}>
              <input type="hidden" name="ids" value={selectedIds} />
              <AlertDialogAction type="submit">Archive selected</AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
