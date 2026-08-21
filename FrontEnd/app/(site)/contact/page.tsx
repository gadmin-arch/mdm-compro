import type { Metadata } from "next"
import { Contact } from "@/components/contact"
import { PageHero } from "@/components/page-hero"

import { getPage } from "@/lib/cms"

export const metadata: Metadata = {
  title: "Hubungi Kami | Kantor Surabaya & Workshop Sidoarjo — PT Multi Daya Mitra",
  description:
    "Hubungi tim insinyur PT Multi Daya Mitra untuk konsultasi teknis, penawaran harga (RFQ) instalasi listrik 20kV, otomasi industri SCADA, dan panel maker.",
  alternates: {
    canonical: "https://multidayamitra.co.id/contact",
  },
}

export default async function ContactPage() {
  const page = await getPage("contact")

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Plan your next electrical or automation project with us."
        description="Tell us about your facility and the outcomes you're after — our engineers will respond with a tailored scope, approach, and quote."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <Contact page={page} />
    </>
  )
}
