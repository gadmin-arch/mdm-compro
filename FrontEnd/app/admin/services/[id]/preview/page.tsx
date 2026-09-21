import { notFound } from "next/navigation"
import { ServiceDetailView } from "@/components/cms/service-detail"
import { PreviewBar } from "@/components/admin/preview-bar"
import { SiteChrome } from "@/components/site-chrome"
import { AdminApiError, adminFetch, type AdminContentResponse } from "@/lib/admin-api"
import type { ContentNode } from "@/lib/cms"

// Renders an unpublished service exactly as the public service detail page would.
// Sits under /admin to inherit proxy.ts cookie gate, adminFetch fail-closed session check,
// and no-store + noindex security headers.
export const dynamic = "force-dynamic"

export const metadata = {
  robots: { index: false, follow: false },
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function ServicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  let item: ContentNode
  let subServices: ContentNode[] = []
  try {
    const [itemResponse, parentResponse] = await Promise.all([
      adminFetch<ContentNode>(`/services/${id}`, {}, `/admin/services/${id}/preview`),
      adminFetch<AdminContentResponse>("/services?perPage=100", {}, `/admin/services/${id}/preview`).catch(() => null),
    ])
    item = itemResponse
    if (parentResponse?.data) {
      subServices = parentResponse.data.filter((s) => s.parentId === item.id)
    }
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound()
    throw error
  }

  return (
    <div className="site-preview">
      <PreviewBar
        status={item.status}
        publicHref={`/services/${item.fullPath || item.slug}`}
        backHref={`/admin/services/${id}`}
      />
      <SiteChrome>
        <ServiceDetailView service={item} subServices={subServices} unoptimizedImage />
      </SiteChrome>
    </div>
  )
}
