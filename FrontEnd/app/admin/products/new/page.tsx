import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { ContentItemForm } from "@/components/admin/resource-forms"
import { resourceMessage } from "@/components/admin/resource-toolbar"
import { Button } from "@/components/ui/button"
import { adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import { createContentItemAction } from "../../content-actions"

export default async function AdminNewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const query = await searchParams
  const parents = await adminFetch<AdminContentResponse>("/products?perPage=100", {}, "/admin/products/new").then(
    (response) => response.data,
  )
  return (
    <AdminShell
      active="products"
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
      <Message text={resourceMessage(query)} />
      <ContentItemForm action={createContentItemAction} mode="create" parentOptions={parents} resource="products" />
    </AdminShell>
  )
}

function Message({ text }: { text: string }) {
  if (!text) return null
  return <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">{text}</p>
}
