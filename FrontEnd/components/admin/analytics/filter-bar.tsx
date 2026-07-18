"use client"

import { useRef } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const selectClass =
  "h-9 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

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

// One row of GET-form filters; submitting navigates with searchParams so the
// whole dashboard re-renders server-side (and stays shareable as a URL).
export function AnalyticsFilterBar(props: FilterBarProps) {
  const formRef = useRef<HTMLFormElement>(null)
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
    formRef.current?.requestSubmit()
  }

  return (
    <form
      ref={formRef}
      method="GET"
      action="/admin/analytics"
      className="mt-6 flex flex-wrap items-end gap-2 rounded-lg border border-border bg-background p-3 print:hidden"
    >
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Preset
        <select className={selectClass} defaultValue="" onChange={(event) => applyPreset(event.target.value)}>
          <option value="">Custom</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="year">This year</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        From (UTC)
        <Input ref={fromRef} className="h-9 w-36" type="date" name="from" defaultValue={props.from} />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        To
        <Input ref={toRef} className="h-9 w-36" type="date" name="to" defaultValue={props.to} />
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Group by
        <select className={selectClass} name="interval" defaultValue={props.interval}>
          <option value="hour">Hourly</option>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Device
        <select className={selectClass} name="device" defaultValue={props.device}>
          <option value="">All devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Source
        <select className={selectClass} name="source" defaultValue={props.source}>
          <option value="">All sources</option>
          <option value="direct">Direct</option>
          <option value="organic">Organic</option>
          <option value="referral">Referral</option>
          <option value="social">Social</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Country
        <select className={selectClass} name="country" defaultValue={props.country}>
          <option value="">All countries</option>
          {props.countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Page
        <select className={`${selectClass} max-w-52`} name="page" defaultValue={props.page}>
          <option value="">All pages</option>
          {props.paths.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" size="sm" className="h-9">
        <Filter className="h-4 w-4" />
        Apply
      </Button>
    </form>
  )
}
