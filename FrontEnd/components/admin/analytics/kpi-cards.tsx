import type { AnalyticsOverview } from "@/lib/admin-api"
import { KpiCard, type KpiTrend } from "@/components/admin/kpi-card"
import { fmtDuration, fmtNumber, fmtPct } from "@/components/admin/analytics/format"

type Kpi = {
  label: string
  value: string
  trend: KpiTrend
}

// Stat tiles with a trend chip vs the preceding period of equal length.
export function KpiCards({
  overview,
  previous,
}: {
  overview: AnalyticsOverview
  previous: AnalyticsOverview
}) {
  const kpis: Kpi[] = [
    {
      label: "Unique Visitors",
      value: fmtNumber(overview.uniqueVisitors),
      trend: { current: overview.uniqueVisitors, previous: previous.uniqueVisitors },
    },
    {
      label: "Sessions",
      value: fmtNumber(overview.sessions),
      trend: { current: overview.sessions, previous: previous.sessions },
    },
    {
      label: "Page Views",
      value: fmtNumber(overview.pageViews),
      trend: { current: overview.pageViews, previous: previous.pageViews },
    },
    {
      label: "New Visitors",
      value: fmtNumber(overview.newVisitors),
      trend: { current: overview.newVisitors, previous: previous.newVisitors },
    },
    {
      label: "Returning",
      value: fmtNumber(overview.returningVisitors),
      trend: { current: overview.returningVisitors, previous: previous.returningVisitors },
    },
    {
      label: "Avg Session",
      value: fmtDuration(overview.avgSessionSec),
      trend: { current: overview.avgSessionSec, previous: previous.avgSessionSec },
    },
    {
      label: "Bounce Rate",
      value: fmtPct(overview.bounceRate),
      trend: { current: overview.bounceRate, previous: previous.bounceRate, goodWhenDown: true },
    },
  ]

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} trend={kpi.trend} />
      ))}
    </div>
  )
}
