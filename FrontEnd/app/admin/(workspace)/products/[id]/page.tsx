import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { FlashToast } from "@/components/admin/flash-toast"
import { ContentItemForm } from "@/components/admin/resource-forms"
import { Button } from "@/components/ui/button"
import { AdminApiError, adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import type { ContentNode } from "@/lib/cms"
import { updateContentItemAction } from "../../content-actions"

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let item: ContentNode | null = null
  let parents: ContentNode[] = []
  let apiError = false
  try {
    const [itemResponse, parentResponse] = await Promise.all([
      adminFetch<ContentNode>(`/products/${id}`, {}, `/admin/products/${id}`),
      adminFetch<AdminContentResponse>("/products?perPage=100", {}, `/admin/products/${id}`),
    ])
    item = itemResponse
    parents = parentResponse.data
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  return (
    <>
      <AdminPageHeader
      breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]}
      eyebrow="Catalog"
      title={item?.title ?? "Edit Product"}
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            Products
          </Link>
        </Button>
      }
      />
      <FlashToast resource="product" />
      {apiError || !item ? (
        <Message destructive text="Product could not be loaded from the admin API." />
      ) : (
        <ContentItemForm action={updateContentItemAction} item={item} mode="edit" parentOptions={parents} resource="products" />
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
