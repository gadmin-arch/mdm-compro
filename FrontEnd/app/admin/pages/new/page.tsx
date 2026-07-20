import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"
import { AdminShell } from "@/components/admin-shell"

// Splits the section-builder/dnd-kit editor bundle out of the shared chunk.
const PageEditor = dynamic(() =>
  import("@/components/admin/page-editor").then((mod) => mod.PageEditor),
)
import { Button } from "@/components/ui/button"
import { resolveAllSectionData } from "@/lib/cms"
import { createPageAction } from "../actions"

export default async function AdminNewPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const query = await searchParams
  const previewData = await resolveAllSectionData()
  const message =
    query.error === "invalid_json"
      ? "Content must be valid JSON."
      : query.error === "conflict"
        ? "A page with this slug already exists."
        : query.error
          ? "Page could not be created."
          : ""

  return (
    <AdminShell
      active="pages"
      breadcrumbs={[{ label: "Pages", href: "/admin/pages" }, { label: "New Page" }]}
      eyebrow="CMS Pages"
      title="New Page"
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/pages">
            <ArrowLeft className="h-4 w-4" />
            Pages
          </Link>
        </Button>
      }
    >
      {message && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          {message}
        </p>
      )}

      <PageEditor action={createPageAction} mode="create" previewData={previewData} />
    </AdminShell>
  )
}
