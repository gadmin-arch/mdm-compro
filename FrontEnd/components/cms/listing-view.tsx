"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ListingBlock } from "@/components/cms/listing-blocks"
import { ListingContext } from "@/components/cms/listing-context"
import type { Locale } from "@/lib/i18n"
import type { ListingData } from "@/lib/listing-data"
import { listingQuery, type Listing, type ListingQuery } from "@/lib/listing-query"

type Props = {
  listing: Listing
  lang: Locale
  // The query the server loaded `data` for; empty on the prerendered page.
  query: ListingQuery
  data: ListingData
}

// The filters, results and pagination of a listing page, kept in step with the
// URL. The server renders them for the page's own query; when the URL's query
// changes afterwards — the filter controls rewrite it in place, pagination and
// other links navigate, back/forward — the results for the new query come from
// /api/listing/<listing> (same loaders) and replace the block in place. A
// router navigation can't be relied on for that: Next reuses a prerendered
// page when only the query string changes.
export function ListingView(props: Props) {
  // useSearchParams() needs a Suspense boundary on a prerendered page; the
  // static HTML then holds the block the server rendered.
  return (
    <Suspense fallback={<ListingBlock {...props} />}>
      <LiveListing {...props} />
    </Suspense>
  )
}

function LiveListing({ listing, lang, query, data }: Props) {
  const searchParams = useSearchParams()
  const urlQuery = listingQuery(listing, Object.fromEntries(searchParams))
  const key = new URLSearchParams(urlQuery).toString()
  const initialKey = new URLSearchParams(query).toString()
  const [loaded, setLoaded] = useState<Record<string, ListingData>>({})
  const current = key === initialKey ? data : loaded[key]
  // The query whose results are on screen: while the next ones load, the
  // last ones stay.
  const [shownKey, setShownKey] = useState(initialKey)
  if (current && shownKey !== key) setShownKey(key)

  useEffect(() => {
    if (key === initialKey || loaded[key]) return
    const controller = new AbortController()
    fetch(`/api/listing/${listing}${key ? `?${key}` : ""}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`listing ${response.status}`)
        return response.json() as Promise<ListingData>
      })
      .then((next) => setLoaded((all) => ({ ...all, [key]: next })))
      .catch(() => {
        // Have the server render the page for this URL instead.
        if (!controller.signal.aborted) window.location.reload()
      })
    return () => controller.abort()
  }, [key, initialKey, loaded, listing])

  const shown = current ? key : shownKey
  return (
    <ListingContext.Provider value={{ query: urlQuery, pending: !current }}>
      <div aria-busy={!current}>
        <ListingBlock
          listing={listing}
          lang={lang}
          query={Object.fromEntries(new URLSearchParams(shown))}
          data={(shown === initialKey ? data : loaded[shown]) ?? data}
        />
      </div>
    </ListingContext.Provider>
  )
}
