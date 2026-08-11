import { Search } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { ContactsTable } from "@/components/admin/contacts-table"
import { ActiveFilter, FilterCard, FilterField } from "@/components/admin/filter-card"
import { AutoSubmitSelect } from "@/components/admin/auto-submit-select"
import { Input } from "@/components/ui/input"
import { AdminApiError, adminFetch, type AdminContactsResponse } from "@/lib/admin-api"
import { contactStatusLabels, contactStatuses } from "@/lib/contacts"

const BASE = "/admin/contacts"

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const status = query.status?.trim() ?? ""
  const pageNum = Math.max(1, Number(query.page) || 1)

  const params = new URLSearchParams({ perPage: "20", page: String(pageNum) })
  if (q) params.set("q", q)
  if (status) params.set("status", status)

  let response: AdminContactsResponse | null = null
  let apiError = false
  try {
    response = await adminFetch<AdminContactsResponse>(`/contacts?${params}`, {}, BASE)
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  const active: ActiveFilter[] = []
  if (q) {
    active.push({
      label: "Search",
      value: q,
      clearHref: status ? `${BASE}?status=${encodeURIComponent(status)}` : BASE,
    })
  }
  if (status) {
    active.push({
      label: "Status",
      value: contactStatusLabels[status] ?? status,
      clearHref: q ? `${BASE}?q=${encodeURIComponent(q)}` : BASE,
    })
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Contact Inquiries"
      />

      {apiError && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Inquiries could not be loaded from the admin API.
        </p>
      )}

      <FilterCard action={BASE} active={active} clearHref={BASE} applyLabel="Filter">
        <FilterField label="Search" htmlFor="q">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              className="pl-9"
              defaultValue={q}
              id="q"
              name="q"
              placeholder="Name, email, subject"
            />
          </div>
        </FilterField>
        <FilterField label="Status" htmlFor="status">
          <AutoSubmitSelect
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            defaultValue={status}
            id="status"
            name="status"
            options={[
              { value: "", label: "all" },
              ...contactStatuses.map((value) => ({ value, label: contactStatusLabels[value] })),
            ]}
          />
        </FilterField>
      </FilterCard>

      <ContactsTable contacts={response?.data ?? []} />

      {response && (
        <AdminPagination
          basePath={BASE}
          page={response.pagination.page}
          totalPages={response.pagination.totalPages}
          total={response.pagination.total}
          query={{ q, status }}
        />
      )}
    </>
  )
}
