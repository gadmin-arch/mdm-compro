"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Archive, Copy, Edit3, FileText, Lock } from "lucide-react"
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
import { isSystemPageKey, type PageContent } from "@/lib/cms"
import { deletePageAction, duplicatePageAction } from "@/app/admin/pages/actions"

type PagesTableProps = {
  pages: PageContent[]
}

type SortField = "title" | "key" | "status" | "version"

function sortValue(page: PageContent, field: SortField) {
  // Zero-padding keeps numeric versions ordered under string comparison.
  if (field === "version") return String(page.version ?? 0).padStart(10, "0")
  return page[field] || ""
}

export function PagesTable({ pages }: PagesTableProps) {
  const { field, direction, toggle, sorted: sortedPages } = useClientSort(pages, sortValue)
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

  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-border bg-background">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <SortableHead
              active={field === "title"}
              direction={direction}
              onSort={() => toggle("title")}
              className="w-1/3 min-w-[160px]"
            >
              Title
            </SortableHead>
            <SortableHead
              active={field === "key"}
              direction={direction}
              onSort={() => toggle("key")}
              className="w-1/4 min-w-[120px]"
            >
              Key
            </SortableHead>
            <SortableHead
              active={field === "status"}
              direction={direction}
              onSort={() => toggle("status")}
              className="w-28"
            >
              Status
            </SortableHead>
            <SortableHead
              active={field === "version"}
              direction={direction}
              onSort={() => toggle("version")}
              className="w-24"
            >
              Version
            </SortableHead>
            <TableHead className="w-[280px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium whitespace-normal break-words">{page.title}</TableCell>
              <TableCell className="text-muted-foreground whitespace-normal break-all">{page.key}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant={page.status === "published" ? "default" : "outline"}>
                  {page.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">{page.version}</TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/pages/${page.id}`}>
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <form action={duplicatePageAction}>
                    <input name="id" type="hidden" value={page.id} />
                    <Button size="sm" type="submit" variant="outline">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </form>
                  {isSystemPageKey(page.key) ? (
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      disabled
                      title="System page — the website routes here, so it cannot be archived."
                    >
                      <Lock className="h-4 w-4" />
                      System
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      onClick={() => setRowToArchive(page)}
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {sortedPages.length === 0 && (
            <TableEmpty
              colSpan={5}
              icon={<FileText className="h-5 w-5" aria-hidden="true" />}
              title="No pages found."
              description="Create a page to manage its content here."
            />
          )}
        </TableBody>
      </Table>

      {/* Archive Page Confirmation Dialog */}
      <AlertDialog open={rowToArchive !== null} onOpenChange={(open) => { if (!open) setRowToArchive(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Page?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive page &ldquo;{rowToArchive?.title}&rdquo;? You can restore it later from the Archive folder.
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
    </div>
  )
}
