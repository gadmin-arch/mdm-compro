"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useReportWebVitals } from "next/web-vitals"
import {
  classifyClick,
  describeClient,
  hasAdminCookie,
  hasDoNotTrack,
  identity,
  isDuplicateView,
  type TrackerEvent,
} from "@/lib/analytics-client"

export type AnalyticsTrackerConfig = {
  ignoreAdmins: boolean
  respectDnt: boolean
  trackVitals: boolean
  trackEvents: boolean
}

const API_BASE =
  process.env.NEXT_PUBLIC_CMS_API_BASE_URL ?? "http://localhost:8080/api/v1/public"
const COLLECT_URL = `${API_BASE}/analytics/collect`

const FLUSH_INTERVAL_MS = 5000
const FLUSH_AT = 10
const MAX_ERRORS_PER_PAGE = 5

declare global {
  interface Window {
    mdmTrack?: (name: string, label?: string) => void
  }
}

// AnalyticsTracker is the whole client footprint of analytics: a queue that
// batches events and ships them with sendBeacon. It renders nothing, attaches
// passive listeners only, and never blocks navigation or paint.
export function AnalyticsTracker({ config }: { config: AnalyticsTrackerConfig }) {
  const pathname = usePathname()
  const queue = useRef<TrackerEvent[]>([])
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const disabled = useRef(false)
  const pageStart = useRef(Date.now())
  const maxScroll = useRef(0)
  const errorCount = useRef(0)
  const currentPath = useRef("")
  const landed = useRef(false)

  useReportWebVitals((metric) => {
    if (!config.trackVitals || disabled.current) return
    push({
      type: "vital",
      name: metric.name,
      path: currentPath.current || window.location.pathname,
      value: metric.value,
      ts: Date.now(),
    })
  })

  function flush(useBeacon = false) {
    if (flushTimer.current) {
      clearTimeout(flushTimer.current)
      flushTimer.current = null
    }
    if (queue.current.length === 0 || disabled.current) return
    const events = queue.current.splice(0, queue.current.length)
    const who = identity()
    const body = JSON.stringify({
      visitorId: who.visitorId,
      sessionId: who.sessionId,
      newVisitor: who.newVisitor,
      ...describeClient(),
      events,
    })
    // text/plain keeps this a "simple" request: no CORS preflight, and
    // sendBeacon delivers it even while the page is being torn down.
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" })
    if (useBeacon && "sendBeacon" in navigator && navigator.sendBeacon(COLLECT_URL, blob)) return
    void fetch(COLLECT_URL, { method: "POST", body: blob, keepalive: true }).catch(() => {})
  }

  function push(event: TrackerEvent) {
    if (disabled.current) return
    queue.current.push(event)
    if (queue.current.length >= FLUSH_AT) {
      flush()
      return
    }
    if (!flushTimer.current) {
      flushTimer.current = setTimeout(() => flush(), FLUSH_INTERVAL_MS)
    }
  }

  function leaveCurrentPage(useBeacon: boolean) {
    if (!currentPath.current) return
    const dwell = Date.now() - pageStart.current
    if (dwell < 150) return // navigation bounce artifacts
    push({
      type: "pageleave",
      path: currentPath.current,
      value: dwell,
      scrollPct: Math.round(maxScroll.current),
      ts: Date.now(),
    })
    flush(useBeacon)
  }

  // One-time listeners.
  useEffect(() => {
    disabled.current =
      (config.respectDnt && hasDoNotTrack()) || (config.ignoreAdmins && hasAdminCookie())
    if (disabled.current) return

    // Manual hook for feature code (contact form success, etc.).
    window.mdmTrack = (name: string, label?: string) => {
      if (!config.trackEvents) return
      push({
        type: "event",
        name: name.slice(0, 80),
        path: window.location.pathname,
        referrer: label?.slice(0, 120) ?? "",
        ts: Date.now(),
      })
    }

    const onScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) {
        maxScroll.current = 100
        return
      }
      const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100
      if (pct > maxScroll.current) maxScroll.current = Math.min(100, pct)
    }

    const onClick = (event: MouseEvent) => {
      if (!config.trackEvents) return
      const hit = classifyClick(event.target)
      if (!hit) return
      push({
        type: "event",
        name: hit.name,
        path: window.location.pathname,
        referrer: hit.label,
        ts: Date.now(),
      })
    }

    const onSubmit = (event: Event) => {
      if (!config.trackEvents) return
      const form = event.target as HTMLElement | null
      const name = form?.getAttribute?.("data-analytics-event")
      if (name) {
        push({ type: "event", name, path: window.location.pathname, ts: Date.now() })
      }
    }

    const onError = (event: ErrorEvent) => {
      if (errorCount.current >= MAX_ERRORS_PER_PAGE) return
      errorCount.current += 1
      push({
        type: "error",
        name: String(event.message ?? "error").slice(0, 80),
        path: window.location.pathname,
        ts: Date.now(),
      })
    }

    const onHide = () => {
      if (document.visibilityState === "hidden") leaveCurrentPage(true)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("click", onClick, { capture: true, passive: true })
    document.addEventListener("submit", onSubmit, true)
    window.addEventListener("error", onError)
    document.addEventListener("visibilitychange", onHide)
    window.addEventListener("pagehide", () => leaveCurrentPage(true))

    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("submit", onSubmit, true)
      window.removeEventListener("error", onError)
      document.removeEventListener("visibilitychange", onHide)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pageview on every route change (App Router soft navigation included).
  useEffect(() => {
    if (disabled.current || !pathname || pathname.startsWith("/admin")) return

    // Close out the previous page before opening the new one.
    if (currentPath.current && currentPath.current !== pathname) {
      leaveCurrentPage(false)
    }
    currentPath.current = pathname
    pageStart.current = Date.now()
    maxScroll.current = 0

    if (isDuplicateView(pathname)) return // fast refresh double-count guard

    push({
      type: "pageview",
      path: pathname,
      referrer: landed.current ? "" : document.referrer,
      ts: Date.now(),
    })

    // First page of the visit: flag QR-code arrivals for the campaign report.
    if (!landed.current) {
      landed.current = true
      const params = new URLSearchParams(window.location.search)
      if (params.get("utm_source") === "qr" || params.has("qr")) {
        push({ type: "event", name: "qr_redirect", path: pathname, ts: Date.now() })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}
