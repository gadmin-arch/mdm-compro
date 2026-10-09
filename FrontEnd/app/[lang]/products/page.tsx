import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { ProductsListing, productsMetadata } from "./listing"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return productsMetadata(toLocale((await params).lang))
}

// Prerendered without filters. Requests with a filter or page parameter are
// rewritten to ./~list, which renders the same listing per request
// (lib/listing-query.ts).
export default async function ProductsPage({ params }: Props) {
  return <ProductsListing lang={toLocale((await params).lang)} query={{}} />
}
