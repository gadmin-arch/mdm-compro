import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { AnalyticsOverview } from "@/lib/admin-api"
import { delta, fmtDuration, fmtNumber, fmtPct } from "@/components/admin/analytics/format"
import { cn } from "@/lib/utils"

type Kpi = {
  label: string
  value: string
  current: number
  previous: number
  goodWhenDown?: boolean
  hint?: string
}

// Stat tiles with a trend chip vs the preceding period of equal length.
// Direction is carried by the arrow icon and sign, not by color alone.
export function KpiCards({ overview, previous }: { overview: AnalyticsOverview; previous: AnalyticsOverview }) {
  const kpis: Kpi[] = [
    { label: "Unique Visitors", value: fmtNumber(overview.uniqueVisitors), current: overview.uniqueVisitors, previous: previous.uniqueVisitors },
    { label: "Sessions", value: fmtNumber(overview.sessions), current: overview.sessions, previous: previous.sessions },
    { label: "Page Views", value: fmtNumber(overview.pageViews), current: overview.pageViews, previous: previous.pageViews },
    { label: "New Visitors", value: fmtNumber(overview.newVisitors), current: overview.newVisitors, previous: previous.newVisitors },
    { label: "Returning", value: fmtNumber(overview.returningVisitors), current: overview.returningVisitors, previous: previous.returningVisitors },
    { label: "Avg Session", value: fmtDuration(overview.avgSessionSec), current: overview.avgSessionSec, previous: previous.avgSessionSec },
    { label: "Bounce Rate", value: fmtPct(overview.bounceRate), current: overview.bounceRate, previous: previous.bounceRate, goodWhenDown: true },
  ]

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
      {kpis.map((kpi) => (
        <KpiTile key={kpi.label} kpi={kpi} />
      ))}
    </div>
  )
}

function KpiTile({ kpi }: { kpi: Kpi }) {
  const change = delta(kpi.current, kpi.previous)
  const up = change != null && change > 0.05
  const down = change != null && change < -0.05
  const improved = kpi.goodWhenDown ? down : up
  const worsened = kpi.goodWhenDown ? up : down

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground" title={kpi.label}>
        {kpi.label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">{kpi.value}</p>
      <p
        className={cn(
          "mt-1.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
          improved && "bg-green-600/10 text-green-700 dark:text-green-400",
          worsened && "bg-red-600/10 text-red-700 dark:text-red-400",
          !improved && !worsened && "bg-secondary text-muted-foreground",
        )}
        title="Compared with the previous period of the same length"
      >
        {up && <ArrowUpRight className="h-3 w-3" />}
        {down && <ArrowDownRight className="h-3 w-3" />}
        {!up && !down && <Minus className="h-3 w-3" />}
        {change == null ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
      </p>
    </div>
  )
}
