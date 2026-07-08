"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Archive, Edit3, ExternalLink, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"
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

type SortField = "title" | "slug" | "status" | "meta"

export function AdminResourceTable({
  basePath,
  deleteAction,
  empty,
  publicBasePath,
  resource,
  rows,
}: AdminResourceTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [rowToArchive, setRowToArchive] = useState<AdminResourceRow | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedRows = useMemo(() => {
    if (!sortField) return rows

    return [...rows].sort((a, b) => {
      let aVal = ""
      let bVal = ""

      if (sortField === "slug") {
        aVal = a.path || a.slug || ""
        bVal = b.path || b.slug || ""
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
  }, [rows, sortField, sortDirection])

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
              onClick={() => handleSort("slug")}
              className="cursor-pointer select-none w-1/4 min-w-[120px] hover:bg-secondary/40 transition-colors"
            >
              Slug {renderSortIcon("slug")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("status")}
              className="cursor-pointer select-none w-28 hover:bg-secondary/40 transition-colors"
            >
              Status {renderSortIcon("status")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("meta")}
              className="cursor-pointer select-none w-[15%] min-w-[80px] hover:bg-secondary/40 transition-colors"
            >
              Info {renderSortIcon("meta")}
            </TableHead>
            <TableHead className="w-[280px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row) => {
            const path = row.path || row.slug
            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium whitespace-normal break-words">{row.title}</TableCell>
                <TableCell className="text-muted-foreground whitespace-normal break-all">{path}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge variant={row.status === "published" ? "default" : "outline"}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-normal break-words">{row.meta ?? "-"}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`${basePath}/${row.id}`}>
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`${publicBasePath}/${path}`} rel="noreferrer" target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      type="button" 
                      variant="ghost"
                      onClick={() => setRowToArchive(row)}
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
          {sortedRows.length === 0 && (
            <TableRow>
              <TableCell className="py-8 text-center text-muted-foreground" colSpan={5}>
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Archive Resource Confirmation Dialog */}
      <AlertDialog open={rowToArchive !== null} onOpenChange={(open) => { if (!open) setRowToArchive(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive &ldquo;{rowToArchive?.title}&rdquo;? You can restore it later from the Archive folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {rowToArchive && (
              <form action={async (formData) => {
                await deleteAction(formData);
                setRowToArchive(null);
              }}>
                {resource && <input name="resource" type="hidden" value={resource} />}
                <input name="id" type="hidden" value={rowToArchive.id} />
                <input name="version" type="hidden" value={rowToArchive.version ?? 0} />
                <input name={resource ? "oldPath" : "oldSlug"} type="hidden" value={rowToArchive.path || rowToArchive.slug} />
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
