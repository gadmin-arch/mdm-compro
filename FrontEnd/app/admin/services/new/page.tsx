import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { ContentItemForm } from "@/components/admin/resource-forms"
import { resourceMessage } from "@/components/admin/resource-toolbar"
import { Button } from "@/components/ui/button"
import { adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import { createContentItemAction } from "../../content-actions"

export default async function AdminNewServicePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const query = await searchParams
  const parents = await adminFetch<AdminContentResponse>("/services?perPage=100", {}, "/admin/services/new").then(
    (response) => response.data,
  )
  return (
    <AdminShell
      active="services"
      eyebrow="Catalog"
      title="New Service"
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/services">
            <ArrowLeft className="h-4 w-4" />
            Services
          </Link>
        </Button>
      }
    >
      <Message text={resourceMessage(query)} />
      <ContentItemForm action={createContentItemAction} mode="create" parentOptions={parents} resource="services" />
    </AdminShell>
  )
}

function Message({ text }: { text: string }) {
  if (!text) return null
  return <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">{text}</p>
}
