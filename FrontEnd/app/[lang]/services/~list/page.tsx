import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { resolveListingRequest, type ListingRouteProps } from "@/lib/listing-query"
import { ServicesListing, servicesMetadata } from "../listing"

export async function generateMetadata({ params }: Pick<ListingRouteProps, "params">): Promise<Metadata> {
  return servicesMetadata(toLocale((await params).lang))
}

// /services with filters or a page number, rendered per request. The rewrite in
// next.config.mjs sends those URLs here; the browser keeps /services?….
export default async function FilteredServicesPage(props: ListingRouteProps) {
  const { lang, query } = await resolveListingRequest("services", props)
  return <ServicesListing lang={lang} query={query} />
}
