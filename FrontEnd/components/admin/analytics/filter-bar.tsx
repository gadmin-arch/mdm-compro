"use client"

import { useRef } from "react"
import { ActiveFilter, FilterCard, FilterField } from "@/components/admin/filter-card"
import { Input } from "@/components/ui/input"

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

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

  function applyPreset(value: string) {
    if (!value) return
    const now = new Date()
    const today = isoDay(now)
    let from = today
    if (value === "7d") from = isoDay(new Date(now.getTime() - 6 * 86400_000))
    if (value === "30d") from = isoDay(new Date(now.getTime() - 29 * 86400_000))
    if (value === "90d") from = isoDay(new Date(now.getTime() - 89 * 86400_000))
    if (value === "year") from = `${now.getUTCFullYear()}-01-01`
    if (fromRef.current) fromRef.current.value = from
    if (toRef.current) toRef.current.value = today
    fromRef.current?.form?.requestSubmit()
  }

  // Date range is always set, so only the optional dimensions become chips.
  const active: ActiveFilter[] = []
  const dropParam = (name: string) => {
    const params = new URLSearchParams({ from: props.from, to: props.to, interval: props.interval })
    for (const [key, value] of Object.entries({
      device: props.device,
      source: props.source,
      country: props.country,
      page: props.page,
    })) {
      if (value && key !== name) params.set(key, value)
    }
    return `/admin/analytics?${params}`
  }
  if (props.device) active.push({ label: "Device", value: props.device, clearHref: dropParam("device") })
  if (props.source) active.push({ label: "Source", value: props.source, clearHref: dropParam("source") })
  if (props.country) active.push({ label: "Country", value: props.country, clearHref: dropParam("country") })
  if (props.page) active.push({ label: "Page", value: props.page, clearHref: dropParam("page") })

  return (
    <FilterCard action="/admin/analytics" active={active} clearHref="/admin/analytics">
      <FilterField label="Preset">
        <select className={selectClass} defaultValue="" onChange={(event) => applyPreset(event.target.value)}>
          <option value="">Custom</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="year">This year</option>
        </select>
      </FilterField>
      <FilterField label="From (UTC)" htmlFor="from">
        <Input ref={fromRef} className="h-9" id="from" type="date" name="from" defaultValue={props.from} />
      </FilterField>
      <FilterField label="To" htmlFor="to">
        <Input ref={toRef} className="h-9" id="to" type="date" name="to" defaultValue={props.to} />
      </FilterField>
      <FilterField label="Group by" htmlFor="interval">
        <select className={selectClass} id="interval" name="interval" defaultValue={props.interval}>
          <option value="hour">Hourly</option>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </FilterField>
      <FilterField label="Device" htmlFor="device">
        <select className={selectClass} id="device" name="device" defaultValue={props.device}>
          <option value="">All devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
      </FilterField>
      <FilterField label="Source" htmlFor="source">
        <select className={selectClass} id="source" name="source" defaultValue={props.source}>
          <option value="">All sources</option>
          <option value="direct">Direct</option>
          <option value="organic">Organic</option>
          <option value="referral">Referral</option>
          <option value="social">Social</option>
        </select>
      </FilterField>
      <FilterField label="Country" htmlFor="country">
        <select className={selectClass} id="country" name="country" defaultValue={props.country}>
          <option value="">All countries</option>
          {props.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </FilterField>
      <FilterField label="Page" htmlFor="page">
        <select className={selectClass} id="page" name="page" defaultValue={props.page}>
          <option value="">All pages</option>
          {props.paths.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </select>
      </FilterField>
    </FilterCard>
  )
}
