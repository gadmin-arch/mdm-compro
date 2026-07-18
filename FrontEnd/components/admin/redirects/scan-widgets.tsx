import { Activity, Globe2, TrendingUp } from "lucide-react"
import type { RedirectDashboardResponse, RedirectScan, RedirectTrendPoint } from "@/lib/admin-api"
import { fmtNumber } from "@/components/admin/analytics/format"

// Thin SVG bar chart of scans per day. Single series (slot-1 blue).
export function ScanTrendChart({ trend, title = "Scan Trends" }: { trend: RedirectTrendPoint[]; title?: string }) {
  const W = 600
  const H = 140
  const PAD = { top: 10, right: 8, bottom: 22, left: 34 }
  const max = Math.max(1, ...trend.map((p) => p.scans))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const barW = trend.length > 0 ? Math.min(26, (innerW / trend.length) * 0.7) : 0
  const step = trend.length > 0 ? innerW / trend.length : 0

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {trend.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No scans in this range yet.</p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img" aria-label={`${title}, peaking at ${fmtNumber(max)} scans per day`}>
          {[0.5, 1].map((f) => (
            <g key={f}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={PAD.top + innerH - f * innerH}
                y2={PAD.top + innerH - f * innerH}
                stroke="var(--border)"
                strokeDasharray="2 4"
              />
              <text x={PAD.left - 6} y={PAD.top + innerH - f * innerH + 3} textAnchor="end" fontSize="9" fill="var(--muted-foreground)">
                {fmtNumber(max * f)}
              </text>
            </g>
          ))}
          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + innerH} y2={PAD.top + innerH} stroke="var(--border)" />
          {trend.map((point, index) => {
            const height = (point.scans / max) * innerH
            const x = PAD.left + index * step + (step - barW) / 2
            const date = new Date(point.bucket)
            const label = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
            return (
              <g key={point.bucket}>
                <rect
                  x={x}
                  y={PAD.top + innerH - height}
                  width={barW}
                  height={Math.max(height, point.scans > 0 ? 2 : 0)}
                  rx="2"
                  className="fill-[#2a78d6] dark:fill-[#3987e5]"
                >
                  <title>{`${label}: ${point.scans} scans (${point.uniques} unique)`}</title>
                </rect>
                {(trend.length <= 10 || index % Math.ceil(trend.length / 8) === 0) && (
                  <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">
                    {label}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      )}
    </section>
  )
}

export function TopLinksList({ top }: { top: NonNullable<RedirectDashboardResponse["top"]> }) {
  const max = Math.max(1, ...top.map((row) => row.scans))
  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold text-foreground">Top Scanned Links</h3>
      </div>
      {top.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No scans recorded yet.</p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {top.map((row) => (
            <li key={row.slug} className="relative overflow-hidden rounded-md" title={`${row.name}: ${row.scans} scans`}>
              <div
                className="absolute inset-y-0 left-0 rounded-md bg-[#2a78d6]/12 dark:bg-[#3987e5]/20"
                style={{ width: `${(row.scans / max) * 100}%` }}
              />
              <div className="relative flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm">
                <span className="min-w-0 truncate">
                  <span className="font-mono text-foreground">/{row.slug}</span>
                  {!row.active && <span className="ml-2 text-xs text-muted-foreground">(inactive)</span>}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{fmtNumber(row.scans)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function RecentScansList({
  scans,
  showSlug = true,
}: {
  scans: (RedirectScan & { slug?: string })[]
  showSlug?: boolean
}) {
  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <Globe2 className="h-4 w-4 text-primary" />
        <h3 className="font-display text-sm font-semibold text-foreground">Recent Scans</h3>
      </div>
      {scans.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No scans yet.</p>
      ) : (
        <ul className="mt-3 max-h-64 space-y-1.5 overflow-y-auto pr-1 text-xs">
          {scans.map((scan, index) => (
            <li key={`${scan.at}-${index}`} className="flex items-center gap-2">
              {showSlug && scan.slug && (
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-muted-foreground">/{scan.slug}</span>
              )}
              <span className="min-w-0 truncate text-foreground">
                {[scan.device, scan.browser, scan.os].filter(Boolean).join(" · ")}
                {scan.country ? ` · ${scan.country}` : ""}
              </span>
              <span className="ml-auto shrink-0 text-muted-foreground">
                {new Date(scan.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
