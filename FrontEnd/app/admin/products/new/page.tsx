import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { FlashToast } from "@/components/admin/flash-toast"
import { ContentItemForm } from "@/components/admin/resource-forms"
import { Button } from "@/components/ui/button"
import { adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import { createContentItemAction } from "../../content-actions"

export default async function AdminNewProductPage() {
  const parents = await adminFetch<AdminContentResponse>("/products?perPage=100", {}, "/admin/products/new").then(
    (response) => response.data,
  )
  return (
    <AdminShell
      active="products"
      breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "New Product" }]}
      eyebrow="Catalog"
      title="New Product"
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>
        </Button>
      }
    >
      <FlashToast resource="product" />
      <ContentItemForm action={createContentItemAction} mode="create" parentOptions={parents} resource="products" />
    </AdminShell>
  )
}
