import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { resolveListingRequest, type ListingRouteProps } from "@/lib/listing-query"
import { NewsListing, newsMetadata } from "../listing"

export async function generateMetadata({ params }: Pick<ListingRouteProps, "params">): Promise<Metadata> {
  return newsMetadata(toLocale((await params).lang))
}

// /news with filters or a page number, rendered per request. The rewrite in
// next.config.mjs sends those URLs here; the browser keeps /news?….
export default async function FilteredNewsPage(props: ListingRouteProps) {
  const { lang, query } = await resolveListingRequest("news", props)
  return <NewsListing lang={lang} query={query} />
}
