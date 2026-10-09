import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { NewsListing, newsMetadata } from "./listing"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return newsMetadata(toLocale((await params).lang))
}

// Prerendered without filters. Requests with a filter or page parameter are
// rewritten to ./~list, which renders the same listing per request
// (lib/listing-query.ts).
export default async function NewsPage({ params }: Props) {
  return <NewsListing lang={toLocale((await params).lang)} query={{}} />
}
