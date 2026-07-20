"use client"

import { useMemo, useState } from "react"

export type SortDirection = "asc" | "desc"

// Client-side single-column sort for admin tables. Rows are one server page,
// so sorting in memory is cheap; `value` maps a row+field to its sort key and
// must be referentially stable (define it at module scope).
export function useClientSort<Field extends string, Row>(
  rows: Row[],
  value: (row: Row, field: Field) => string,
) {
  const [field, setField] = useState<Field | null>(null)
  const [direction, setDirection] = useState<SortDirection>("asc")

  const toggle = (next: Field) => {
    if (field === next) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setField(next)
      setDirection("asc")
    }
  }

  const sorted = useMemo(() => {
    if (!field) return rows
    return [...rows].sort((a, b) => {
      const aVal = value(a, field).toLowerCase()
      const bVal = value(b, field).toLowerCase()
      if (aVal < bVal) return direction === "asc" ? -1 : 1
      if (aVal > bVal) return direction === "asc" ? 1 : -1
      return 0
    })
  }, [rows, field, direction, value])

  return { field, direction, toggle, sorted }
}
