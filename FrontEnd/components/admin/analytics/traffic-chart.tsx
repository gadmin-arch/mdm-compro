"use client"

import { useMemo, useRef, useState } from "react"
import type { AnalyticsTimePoint } from "@/lib/admin-api"
import { fmtBucket, fmtNumber } from "@/components/admin/analytics/format"
import { cn } from "@/lib/utils"

// Series color: slot 1 (blue) of the validated reference palette — one metric
// is shown at a time, so the chart never needs more than one hue. Light and
// dark steps are set via the --series custom property on the <svg>.
const METRICS = [
  { key: "views", label: "Page Views" },
  { key: "sessions", label: "Sessions" },
  { key: "visitors", label: "Visitors" },
] as const

type MetricKey = (typeof METRICS)[number]["key"]

const W = 800
const H = 260
const PAD = { top: 14, right: 14, bottom: 26, left: 44 }

function niceCeil(value: number): number {
  if (value <= 5) return 5
  const magnitude = 10 ** Math.floor(Math.log10(value))
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= step * magnitude) return step * magnitude
  }
  return 10 * magnitude
}

export function TrafficChart({ points, interval }: { points: AnalyticsTimePoint[]; interval: string }) {
  const [metric, setMetric] = useState<MetricKey>("views")
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const { path, area, coords, yMax, gridLines } = useMemo(() => {
    const values = points.map((p) => p[metric])
    const yMax = niceCeil(Math.max(1, ...values))
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom
    const stepX = points.length > 1 ? innerW / (points.length - 1) : 0
    const coords = points.map((p, i) => ({
      x: PAD.left + (points.length > 1 ? i * stepX : innerW / 2),
      y: PAD.top + innerH - (p[metric] / yMax) * innerH,
      value: p[metric],
      bucket: p.bucket,
    }))
    const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ")
    const baseline = PAD.top + innerH
    const area =
      coords.length > 0
        ? `${path} L${coords[coords.length - 1].x.toFixed(1)},${baseline} L${coords[0].x.toFixed(1)},${baseline} Z`
        : ""
    const gridLines = [0.25, 0.5, 0.75, 1].map((f) => ({
      y: PAD.top + innerH - f * innerH,
      label: fmtNumber(yMax * f),
    }))
    return { path, area, coords, yMax, gridLines }
  }, [points, metric])

  const xLabels = useMemo(() => {
    if (points.length === 0) return []
    const maxTicks = 6
    const every = Math.max(1, Math.ceil(points.length / maxTicks))
    return coords
      .map((c, i) => ({ x: c.x, label: fmtBucket(c.bucket, interval), index: i }))
      .filter((t) => t.index % every === 0)
  }, [coords, points.length, interval])

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    if (!svg || coords.length === 0) return
    const rect = svg.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * W
    let nearest = 0
    let best = Infinity
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - x)
      if (d < best) {
        best = d
        nearest = i
      }
    })
    setHover(nearest)
  }

  const hovered = hover != null ? coords[hover] : null
  const last = coords[coords.length - 1]

  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground">Traffic</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Grouped {interval === "hour" ? "hourly" : `by ${interval}`} · UTC</p>
        </div>
        <div className="flex rounded-md border border-border p-0.5" role="tablist" aria-label="Chart metric">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={metric === m.key}
              onClick={() => setMetric(m.key)}
              className={cn(
                "rounded px-2.5 py-1 text-xs font-medium transition-colors",
                metric === m.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {points.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
          No traffic recorded in this range yet.
        </p>
      ) : (
        <div className="relative mt-4">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full [--series:#2a78d6] dark:[--series:#3987e5]"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            role="img"
            aria-label={`${METRICS.find((m) => m.key === metric)?.label} over time, peaking at ${fmtNumber(yMax)}`}
          >
            <defs>
              <linearGradient id="traffic-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--series)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--series)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridLines.map((line) => (
              <g key={line.y}>
                <line x1={PAD.left} x2={W - PAD.right} y1={line.y} y2={line.y} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
                <text x={PAD.left - 8} y={line.y + 3.5} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">
                  {line.label}
                </text>
              </g>
            ))}
            <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--border)" strokeWidth="1" />

            {xLabels.map((tick) => (
              <text key={tick.index} x={tick.x} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">
                {tick.label}
              </text>
            ))}

            {area && <path d={area} fill="url(#traffic-fill)" />}
            {path && <path d={path} fill="none" stroke="var(--series)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}

            {/* Selective direct label: the latest point only. */}
            {last && hover == null && (
              <g>
                <circle cx={last.x} cy={last.y} r="3.5" fill="var(--series)" stroke="var(--background)" strokeWidth="2" />
                <text x={Math.min(last.x, W - PAD.right - 4)} y={Math.max(last.y - 8, 11)} textAnchor="end" fontSize="10.5" fontWeight="600" fill="var(--foreground)">
                  {fmtNumber(last.value)}
                </text>
              </g>
            )}

            {hovered && (
              <g>
                <line x1={hovered.x} x2={hovered.x} y1={PAD.top} y2={H - PAD.bottom} stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={hovered.x} cy={hovered.y} r="4" fill="var(--series)" stroke="var(--background)" strokeWidth="2" />
              </g>
            )}
          </svg>

          {hovered && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs shadow-md"
              style={{
                left: `${(hovered.x / W) * 100}%`,
                top: `${Math.max(0, (hovered.y / H) * 100 - 18)}%`,
              }}
            >
              <p className="font-semibold text-foreground">{fmtNumber(hovered.value)} {METRICS.find((m) => m.key === metric)?.label.toLowerCase()}</p>
              <p className="text-muted-foreground">{fmtBucket(hovered.bucket, interval)}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
