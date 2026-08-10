import Link from "next/link"
import type { ReactNode } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ChevronRight } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

// One dataset, two renderings: stacked cards on phones and tablets (no
// clipped action column, no horizontal scrolling) and the full table from lg
// up — the same breakpoint where the sidebar appears and there is finally
// room for every column.
export function AdminDataView<TData, TValue>({
  columns,
  data,
  renderCard,
  empty,
  paginated,
  pageSize,
}: {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  renderCard: (row: TData) => ReactNode
  empty: { title: string; description?: string; icon?: ReactNode }
  paginated?: boolean
  pageSize?: number
}) {
  const emptyState = <AdminEmpty {...empty} />

  return (
    <>
      <div className="mt-6 space-y-3 lg:hidden">
        {data.length === 0 ? (
          <div className="rounded-xl border border-border bg-background">{emptyState}</div>
        ) : (
          data.map((row) => renderCard(row))
        )}
      </div>

      <div className="mt-6 hidden lg:block">
        <DataTable
          columns={columns}
          data={data}
          empty={emptyState}
          paginated={paginated}
          pageSize={pageSize}
        />
      </div>
    </>
  )
}

export function AdminEmpty({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: ReactNode
}) {
  return (
    <Empty className="border-0 p-8">
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}

// A list row on phones: tap the body to open the editor, with secondary
// actions on their own row so every target clears 44px.
export function AdminCard({
  title,
  href,
  subtitle,
  badges,
  meta,
  actions,
}: {
  title: string
  href?: string
  subtitle?: string
  badges?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
}) {
  const body = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug text-foreground">{title}</p>
        {subtitle && (
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{subtitle}</p>
        )}
        {badges && <div className="mt-2 flex flex-wrap items-center gap-1.5">{badges}</div>}
        {meta && <div className="mt-2 text-xs text-muted-foreground">{meta}</div>}
      </div>
      {href && (
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
    </div>
  )

  return (
    <div className="rounded-xl border border-border bg-background shadow-xs">
      {href ? (
        <Link
          href={href}
          className={cn(
            "block rounded-t-xl p-4 transition-colors hover:bg-secondary/50",
            !actions && "rounded-b-xl",
          )}
        >
          {body}
        </Link>
      ) : (
        <div className="p-4">{body}</div>
      )}
      {actions && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-2">
          {actions}
        </div>
      )}
    </div>
  )
}
