import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { FlashToast } from "@/components/admin/flash-toast"
import { ContentItemForm } from "@/components/admin/resource-forms"
import { Button } from "@/components/ui/button"
import { adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import { createContentItemAction } from "../../content-actions"

export default async function AdminNewServicePage() {
  const parents = await adminFetch<AdminContentResponse>("/services?perPage=100", {}, "/admin/services/new").then(
    (response) => response.data,
  )
  return (
    <>
      <AdminPageHeader
      breadcrumbs={[{ label: "Services", href: "/admin/services" }, { label: "New Service" }]}
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
      />
      <FlashToast resource="service" />
      <ContentItemForm action={createContentItemAction} mode="create" parentOptions={parents} resource="services" />
    </>
  )
}
