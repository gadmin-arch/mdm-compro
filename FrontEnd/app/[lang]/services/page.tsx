import type { Metadata } from "next"
import { toLocale } from "@/lib/i18n"
import { ServicesListing, servicesMetadata } from "./listing"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return servicesMetadata(toLocale((await params).lang))
}

// Prerendered without filters. Requests with a filter or page parameter are
// rewritten to ./~list, which renders the same listing per request
// (lib/listing-query.ts).
export default async function ServicesPage({ params }: Props) {
  return <ServicesListing lang={toLocale((await params).lang)} query={{}} />
}
