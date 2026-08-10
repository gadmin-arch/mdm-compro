"use client"

import * as React from "react"
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Desktop table for admin lists. Sorting and column visibility are handled
// here; paging is off by default because admin lists are paginated by the
// server through the URL (see AdminPagination). Pass `paginated` for lists
// that load in full, like users.
export function DataTable<TData, TValue>({
  columns,
  data,
  empty,
  paginated = false,
  pageSize = 20,
  onRowClick,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  empty?: React.ReactNode
  paginated?: boolean
  pageSize?: number
  onRowClick?: (row: TData) => void
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: paginated ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : undefined,
  })

  const rows = table.getRowModel().rows
  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide())

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background">
      {hideableColumns.length > 0 && (
        <div className="flex items-center justify-end border-b border-border px-3 py-2 print:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {hideableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="text-xs capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                >
                  {column.id.replace(/[-_]/g, " ")}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="overflow-x-auto">
        {/* table-fixed so a long cell wraps inside its column instead of
            stretching the table and pushing the action column out of view. */}
        <Table className="table-fixed">
          <TableHeader className="sticky top-0 z-10 bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() || undefined }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={onRowClick ? "cursor-pointer" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    // whitespace-normal overrides TableCell's nowrap so long
                    // values wrap inside their fixed column instead of
                    // spilling over the next one.
                    <TableCell key={cell.id} className="py-3 align-top whitespace-normal">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginated && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground print:hidden">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ·{" "}
            {data.length} rows
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
