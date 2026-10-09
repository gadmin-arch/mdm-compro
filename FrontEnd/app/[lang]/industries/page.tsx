import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { Industries } from "@/components/industries"
import { PageHero } from "@/components/page-hero"

import { toLocale } from "@/lib/i18n"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildLocalizedMetadata({
    lang: toLocale((await params).lang),
    path: "/industries",
    title: { id: "Sektor Industri yang Dilayani", en: "Industries We Serve" },
    description: {
      id: "Kami melayani pembangkit listrik, migas, petrokimia, manufaktur, farmasi, makanan & minuman, dan infrastruktur strategis di Indonesia.",
      en: "We serve power plants, oil & gas, petrochemical, manufacturing, pharmaceuticals, food & beverage, and other critical infrastructure sectors.",
    },
  })
}

export default async function IndustriesPage({ params }: Props) {
  const lang = toLocale((await params).lang)
  return (
    <>
      <PageHero
        eyebrow="EN: Industries\nID: Sektor Industri"
        title="EN: Trusted across heavy industry and critical infrastructure.\nID: Mitra terpercaya di berbagai industri berat dan infrastruktur strategis."
        description="EN: From power generation and oil & gas to pharmaceuticals and food processing, we deliver electrical and automation expertise where reliability matters most.\nID: Mulai dari pembangkit listrik, migas, hingga farmasi dan pengolahan makanan, kami menghadirkan keahlian elektrikal dan otomasi di sektor yang membutuhkan keandalan tertinggi."
        breadcrumbs={[{ label: "EN: Home\nID: Beranda", href: "/" }, { label: "EN: Industries\nID: Sektor Industri" }]}
      />
      <Industries lang={lang} />
      <CtaBanner
        title="EN: Working in a sector we serve?\nID: Membutuhkan solusi untuk sektor industri Anda?"
        description="EN: Talk to our engineering team about your facility — we'll align scope, standards, and operating requirements to your industry.\nID: Konsultasikan kebutuhan fasilitas Anda dengan tim insinyur kami — kami sesuaikan lingkup pekerjaan dan standar teknis dengan industri Anda."
        primaryHref="/contact"
        primaryLabel="EN: Start a Conversation\nID: Mulai Konsultasi"
        secondaryHref="/services"
        secondaryLabel="EN: Browse Services\nID: Lihat Layanan"
      />
    </>
  )
}
