"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type ActiveFilter = {
  label: string
  value: string
  // Link that drops just this filter, keeping the others.
  clearHref: string
}

// The standard filter panel: a grid of controls, the filters currently applied,
// and a Clear/Apply footer. Stays a GET form so filter state lives in the URL
// (shareable, server-rendered, survives reload) — the dot on Apply is the only
// client state, marking edits that have not been submitted yet.
export function FilterCard({
  action,
  children,
  active = [],
  clearHref,
  applyLabel = "Apply",
}: {
  action: string
  children: ReactNode
  active?: ActiveFilter[]
  clearHref: string
  applyLabel?: string
}) {
  const [dirty, setDirty] = useState(false)

  return (
    <form
      method="GET"
      action={action}
      onChange={() => setDirty(true)}
      onInput={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
      className="mt-6 rounded-xl border border-border bg-background p-4 print:hidden"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>

      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Filtered by:</span>
          {active.map((item) => (
            <Badge key={`${item.label}-${item.value}`} variant="secondary" className="gap-1 pr-1">
              <span className="text-muted-foreground">{item.label}:</span>
              {item.value}
              <Link
                href={item.clearHref}
                aria-label={`Remove ${item.label} filter`}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </Link>
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex justify-end gap-2 border-t border-border pt-3">
        <Button asChild size="sm" variant="outline" className="min-h-11 sm:min-h-9">
          <Link href={clearHref}>Clear</Link>
        </Button>
        <Button type="submit" size="sm" className="relative min-h-11 sm:min-h-9">
          <Filter className="h-4 w-4" aria-hidden="true" />
          {applyLabel}
          {dirty && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-orange-500"
            />
          )}
        </Button>
      </div>
    </form>
  )
}

// Labelled control slot used inside the filter grid.
export function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-medium text-muted-foreground" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  )
}
