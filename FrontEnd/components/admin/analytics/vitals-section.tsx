import { Activity, AlertTriangle, CheckCircle2, CircleAlert } from "lucide-react"
import type { AnalyticsSlowPageRow, AnalyticsVitalRow } from "@/lib/admin-api"
import { fmtMs, fmtNumber, fmtVital } from "@/components/admin/analytics/format"
import { cn } from "@/lib/utils"

const VITAL_LABELS: Record<string, string> = {
  LCP: "Largest Contentful Paint",
  INP: "Interaction to Next Paint",
  CLS: "Cumulative Layout Shift",
  FCP: "First Contentful Paint",
  TTFB: "Time to First Byte",
  load: "Full Page Load",
}

// Status is always icon + text, never color alone.
function RatingBadge({ rating }: { rating: string }) {
  if (!rating) return null
  const label = rating === "needs-improvement" ? "Needs work" : rating === "good" ? "Good" : "Poor"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
        rating === "good" && "bg-green-600/10 text-green-700 dark:text-green-400",
        rating === "needs-improvement" && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        rating === "poor" && "bg-red-600/10 text-red-700 dark:text-red-400",
      )}
    >
      {rating === "good" && <CheckCircle2 className="h-3 w-3" />}
      {rating === "needs-improvement" && <CircleAlert className="h-3 w-3" />}
      {rating === "poor" && <AlertTriangle className="h-3 w-3" />}
      {label}
    </span>
  )
}

export function VitalsSection({
  vitals,
  slowPages,
  api,
  clientErrors,
}: {
  vitals: AnalyticsVitalRow[]
  slowPages: AnalyticsSlowPageRow[]
  api: { requests: number; errors: number; avgMs: number }
  clientErrors: number
}) {
  const order = ["LCP", "INP", "CLS", "FCP", "TTFB", "load"]
  const sorted = [...vitals].sort((a, b) => order.indexOf(a.metric) - order.indexOf(b.metric))

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">Performance</h2>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No Web Vitals samples in this range yet.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {sorted.map((vital) => (
            <div key={vital.metric} className="rounded-md border border-border p-3">
              <p className="text-xs font-semibold text-muted-foreground" title={VITAL_LABELS[vital.metric] ?? vital.metric}>
                {vital.metric}
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-foreground">
                {fmtVital(vital.metric, vital.avg)}
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-2">
                <RatingBadge rating={vital.rating} />
                <span className="text-[11px] text-muted-foreground">{fmtNumber(vital.samples)} samples</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slowest pages (avg load)</h3>
          {slowPages.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Not enough load samples yet.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {slowPages.map((page) => (
                <li key={page.path} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-foreground">{page.path}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{fmtMs(page.avgMs)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">API & Errors</h3>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">API requests</dt>
              <dd className="tabular-nums text-foreground">{fmtNumber(api.requests)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">API avg response</dt>
              <dd className="tabular-nums text-foreground">{fmtMs(api.avgMs)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">API 5xx errors</dt>
              <dd className="tabular-nums text-foreground">{fmtNumber(api.errors)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Client JS errors</dt>
              <dd className="tabular-nums text-foreground">{fmtNumber(clientErrors)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
