import { redirect } from "next/navigation"
import { localizePath, toLocale, type Locale } from "@/lib/i18n"
import LISTING_QUERIES from "@/lib/listing-queries.json"

// The listing pages (/products, /services, /news, /career) are prerendered
// without filters. A request carrying one of the listing's parameters from
// listing-queries.json is rewritten by next.config.mjs to the listing's
// <listing>/~list route, which renders the same listing on demand.

export type Listing = keyof typeof LISTING_QUERIES

// The listing's parameters that have a value, e.g. { category: "automation", page: "2" }.
export type ListingQuery = Record<string, string>

type SearchParams = Record<string, string | string[] | undefined>

export function isListing(value: string): value is Listing {
  return Object.prototype.hasOwnProperty.call(LISTING_QUERIES, value)
}

export function listingQuery(listing: Listing, params: SearchParams): ListingQuery {
  const query: ListingQuery = {}
  for (const key of LISTING_QUERIES[listing]) {
    const raw = params[key]
    const value = (Array.isArray(raw) ? raw[0] : raw)?.trim()
    if (!value) continue
    // Page 1 is the static page itself.
    if (key === "page" && !(Number.parseInt(value, 10) > 1)) continue
    query[key] = value
  }
  return query
}

export type ListingRouteProps = {
  params: Promise<{ lang: string }>
  searchParams: Promise<SearchParams>
}

// For the <listing>/~list routes. A request that ends up there without any of
// the listing's parameters (a direct visit, ?page=1, an empty search) goes to
// the static listing instead.
export async function resolveListingRequest(
  listing: Listing,
  { params, searchParams }: ListingRouteProps,
): Promise<{ lang: Locale; query: ListingQuery }> {
  const lang = toLocale((await params).lang)
  const query = listingQuery(listing, await searchParams)
  if (Object.keys(query).length === 0) redirect(localizePath(`/${listing}`, lang))
  return { lang, query }
}
