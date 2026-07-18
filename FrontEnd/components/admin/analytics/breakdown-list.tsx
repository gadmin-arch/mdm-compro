import type { AnalyticsBreakdownRow, AnalyticsEntryExitRow, AnalyticsEventRow } from "@/lib/admin-api"
import { fmtNumber } from "@/components/admin/analytics/format"

type Row = { label: string; count: number }

// Horizontal bar list: identity lives in the row label, so a single hue
// (the series blue) carries magnitude for every row.
export function BarList({ title, rows, unit = "sessions", empty = "No data in this range." }: {
  title: string
  rows: Row[]
  unit?: string
  empty?: string
}) {
  const max = Math.max(1, ...rows.map((row) => row.count))
  const total = rows.reduce((sum, row) => sum + row.count, 0)

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {rows.map((row) => {
            const pct = total > 0 ? (row.count / total) * 100 : 0
            return (
              <li
                key={row.label}
                className="relative overflow-hidden rounded-md"
                title={`${row.label}: ${row.count.toLocaleString()} ${unit} (${pct.toFixed(1)}%)`}
              >
                <div className="absolute inset-y-0 left-0 rounded-md bg-[#2a78d6]/12 dark:bg-[#3987e5]/20" style={{ width: `${(row.count / max) * 100}%` }} />
                <div className="relative flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm">
                  <span className="min-w-0 truncate text-foreground">{row.label}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {fmtNumber(row.count)}
                    <span className="ml-1.5 hidden text-xs sm:inline">{pct.toFixed(0)}%</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export function breakdownRows(rows: AnalyticsBreakdownRow[] | null | undefined): Row[] {
  return (rows ?? []).map((row) => ({ label: row.value, count: row.sessions }))
}

export function entryExitRows(rows: AnalyticsEntryExitRow[] | null | undefined): Row[] {
  return (rows ?? []).map((row) => ({ label: row.path, count: row.sessions }))
}

export function eventRows(rows: AnalyticsEventRow[] | null | undefined): Row[] {
  return (rows ?? []).map((row) => ({ label: row.name, count: row.count }))
}
