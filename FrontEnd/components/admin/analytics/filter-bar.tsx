"use client"

import { useRef } from "react"
import { ChevronDown } from "lucide-react"
import { ActiveFilter, FilterCard, FilterField } from "@/components/admin/filter-card"
import { Input } from "@/components/ui/input"

const selectClass =
  "h-9 w-full appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 px-3 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"

type FilterBarProps = {
  from: string
  to: string
  interval: string
  device: string
  source: string
  country: string
  page: string
  paths: string[]
  countries: string[]
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// GET-form filters; submitting navigates with searchParams so the whole
// dashboard re-renders server-side (and stays shareable as a URL).
export function AnalyticsFilterBar(props: FilterBarProps) {
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  function applyPreset(preset: string) {
    const now = new Date()
    let from = ""
    const to = isoDay(now)
    if (preset === "today") {
      from = to
    } else if (preset === "7d") {
      from = isoDay(new Date(now.getTime() - 7 * 86400000))
    } else if (preset === "30d") {
      from = isoDay(new Date(now.getTime() - 30 * 86400000))
    } else if (preset === "90d") {
      from = isoDay(new Date(now.getTime() - 90 * 86400000))
    } else if (preset === "year") {
      from = `${now.getUTCFullYear()}-01-01`
    }
    if (fromRef.current) fromRef.current.value = from
    if (toRef.current) toRef.current.value = to
    fromRef.current?.form?.requestSubmit()
  }

  function dropParam(name: string) {
    const params = new URLSearchParams()
    if (props.from && name !== "from") params.set("from", props.from)
    if (props.to && name !== "to") params.set("to", props.to)
    if (props.interval && name !== "interval") params.set("interval", props.interval)
    if (props.device && name !== "device") params.set("device", props.device)
    if (props.source && name !== "source") params.set("source", props.source)
    if (props.country && name !== "country") params.set("country", props.country)
    if (props.page && name !== "page") params.set("page", props.page)
    const qs = params.toString()
    return qs ? `/admin/analytics?${qs}` : "/admin/analytics"
  }

  const active: ActiveFilter[] = []
  if (props.from || props.to) {
    active.push({
      label: "Range",
      value: `${props.from || "…"} → ${props.to || "…"}`,
      clearHref: dropParam("from"),
    })
  }
  if (props.device) active.push({ label: "Device", value: props.device, clearHref: dropParam("device") })
  if (props.source) active.push({ label: "Source", value: props.source, clearHref: dropParam("source") })
  if (props.country) active.push({ label: "Country", value: props.country, clearHref: dropParam("country") })
  if (props.page) active.push({ label: "Page", value: props.page, clearHref: dropParam("page") })

  return (
    <FilterCard action="/admin/analytics" active={active} clearHref="/admin/analytics">
      <FilterField label="Preset">
        <div className="relative flex items-center">
          <select className={selectClass} defaultValue="" onChange={(event) => applyPreset(event.target.value)}>
            <option value="" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Custom</option>
            <option value="today" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Today</option>
            <option value="7d" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Last 7 days</option>
            <option value="30d" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Last 30 days</option>
            <option value="90d" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Last 90 days</option>
            <option value="year" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">This year</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>
      <FilterField label="From (UTC)" htmlFor="from">
        <Input ref={fromRef} className="h-9 text-xs bg-background" id="from" type="date" name="from" defaultValue={props.from} />
      </FilterField>
      <FilterField label="To" htmlFor="to">
        <Input ref={toRef} className="h-9 text-xs bg-background" id="to" type="date" name="to" defaultValue={props.to} />
      </FilterField>
      <FilterField label="Group by" htmlFor="interval">
        <div className="relative flex items-center">
          <select className={selectClass} id="interval" name="interval" defaultValue={props.interval}>
            <option value="hour" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Hourly</option>
            <option value="day" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Daily</option>
            <option value="week" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Weekly</option>
            <option value="month" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Monthly</option>
            <option value="year" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Yearly</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>
      <FilterField label="Device" htmlFor="device">
        <div className="relative flex items-center">
          <select className={selectClass} id="device" name="device" defaultValue={props.device}>
            <option value="" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">All devices</option>
            <option value="desktop" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Desktop</option>
            <option value="mobile" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Mobile</option>
            <option value="tablet" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Tablet</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>
      <FilterField label="Source" htmlFor="source">
        <div className="relative flex items-center">
          <select className={selectClass} id="source" name="source" defaultValue={props.source}>
            <option value="" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">All sources</option>
            <option value="direct" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Direct</option>
            <option value="organic" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Organic</option>
            <option value="referral" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Referral</option>
            <option value="social" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">Social</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>
      <FilterField label="Country" htmlFor="country">
        <div className="relative flex items-center">
          <select className={selectClass} id="country" name="country" defaultValue={props.country}>
            <option value="" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">All countries</option>
            {props.countries.map((country) => (
              <option key={country} value={country} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
                {country}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>
      <FilterField label="Page" htmlFor="page">
        <div className="relative flex items-center">
          <select className={selectClass} id="page" name="page" defaultValue={props.page}>
            <option value="" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">All pages</option>
            {props.paths.map((path) => (
              <option key={path} value={path} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
                {path}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>
    </FilterCard>
  )
}
