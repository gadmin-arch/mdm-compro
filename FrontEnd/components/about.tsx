import type { PageContent } from "@/lib/cms"
import type { Locale } from "@/lib/i18n"
import { AboutStorySection } from "@/components/sections/about-story"
import { ImpactValuesSection } from "@/components/sections/impact-values"
import { MilestonesSection } from "@/components/sections/milestones"
import { HseCultureSection } from "@/components/sections/hse-culture"
import { CertificationsSection } from "@/components/sections/certifications"
import { LicensedExpertsSection } from "@/components/sections/licensed-experts"
import { TestingEquipmentSection } from "@/components/sections/testing-equipment"
import { BrandPartnersSection } from "@/components/sections/brand-partners"
import { OfficesSection } from "@/components/sections/offices"

export {
  AboutStorySection,
  ImpactValuesSection,
  MilestonesSection,
  HseCultureSection,
  CertificationsSection,
  LicensedExpertsSection,
  TestingEquipmentSection,
  BrandPartnersSection,
}

// Composite About component for backwards compatibility with any page still using
// the monolithic `about` section type or calling <About page={...} /> directly.
export function About({ page, lang }: { page?: PageContent | null; lang: Locale }) {
  const content = (page?.content as Record<string, unknown>) ?? {}

  return (
    <>
      <AboutStorySection props={content} lang={lang} />
      <ImpactValuesSection props={content} lang={lang} />
      <MilestonesSection props={content} lang={lang} />
      <HseCultureSection props={content} lang={lang} />
      <CertificationsSection props={content} lang={lang} />
      <LicensedExpertsSection props={content} lang={lang} />
      <TestingEquipmentSection props={content} lang={lang} />
      <BrandPartnersSection props={content} lang={lang} />
      <OfficesSection props={content} lang={lang} />
    </>
  )
}
