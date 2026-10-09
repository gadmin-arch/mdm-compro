import { NextResponse, type NextRequest } from "next/server"
import { loadListing } from "@/lib/listing-data"
import { isListing, listingQuery } from "@/lib/listing-query"

// A listing's filters and results for the query in the browser's URL, from the
// loaders the pages use (see components/cms/listing-view.tsx).
export async function GET(request: NextRequest, { params }: { params: Promise<{ listing: string }> }) {
  const { listing } = await params
  if (!isListing(listing)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  const query = listingQuery(listing, Object.fromEntries(request.nextUrl.searchParams))
  return NextResponse.json(await loadListing(listing, query), {
    // Shared copies live briefly on the CDN; the data underneath is cached by
    // Next and purged on every CMS save.
    headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" },
  })
}
