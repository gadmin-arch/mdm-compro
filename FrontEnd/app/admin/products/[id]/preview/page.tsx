import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/cms/product-detail"
import { PreviewBar } from "@/components/admin/preview-bar"
import { SiteChrome } from "@/components/site-chrome"
import { AdminApiError, adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import type { ContentNode } from "@/lib/cms"

// Renders an unpublished product exactly as the public product detail page would.
// Sits under /admin to inherit proxy.ts cookie gate, adminFetch fail-closed session check,
// and no-store + noindex security headers.
export const dynamic = "force-dynamic"

export const metadata = {
  robots: { index: false, follow: false },
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  let item: ContentNode
  let subProducts: ContentNode[] = []
  try {
    const [itemResponse, parentResponse] = await Promise.all([
      adminFetch<ContentNode>(`/products/${id}`, {}, `/admin/products/${id}/preview`),
      adminFetch<AdminContentResponse>("/products?perPage=100", {}, `/admin/products/${id}/preview`).catch(() => null),
    ])
    item = itemResponse
    if (parentResponse?.data) {
      subProducts = parentResponse.data.filter((p) => p.parentId === item.id)
    }
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound()
    throw error
  }

  return (
    <div className="site-preview">
      <PreviewBar
        status={item.status}
        publicHref={`/products/${item.fullPath || item.slug}`}
        backHref={`/admin/products/${id}`}
      />
      <SiteChrome>
        <ProductDetailView product={item} subProducts={subProducts} unoptimizedImage />
      </SiteChrome>
    </div>
  )
}
