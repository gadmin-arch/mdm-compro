"use client"

import type { ReactNode } from "react"
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { SortDirection } from "@/components/admin/use-client-sort"

// Column header with a real <button> so sorting is keyboard-accessible, and
// aria-sort so screen readers announce the current order.
export function SortableHead({
  active,
  className,
  children,
  direction,
  onSort,
}: {
  active: boolean
  className?: string
  children: ReactNode
  direction: SortDirection
  onSort: () => void
}) {
  return (
    <TableHead
      aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}
      className={cn("p-0", className)}
    >
      <button
        type="button"
        onClick={onSort}
        className="flex h-10 w-full items-center gap-1 px-2 text-left font-medium transition-colors hover:bg-secondary/40"
      >
        {children}
        {active ? (
          direction === "asc" ? (
            <ChevronUp aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary" />
          )
        ) : (
          <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted-foreground/45" />
        )}
      </button>
    </TableHead>
  )
}
