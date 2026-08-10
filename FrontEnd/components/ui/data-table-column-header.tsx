import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import type { Column } from "@tanstack/react-table"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Sortable column header: a real button, so sorting is keyboard-reachable.
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return <div className={cn("px-1 text-xs font-semibold", className)}>{title}</div>
  }

  const sorted = column.getIsSorted()
  return (
    <div className={cn("flex items-center", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        aria-label={`Sort by ${title}`}
        onClick={() => column.toggleSorting(sorted === "asc")}
      >
        <span className="text-xs font-semibold">{title}</span>
        {sorted === "desc" ? (
          <ArrowDown className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
        ) : sorted === "asc" ? (
          <ArrowUp className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ChevronsUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
        )}
      </Button>
    </div>
  )
}
