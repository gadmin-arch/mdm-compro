"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Archive, Copy, Edit3, ChevronUp, ChevronDown, ArrowUpDown, Lock } from "lucide-react"
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

export function PagesTable({ pages }: PagesTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [rowToArchive, setRowToArchive] = useState<PageContent | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedPages = useMemo(() => {
    if (!sortField) return pages

    return [...pages].sort((a, b) => {
      let aVal = ""
      let bVal = ""

      if (sortField === "version") {
        const aNum = a.version ?? 0
        const bNum = b.version ?? 0
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum
      }

      aVal = (a[sortField] || "").toLowerCase()
      bVal = (b[sortField] || "").toLowerCase()

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [pages, sortField, sortDirection])

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
              onClick={() => handleSort("title")}
              className="cursor-pointer select-none w-1/3 min-w-[160px] hover:bg-secondary/40 transition-colors"
            >
              Title {renderSortIcon("title")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("key")}
              className="cursor-pointer select-none w-1/4 min-w-[120px] hover:bg-secondary/40 transition-colors"
            >
              Key {renderSortIcon("key")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("status")}
              className="cursor-pointer select-none w-28 hover:bg-secondary/40 transition-colors"
            >
              Status {renderSortIcon("status")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("version")}
              className="cursor-pointer select-none w-24 hover:bg-secondary/40 transition-colors"
            >
              Version {renderSortIcon("version")}
            </TableHead>
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
            <TableRow>
              <TableCell className="py-8 text-center text-muted-foreground" colSpan={5}>
                No pages found.
              </TableCell>
            </TableRow>
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {rowToArchive && (
              <form action={async (formData) => {
                await deletePageAction(formData);
                setRowToArchive(null);
              }}>
                <input name="id" type="hidden" value={rowToArchive.id} />
                <input name="version" type="hidden" value={rowToArchive.version} />
                <input name="key" type="hidden" value={rowToArchive.key} />
                <AlertDialogAction type="submit">
                  Confirm Archive
                </AlertDialogAction>
              </form>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
