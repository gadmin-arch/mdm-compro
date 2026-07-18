import { AdminShell } from "@/components/admin-shell"
import { AdminActivityCard } from "@/components/admin/analytics/admin-activity-card"
import { BarList, breakdownRows, entryExitRows, eventRows } from "@/components/admin/analytics/breakdown-list"
import { ExportMenu } from "@/components/admin/analytics/export-menu"
import { AnalyticsFilterBar } from "@/components/admin/analytics/filter-bar"
import { KpiCards } from "@/components/admin/analytics/kpi-cards"
import { PagesTable } from "@/components/admin/analytics/pages-table"
import { RealtimeCard } from "@/components/admin/analytics/realtime-card"
import { TrafficChart } from "@/components/admin/analytics/traffic-chart"
import { VitalsSection } from "@/components/admin/analytics/vitals-section"
import {
  AdminApiError,
  adminFetch,
  type AnalyticsAdminActivityResponse,
  type AnalyticsDashboardResponse,
  type AnalyticsFilterOptionsResponse,
  type AnalyticsRealtimeResponse,
} from "@/lib/admin-api"

type SearchParams = Promise<{
  from?: string
  to?: string
  interval?: string
  device?: string
  source?: string
  country?: string
  page?: string
}>

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10)
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const from = params.from || isoDaysAgo(29)
  const to = params.to || isoDaysAgo(0)
  const interval = params.interval || "day"
  const device = params.device || ""
  const source = params.source || ""
  const country = params.country || ""
  const page = params.page || ""

  const query = new URLSearchParams({ from, to, interval })
  if (device) query.set("device", device)
  if (source) query.set("source", source)
  if (country) query.set("country", country)
  if (page) query.set("page", page)
  const queryString = query.toString()

  let dashboard: AnalyticsDashboardResponse | null = null
  let realtime: AnalyticsRealtimeResponse = { activeVisitors: 0, pages: [], events: [] }
  let activity: AnalyticsAdminActivityResponse | null = null
  let options: AnalyticsFilterOptionsResponse = { paths: [], countries: [] }
  let apiError = false

  try {
    const [dash, live, admin, opts] = await Promise.all([
      adminFetch<AnalyticsDashboardResponse>(`/analytics/dashboard?${queryString}`, {}, "/admin/analytics"),
      adminFetch<AnalyticsRealtimeResponse>("/analytics/realtime", {}, "/admin/analytics"),
      adminFetch<AnalyticsAdminActivityResponse>(`/analytics/admin-activity?${queryString}`, {}, "/admin/analytics"),
      adminFetch<AnalyticsFilterOptionsResponse>("/analytics/options", {}, "/admin/analytics"),
    ])
    dashboard = dash
    realtime = live
    activity = admin
    options = opts
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  const hasDimensionFilter = Boolean(device || country || source)

  return (
    <AdminShell
      active="analytics"
      eyebrow="Insights"
      title="Analytics"
      actions={<ExportMenu query={queryString} />}
    >
      {apiError || !dashboard ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Analytics could not be loaded from the admin API.
        </p>
      ) : (
        <>
          <AnalyticsFilterBar
            from={from}
            to={to}
            interval={interval}
            device={device}
            source={source}
            country={country}
            page={page}
            paths={options.paths ?? []}
            countries={options.countries ?? []}
          />

          <KpiCards overview={dashboard.overview} previous={dashboard.previous} />

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <TrafficChart points={dashboard.timeSeries ?? []} interval={dashboard.interval} />
            <RealtimeCard initial={realtime} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <BarList title="Traffic Sources" rows={breakdownRows(dashboard.breakdowns.source)} />
            <BarList title="Devices" rows={breakdownRows(dashboard.breakdowns.device)} />
            <BarList title="Browsers" rows={breakdownRows(dashboard.breakdowns.browser)} />
            <BarList title="Operating Systems" rows={breakdownRows(dashboard.breakdowns.os)} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <BarList title="Countries" rows={breakdownRows(dashboard.breakdowns.country)} />
            <BarList title="Cities" rows={breakdownRows(dashboard.breakdowns.city)} empty="No city data (needs a geo-aware proxy)." />
            <BarList title="Languages" rows={breakdownRows(dashboard.breakdowns.language)} />
            <BarList title="Screen Resolutions" rows={breakdownRows(dashboard.breakdowns.screen)} />
          </div>

          {hasDimensionFilter && (
            <p className="mt-3 text-xs text-muted-foreground">
              Note: page-level metrics below reflect all traffic — device/country/source filters apply to
              visitor and session reports.
            </p>
          )}

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <PagesTable pages={dashboard.pages ?? []} />
            <div className="space-y-4">
              <BarList title="Top Landing Pages" rows={entryExitRows(dashboard.entryPages)} />
              <BarList title="Exit Pages" rows={entryExitRows(dashboard.exitPages)} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <BarList
              title="Tracked Events"
              rows={eventRows(dashboard.events)}
              unit="events"
              empty="No events yet. Clicks on CTAs, downloads, external links, form submits, and QR visits appear here."
            />
            <VitalsSection
              vitals={dashboard.vitals ?? []}
              slowPages={dashboard.slowPages ?? []}
              api={dashboard.api}
              clientErrors={dashboard.clientErrors}
            />
          </div>

          <div className="mt-4">
            {activity && <AdminActivityCard activity={activity} />}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            First-party analytics · anonymous IDs, no cookies for tracking, no PII · admin visits and bots are
            excluded · aggregates refresh every minute.
          </p>
        </>
      )}
    </AdminShell>
  )
}
