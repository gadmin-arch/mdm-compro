import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { resolveListingRequest, type ListingRouteProps } from "@/lib/listing-query"
import { CareerListing, careerMetadata } from "../listing"

export async function generateMetadata({ params }: Pick<ListingRouteProps, "params">): Promise<Metadata> {
  return careerMetadata(toLocale((await params).lang))
}

// /career with filters or a page number, rendered per request. The rewrite in
// next.config.mjs sends those URLs here; the browser keeps /career?….
export default async function FilteredCareerPage(props: ListingRouteProps) {
  const { lang, query } = await resolveListingRequest("career", props)
  return <CareerListing lang={lang} query={query} />
}
