import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { FlashToast } from "@/components/admin/flash-toast"
import { CareerForm } from "@/components/admin/resource-forms"
import { Button } from "@/components/ui/button"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import type { Career } from "@/lib/cms"
import { updateCareerAction } from "../../content-actions"

export default async function AdminEditCareerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let item: Career | null = null
  let apiError = false
  try {
    item = await adminFetch<Career>(`/careers/${id}`, {}, `/admin/careers/${id}`)
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  return (
    <AdminShell
      active="careers"
      breadcrumbs={[{ label: "Careers", href: "/admin/careers" }, { label: "Edit" }]}
      eyebrow="Hiring"
      title={item?.title ?? "Edit Career"}
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/careers">
            <ArrowLeft className="h-4 w-4" />
            Careers
          </Link>
        </Button>
      }
    >
      <FlashToast resource="career" />
      {apiError || !item ? (
        <Message destructive text="Career could not be loaded from the admin API." />
      ) : (
        <CareerForm action={updateCareerAction} item={item} mode="edit" />
      )}
    </AdminShell>
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
