"use client"

import { useEffect, useState } from "react"
import type { AnalyticsRealtimeResponse } from "@/lib/admin-api"
import { fmtNumber } from "@/components/admin/analytics/format"

const POLL_MS = 10_000

// Realtime widget: served from the API's in-memory state (last 5 minutes),
// polled through the authenticated Next proxy.
export function RealtimeCard({ initial }: { initial: AnalyticsRealtimeResponse }) {
  const [data, setData] = useState(initial)

  useEffect(() => {
    let stopped = false
    const timer = setInterval(async () => {
      if (document.visibilityState === "hidden") return // don't poll a hidden tab
      try {
        const response = await fetch("/api/admin/analytics/realtime", { cache: "no-store" })
        if (!response.ok) return
        const next = (await response.json()) as AnalyticsRealtimeResponse
        if (!stopped) setData(next)
      } catch {
        // transient network failure — keep the last snapshot
      }
    }, POLL_MS)
    return () => {
      stopped = true
      clearInterval(timer)
    }
  }, [])

  const pages = data.pages ?? []
  const events = data.events ?? []

  return (
    <section className="rounded-lg border border-border bg-background p-5 print:hidden">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Realtime</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live
        </span>
      </div>

      <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground">
        {fmtNumber(data.activeVisitors)}
      </p>
      <p className="text-xs text-muted-foreground">active visitors in the last 5 minutes</p>

      <div className="mt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current pages</h3>
        {pages.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nobody is browsing right now.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {pages.map((page) => (
              <li key={page.path} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-foreground">{page.path}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{page.sessions}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live events</h3>
        {events.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No events yet.</p>
        ) : (
          <ul className="mt-2 max-h-48 space-y-1.5 overflow-y-auto text-xs">
            {events.map((event, index) => (
              <li key={`${event.at}-${index}`} className="flex items-center gap-2">
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-medium text-muted-foreground">
                  {event.type === "event" ? event.name || "event" : "view"}
                </span>
                <span className="min-w-0 truncate text-foreground">{event.path}</span>
                <span className="ml-auto shrink-0 text-muted-foreground">
                  {new Date(event.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
