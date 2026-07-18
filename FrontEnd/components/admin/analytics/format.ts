// Shared display formatting for the analytics dashboard.

export function fmtNumber(value: number): string {
  if (!Number.isFinite(value)) return "0"
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 10_000) return `${Math.round(value / 1000)}k`
  if (Math.abs(value) >= 1_000) return `${(value / 1000).toFixed(1)}k`
  return `${Math.round(value)}`
}

export function fmtDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0s"
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  if (m >= 60) return `${Math.floor(m / 60)}h ${m % 60}m`
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function fmtMs(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0ms"
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
  return `${Math.round(ms)}ms`
}

export function fmtPct(value: number): string {
  if (!Number.isFinite(value)) return "0%"
  return `${value.toFixed(1)}%`
}

export function fmtVital(metric: string, value: number): string {
  if (metric === "CLS") return value.toFixed(3)
  return fmtMs(value)
}

export function fmtBucket(iso: string, interval: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  switch (interval) {
    case "hour":
      return date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
    case "month":
      return date.toLocaleString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" })
    case "year":
      return date.toLocaleString("en-GB", { year: "numeric", timeZone: "UTC" })
    default: // day, week
      return date.toLocaleString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
  }
}

// Trend delta vs the previous period: null when there is no baseline.
export function delta(current: number, previous: number): number | null {
  if (!Number.isFinite(previous) || previous === 0) return null
  return ((current - previous) / previous) * 100
}
