import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { resolveListingRequest, type ListingRouteProps } from "@/lib/listing-query"
import { ProductsListing, productsMetadata } from "../listing"

export async function generateMetadata({ params }: Pick<ListingRouteProps, "params">): Promise<Metadata> {
  return productsMetadata(toLocale((await params).lang))
}

// /products with filters or a page number, rendered per request. The rewrite in
// next.config.mjs sends those URLs here; the browser keeps /products?….
export default async function FilteredProductsPage(props: ListingRouteProps) {
  const { lang, query } = await resolveListingRequest("products", props)
  return <ProductsListing lang={lang} query={query} />
}
