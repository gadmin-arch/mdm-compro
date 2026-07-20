import type { ReactNode } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

// Shared empty state for admin tables.
export function TableEmpty({
  colSpan,
  title,
  description,
  icon,
}: {
  colSpan: number
  title: string
  description?: string
  icon?: ReactNode
}) {
  return (
    <TableRow>
      <TableCell className="py-6" colSpan={colSpan}>
        <Empty className="border-0 p-6">
          <EmptyHeader>
            {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
            <EmptyTitle>{title}</EmptyTitle>
            {description && <EmptyDescription>{description}</EmptyDescription>}
          </EmptyHeader>
        </Empty>
      </TableCell>
    </TableRow>
  )
}
