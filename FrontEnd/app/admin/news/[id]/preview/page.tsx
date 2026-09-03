import { notFound } from "next/navigation"
import { NewsArticleView } from "@/components/cms/news-article"
import { PreviewBar } from "@/components/admin/preview-bar"
import { SiteChrome } from "@/components/site-chrome"
import { AdminApiError, adminFetch } from "@/lib/admin-api"
import type { NewsItem } from "@/lib/cms"

// Renders an unpublished news post exactly as the public article page would.
// It sits under /admin on purpose: proxy.ts's cookie gate, adminFetch's
// fail-closed session check, and the no-store + noindex headers in
// next.config.mjs all key off that prefix, so no new public surface exists.
// Never fetch this through cmsFetch — that would put draft content in the
// shared "cms" data cache.
export const dynamic = "force-dynamic"

export const metadata = {
  robots: { index: false, follow: false },
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function NewsPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // news.id is a uuid column: a non-uuid (e.g. /admin/news/new/preview) would
  // reach Postgres, raise 22P02, and surface as a 500 instead of a 404.
  if (!UUID.test(id)) notFound()

  let item: NewsItem
  try {
    item = await adminFetch<NewsItem>(`/news/${id}`, {}, `/admin/news/${id}/preview`)
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) notFound()
    throw error
  }

  return (
    <div className="site-preview">
      <PreviewBar status={item.status} slug={item.slug} backHref={`/admin/news/${id}`} />
      <SiteChrome>
        <NewsArticleView news={item} unoptimizedImage />
      </SiteChrome>
    </div>
  )
}
