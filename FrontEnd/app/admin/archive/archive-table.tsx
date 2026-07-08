"use client"

import { useMemo, useState } from "react"
import { RotateCcw, Trash2, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"
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
import type { ArchivedItem } from "@/lib/admin-api"
import { restoreItemAction, hardDeleteItemAction } from "./actions"

type ArchiveTableProps = {
  items: ArchivedItem[]
}

type SortField = "title" | "type" | "deletedAt"

export function ArchiveTable({ items }: ArchiveTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [itemToRestore, setItemToRestore] = useState<ArchivedItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ArchivedItem | null>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedItems = useMemo(() => {
    if (!sortField) return items

    return [...items].sort((a, b) => {
      let aVal = ""
      let bVal = ""

      if (sortField === "deletedAt") {
        aVal = a.deletedAt || ""
        bVal = b.deletedAt || ""
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
  }, [items, sortField, sortDirection])

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

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
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
              onClick={() => handleSort("type")}
              className="cursor-pointer select-none w-1/4 min-w-[100px] hover:bg-secondary/40 transition-colors"
            >
              Type {renderSortIcon("type")}
            </TableHead>
            <TableHead 
              onClick={() => handleSort("deletedAt")}
              className="cursor-pointer select-none w-44 hover:bg-secondary/40 transition-colors"
            >
              Date Archived {renderSortIcon("deletedAt")}
            </TableHead>
            <TableHead className="w-[280px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow key={`${item.type}-${item.id}`}>
              <TableCell className="font-medium whitespace-normal break-words">{item.title}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground whitespace-nowrap">
                {formatDate(item.deletedAt)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setItemToRestore(item)}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => setItemToDelete(item)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Permanently
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {sortedItems.length === 0 && (
            <TableRow>
              <TableCell className="py-8 text-center text-muted-foreground" colSpan={4}>
                No archived items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={itemToRestore !== null} onOpenChange={(open) => { if (!open) setItemToRestore(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Archived Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore &ldquo;{itemToRestore?.title}&rdquo; ({itemToRestore?.type})? It will return to the active lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {itemToRestore && (
              <form action={async (formData) => {
                await restoreItemAction(formData)
                setItemToRestore(null)
              }}>
                <input name="id" type="hidden" value={itemToRestore.id} />
                <input name="type" type="hidden" value={itemToRestore.type} />
                <AlertDialogAction type="submit">
                  Confirm Restore
                </AlertDialogAction>
              </form>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hard Delete Confirmation Dialog */}
      <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => { if (!open) setItemToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Permanently Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete &ldquo;{itemToDelete?.title}&rdquo; ({itemToDelete?.type})? This action is irreversible and will delete all data related to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {itemToDelete && (
              <form action={async (formData) => {
                await hardDeleteItemAction(formData)
                setItemToDelete(null)
              }}>
                <input name="id" type="hidden" value={itemToDelete.id} />
                <input name="type" type="hidden" value={itemToDelete.type} />
                <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Permanently
                </AlertDialogAction>
              </form>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
