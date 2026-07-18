import { ShieldCheck } from "lucide-react"
import type { AnalyticsAdminActivityResponse } from "@/lib/admin-api"
import { fmtNumber } from "@/components/admin/analytics/format"

export function AdminActivityCard({ activity }: { activity: AnalyticsAdminActivityResponse }) {
  const counters = [
    { label: "Logins", value: activity.logins },
    { label: "Failed Logins", value: activity.failedLogins },
    { label: "Content Created", value: activity.contentCreated },
    { label: "Content Updated", value: activity.contentUpdated },
    { label: "Content Published", value: activity.contentPublished },
  ]
  const audit = activity.recentAudit ?? []

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">Admin Activity</h2>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {counters.map((counter) => (
          <div key={counter.label} className="rounded-md border border-border p-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{counter.label}</dt>
            <dd className="mt-1 font-display text-xl font-semibold text-foreground">{fmtNumber(counter.value)}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Audit log</h3>
      {audit.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No audit entries in this range.</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-sm">
          {audit.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2">
              <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                {entry.action}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{entry.entityType}</span>
              <span className="min-w-0 truncate text-foreground">{entry.label || entry.entityId || "—"}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {entry.actorName ? `${entry.actorName} · ` : ""}
                {new Date(entry.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
