import { Search } from "lucide-react"
import { ActiveFilter, FilterCard, FilterField } from "@/components/admin/filter-card"
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select"
import { Input } from "@/components/ui/input"

const statusOptions = ["", "draft", "published", "scheduled", "archived"]

// Search + status filters for the content lists. The "Add" button is not here:
// it is a page-level action and lives in the AdminShell header.
export function ResourceToolbar({
  action,
  q,
  status,
}: {
  action: string
  q: string
  status: string
}) {
  const active: ActiveFilter[] = []
  // Each chip's clear link keeps the other filter intact.
  if (q) {
    active.push({
      label: "Search",
      value: q,
      clearHref: status ? `${action}?status=${encodeURIComponent(status)}` : action,
    })
  }
  if (status) {
    active.push({
      label: "Status",
      value: status,
      clearHref: q ? `${action}?q=${encodeURIComponent(q)}` : action,
    })
  }

  return (
    <FilterCard action={action} active={active} clearHref={action} applyLabel="Filter">
      <FilterField label="Search" htmlFor="q">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input className="pl-9" defaultValue={q} id="q" name="q" placeholder="Title or slug" />
        </div>
      </FilterField>
      <FilterField label="Status" htmlFor="status">
        <AutoSubmitSelect
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          defaultValue={status}
          id="status"
          name="status"
          options={statusOptions.map((option) => ({ value: option, label: option || "all" }))}
        />
      </FilterField>
    </FilterCard>
  )
}
