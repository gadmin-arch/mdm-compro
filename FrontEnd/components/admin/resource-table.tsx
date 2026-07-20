"use client"

import { useState } from "react"
import Link from "next/link"
import { Archive, Edit3, ExternalLink, Inbox } from "lucide-react"
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

function sortValue(row: AdminResourceRow, field: SortField) {
  if (field === "slug") return row.path || row.slug || ""
  return row[field] || ""
}

export function AdminResourceTable({
  basePath,
  deleteAction,
  empty,
  publicBasePath,
  resource,
  rows,
}: AdminResourceTableProps) {
  const { field, direction, toggle, sorted: sortedRows } = useClientSort(rows, sortValue)
  const [rowToArchive, setRowToArchive] = useState<AdminResourceRow | null>(null)

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
              active={field === "slug"}
              direction={direction}
              onSort={() => toggle("slug")}
              className="w-1/4 min-w-[120px]"
            >
              Slug
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
              active={field === "meta"}
              direction={direction}
              onSort={() => toggle("meta")}
              className="w-[15%] min-w-[80px]"
            >
              Info
            </SortableHead>
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
            <TableEmpty
              colSpan={5}
              icon={<Inbox className="h-5 w-5" aria-hidden="true" />}
              title={empty}
              description="Adjust the search or status filter, or add a new item."
            />
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
