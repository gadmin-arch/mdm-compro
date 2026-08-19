import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { FlashToast } from "@/components/admin/flash-toast"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { ResourceToolbar } from "@/components/admin/resource-toolbar"
import { AdminResourceTable } from "@/components/admin/resource-table"
import { AdminApiError, adminFetch, type AdminCareersResponse } from "@/lib/admin-api"
import { deleteCareerAction } from "../content-actions"
import { isCareerClosed } from "@/lib/cms"

export default async function AdminCareersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; deleted?: string; error?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const status = query.status?.trim() ?? ""
  const pageNum = Math.max(1, Number(query.page) || 1)
  const params = new URLSearchParams({ perPage: "20", page: String(pageNum) })
  if (q) params.set("q", q)
  if (status) params.set("status", status)

  let response: AdminCareersResponse | null = null
  let apiError = false
  try {
    response = await adminFetch<AdminCareersResponse>(`/careers?${params}`, {}, "/admin/careers")
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  return (
    <>
      <AdminPageHeader
      eyebrow="Hiring"
      title="Careers"
      actions={
        <Button asChild>
          <Link href="/admin/careers/new">
            <Plus className="h-4 w-4" />
            Add Career
          </Link>
        </Button>
      }
      />
      <FlashToast resource="career" />
      {apiError && <Message destructive text="Careers could not be loaded from the admin API." />}
      <ResourceToolbar action="/admin/careers" q={q} status={status} />
      <AdminResourceTable
        basePath="/admin/careers"
        deleteAction={deleteCareerAction}
        empty="No careers found."
        publicBasePath="/career"
        rows={(response?.data ?? []).map((item) => {
          const isExpired = isCareerClosed(item)
          const deadlineText = item.deadline
            ? `Deadline: ${new Date(item.deadline).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta" })}`
            : null
          return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            status: isExpired && item.status === "published" ? "closed (expired)" : item.status,
            version: item.version,
            meta: [item.department, item.location, deadlineText].filter(Boolean).join(" · "),
          }
        })}
      />
      {response && (
        <AdminPagination
          basePath="/admin/careers"
          page={response.pagination.page}
          totalPages={response.pagination.totalPages}
          total={response.pagination.total}
          query={{ q, status }}
        />
      )}
    </>
  )
}

function Message({ text, destructive = false }: { text: string; destructive?: boolean }) {
  if (!text) return null
  return (
    <p className={`mt-6 rounded-md border px-3 py-2 text-sm ${destructive ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-border bg-background text-foreground"}`}>
      {text}
    </p>
  )
}
