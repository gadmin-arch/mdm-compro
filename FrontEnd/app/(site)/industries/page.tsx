import type { Metadata } from "next"
import { CtaBanner } from "@/components/cta-banner"
import { Industries } from "@/components/industries"
import { PageHero } from "@/components/page-hero"

import { buildBilingualMetadata } from "@/lib/bilingual"

export const metadata: Metadata = buildBilingualMetadata({
  title: "Sektor Industri yang Dilayani\nIndustries We Serve",
  description:
    "Kami melayani pembangkit listrik, migas, petrokimia, manufaktur, farmasi, makanan & minuman, dan infrastruktur strategis di Indonesia.\nWe serve power plants, oil & gas, petrochemical, manufacturing, pharmaceuticals, food & beverage, and other critical infrastructure sectors.",
  canonicalPath: "/industries",
})

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Trusted across heavy industry and critical infrastructure."
        description="From power generation and oil & gas to pharmaceuticals and food processing, we deliver electrical and automation expertise where reliability matters most."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />
      <Industries />
      <CtaBanner
        title="Working in a sector we serve?"
        description="Talk to our engineering team about your facility — we'll align scope, standards, and operating requirements to your industry."
        primaryHref="/contact"
        primaryLabel="Start a Conversation"
        secondaryHref="/services"
        secondaryLabel="Browse Services"
      />
    </>
  )
}
