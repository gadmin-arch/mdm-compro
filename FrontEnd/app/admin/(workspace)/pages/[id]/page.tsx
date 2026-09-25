import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import dynamic from "next/dynamic"

// Splits the section-builder/dnd-kit editor bundle out of the shared chunk.
const PageEditor = dynamic(() =>
  import("@/components/admin/page-editor").then((mod) => mod.PageEditor),
)
import { Button } from "@/components/ui/button"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import { resolveAllSectionData, type PageContent } from "@/lib/cms"
import { enrichPageWithBilingual } from "@/lib/page-bilingual"
import { filterBilingualText } from "@/lib/bilingual"
import { updatePageAction } from "../actions"

export default async function AdminEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string; saved?: string; error?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  let page: PageContent | null = null
  let apiError = false

  try {
    page = await adminFetch<PageContent>(`/pages/${id}`, {}, `/admin/pages/${id}`)
    if (page) {
      page = enrichPageWithBilingual(page, page.key)
    }
  } catch (error) {
    if (error instanceof AdminApiError) {
      apiError = true
    } else {
      throw error
    }
  }

  const previewData = await resolveAllSectionData()

  const message = query.created
    ? "Page created."
    : query.saved
      ? "Page saved."
      : query.error === "invalid_json"
        ? "Content must be valid JSON."
        : query.error === "conflict"
          ? "This page changed elsewhere. Reload before saving again."
          : query.error
            ? "Page could not be saved."
            : ""

  return (
    <>
      <AdminPageHeader
      breadcrumbs={[{ label: "Pages", href: "/admin/pages" }, { label: "Edit" }]}
      eyebrow="CMS Pages"
      title={page?.title ? (filterBilingualText(page.title, "id") || filterBilingualText(page.title, "en")) : "Page editor"}
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" />
            Pages
          </Link>
        </Button>
      }
      />
      {message && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          {message}
        </p>
      )}

      {apiError || !page ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Page could not be loaded from the admin API.
        </p>
      ) : (
        <PageEditor action={updatePageAction} mode="edit" page={page} previewData={previewData} />
      )}
    </>
  )
}
