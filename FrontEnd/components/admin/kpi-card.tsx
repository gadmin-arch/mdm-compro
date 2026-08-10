import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export type KpiTrend = {
  current: number
  previous: number
  // Bounce rate and similar metrics improve as they fall.
  goodWhenDown?: boolean
  // Tooltip on the chip; defaults to the previous-period wording.
  hint?: string
}

// Percentage change vs the comparison value; null when there is no baseline.
function delta(current: number, previous: number): number | null {
  if (!Number.isFinite(previous) || previous === 0) return null
  return ((current - previous) / previous) * 100
}

// The stat tile used on the dashboard and the analytics overview. Direction is
// carried by the arrow and sign as well as color, so it survives color-blind
// viewing and printing.
export function KpiCard({
  title,
  value,
  icon,
  href,
  trend,
  footer,
}: {
  title: string
  value: ReactNode
  icon?: ReactNode
  // Renders the whole tile as a link to the matching module.
  href?: string
  trend?: KpiTrend
  // Secondary line under the value, e.g. a per-status breakdown.
  footer?: ReactNode
}) {
  const body = (
    <div
      className={cn(
        "h-full rounded-xl border border-border bg-background p-4 transition-shadow",
        href && "hover:border-primary/20 hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Wraps rather than truncates: at seven columns a label like
            "Unique Visitors" would otherwise be cut mid-word. */}
        <p className="line-clamp-2 text-xs font-medium uppercase tracking-wide text-muted-foreground" title={title}>
          {title}
        </p>
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {trend && <TrendChip trend={trend} />}
      {footer && <p className="mt-1.5 text-sm text-muted-foreground">{footer}</p>}
    </div>
  )

  if (!href) return body
  return (
    <Link href={href} className="block h-full rounded-xl">
      {body}
    </Link>
  )
}

function TrendChip({ trend }: { trend: KpiTrend }) {
  const change = delta(trend.current, trend.previous)
  const up = change != null && change > 0.05
  const down = change != null && change < -0.05
  const improved = trend.goodWhenDown ? down : up
  const worsened = trend.goodWhenDown ? up : down

  return (
    <p
      className={cn(
        "mt-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
        improved && "bg-green-600/10 text-green-700 dark:text-green-400",
        worsened && "bg-red-600/10 text-red-700 dark:text-red-400",
        !improved && !worsened && "bg-secondary text-muted-foreground",
      )}
      title={trend.hint ?? "Compared with the previous period of the same length"}
    >
      {up && <ArrowUpRight className="h-3 w-3" aria-hidden="true" />}
      {down && <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
      {!up && !down && <Minus className="h-3 w-3" aria-hidden="true" />}
      {change == null ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
    </p>
  )
}
