export function KpiTileSimple({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground" title={label}>
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  )
}
