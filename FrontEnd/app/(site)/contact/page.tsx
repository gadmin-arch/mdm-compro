import type { Metadata } from "next"
import { Contact } from "@/components/contact"
import { PageHero } from "@/components/page-hero"
import { BilingualText } from "@/components/cms/content-language"

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
        eyebrow={<BilingualText text="EN: Get in Touch\nID: Hubungi Kami" />}
        title={<BilingualText text="EN: Plan your next electrical or automation project with us.\nID: Rencanakan proyek kelistrikan atau otomasi Anda bersama kami." />}
        description={<BilingualText text="EN: Tell us about your facility and the outcomes you're after — our engineers will respond with a tailored scope, approach, and quote.\nID: Sampaikan kebutuhan fasilitas Anda — tim insinyur kami siap memberikan rekomendasi teknis, lingkup kerja, dan penawaran terbaik." />}
        breadcrumbs={[
          { label: <BilingualText text="EN: Home\nID: Beranda" />, href: "/" },
          { label: <BilingualText text="EN: Contact\nID: Kontak" /> },
        ]}
      />
      <Contact page={page} />
    </>
  )
}
