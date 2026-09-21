import { notFound } from "next/navigation"
import { CareerDetailView } from "@/components/cms/career-detail"
import { PreviewBar } from "@/components/admin/preview-bar"
import { SiteChrome } from "@/components/site-chrome"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import type { Career } from "@/lib/cms"

// Renders an unpublished career opening exactly as the public career detail page would.
// Sits under /admin to inherit proxy.ts cookie gate, adminFetch fail-closed session check,
// and no-store + noindex security headers.
export const dynamic = "force-dynamic"

export const metadata = {
  robots: { index: false, follow: false },
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function CareerPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  let item: Career
  try {
    item = await adminFetch<Career>(`/careers/${id}`, {}, `/admin/careers/${id}/preview`)
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound()
    throw error
  }

  return (
    <div className="site-preview">
      <PreviewBar
        status={item.status}
        slug={item.slug}
        basePath="career"
        backHref={`/admin/careers/${id}`}
      />
      <SiteChrome>
        <CareerDetailView career={item} />
      </SiteChrome>
    </div>
  )
}
