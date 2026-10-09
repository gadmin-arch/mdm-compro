import {
  About,
  AboutStorySection,
  ImpactValuesSection,
  MilestonesSection,
  HseCultureSection,
  CertificationsSection,
  LicensedExpertsSection,
  TestingEquipmentSection,
  BrandPartnersSection,
} from "@/components/about"
import { Capabilities } from "@/components/capabilities"
import { Contact } from "@/components/contact"
import { CtaBanner } from "@/components/cta-banner"
import { Hero } from "@/components/hero"
import { Industries } from "@/components/industries"
import { PageHero } from "@/components/page-hero"
import { Services } from "@/components/services"
import { WhyUs } from "@/components/why-us"
import { RichText } from "@/components/cms/rich-text"
import { AboutIntroSection } from "@/components/sections/about-intro"
import { ContentGridSection } from "@/components/sections/content-grid"
import { EmbedSection } from "@/components/sections/embed"
import { FaqSection } from "@/components/sections/faq"
import { GallerySection } from "@/components/sections/gallery"
import { ImageTextSection } from "@/components/sections/image-text"
import { OfficesSection } from "@/components/sections/offices"
import { StatsSection } from "@/components/sections/stats"
import type { ContentNode, NewsItem, PageContent } from "@/lib/cms"
import { hasText, resolveHtml, resolveText } from "@/lib/localized"
import { isLocalizedText, type Locale, type LocalizedText } from "@/lib/i18n"
import { prop, str, visibleSections, type Section } from "@/lib/sections"

// Dynamic sections (contentGrid) render from pre-resolved data so this
// component stays usable in Server Components and the admin live preview.
export type SectionData = {
  services: ContentNode[]
  products: ContentNode[]
  news: NewsItem[]
}

export const emptySectionData: SectionData = { services: [], products: [], news: [] }

export function SectionRenderer({
  sections,
  data = emptySectionData,
  lang,
  listingPlaceholder = false,
}: {
  sections: Section[]
  data?: SectionData
  // Language of the page being rendered (the URL's on the public site, the
  // preview toggle in the admin builder).
  lang: Locale
  // Admin preview only: draw a placeholder box where the automatic listing
  // will render. On the public site the marker renders nothing (the landing
  // route injects the real listing at that spot).
  listingPlaceholder?: boolean
}) {
  return (
    <>
      {visibleSections(sections).map((section) => (
        <SectionView
          key={section.id}
          section={section}
          data={data}
          lang={lang}
          listingPlaceholder={listingPlaceholder}
        />
      ))}
    </>
  )
}

export function SectionView({
  section,
  data,
  lang,
  listingPlaceholder = false,
}: {
  section: Section
  data: SectionData
  lang: Locale
  listingPlaceholder?: boolean
}) {
  const props = section.props ?? {}

  switch (section.type) {
    case "listing":
      if (!listingPlaceholder) return null
      return (
        <div className="mx-auto my-6 max-w-4xl rounded-xl border-2 border-dashed border-border bg-secondary/20 px-6 py-10 text-center">
          <p className="text-sm font-semibold text-foreground">Automatic {str(props, "source", "resource")} listing</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Search, filters, and pagination render here on the live page.
          </p>
        </div>
      )
    case "hero":
      return <Hero props={props} lang={lang} />
    case "pageHero":
      return (
        // Raw values on purpose: PageHero resolves them once for the page
        // language (resolving here too would run plain text through the
        // legacy " / " and two-line heuristics a second time).
        <PageHero
          eyebrow={copy(props.eyebrow)}
          title={copy(props.title)}
          description={hasText(props.description) ? copy(props.description) : undefined}
          // The eyebrow ("About Us") makes a usable breadcrumb; the title is
          // a full headline and would overflow the trail.
          breadcrumbs={[
            { label: { id: "Beranda", en: "Home" }, href: "/" },
            { label: copy(hasText(props.eyebrow) ? props.eyebrow : props.title) },
          ]}
        />
      )
    case "aboutIntro":
      return <AboutIntroSection props={props} lang={lang} />
    case "aboutStory":
      return <AboutStorySection props={props} lang={lang} />
    case "impactValues":
      return <ImpactValuesSection props={props} lang={lang} />
    case "milestones":
      return <MilestonesSection props={props} lang={lang} />
    case "hseCulture":
      return <HseCultureSection props={props} lang={lang} />
    case "certifications":
      return <CertificationsSection props={props} lang={lang} />
    case "licensedExperts":
      return <LicensedExpertsSection props={props} lang={lang} />
    case "testingEquipment":
      return <TestingEquipmentSection props={props} lang={lang} />
    case "brandPartners":
      return <BrandPartnersSection props={props} lang={lang} />
    case "about":
      return <About page={{ content: props } as unknown as PageContent} lang={lang} />
    case "contact":
      return <Contact props={props} lang={lang} />
    case "offices":
      return <OfficesSection props={props} lang={lang} />
    case "capabilities":
      return <Capabilities props={props} lang={lang} />
    case "servicesShowcase":
      return <Services services={data.services.length > 0 ? data.services : undefined} props={props} lang={lang} />
    case "imageText":
      return <ImageTextSection props={props} lang={lang} />
    case "richText": {
      const title = resolveText(props.title, lang).trim()
      // Per-language HTML renders as written; only legacy single-string HTML
      // still goes through the old EN:/ID: marker filter.
      const { html, legacy } = resolveHtml(props.html, lang)
      const blocks = normalizeBlocks(props.blocks, lang)
      return (
        <section className="border-b border-border/60 bg-background">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            {title && (
              <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h2>
            )}
            {html.trim() && (
              <RichText content={{ blocks: [{ type: "html", html: html.trim() }] }} lang={lang} resolved={!legacy} />
            )}
            {blocks.length > 0 && <RichText content={{ blocks }} lang={lang} resolved />}
            {!html.trim() && blocks.length === 0 && <RichText content={{ blocks: [] }} lang={lang} />}
          </div>
        </section>
      )
    }
    case "features":
      return <WhyUs props={props} lang={lang} />
    case "stats":
      return <StatsSection props={props} lang={lang} />
    case "contentGrid":
      return <ContentGridSection props={props} data={data} lang={lang} />
    case "industries":
      return <Industries props={props} lang={lang} />
    case "gallery":
      return <GallerySection props={props} lang={lang} />
    case "faq":
      return <FaqSection props={props} lang={lang} />
    case "cta":
      return (
        <CtaBanner
          title={copy(props.title)}
          description={copy(props.description)}
          // A label the admin emptied removes its button; one never set keeps
          // the banner's default.
          primaryLabel={prop(props, "primaryLabel") === undefined ? undefined : copy(props.primaryLabel)}
          primaryHref={str(props, "primaryHref") || undefined}
          secondaryLabel={copy(props.secondaryLabel)}
          secondaryHref={str(props, "secondaryHref") || undefined}
        />
      )
    case "embed":
      return <EmbedSection props={props} lang={lang} />
    default:
      return null
  }
}

// Blocks authored in the builder store list items as newline-separated text;
// RichText expects { type, text, items } blocks.
function normalizeBlocks(value: unknown, lang: Locale): Array<{ type: string; text?: string; items?: string[] }> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => {
      const type = typeof item.type === "string" ? item.type : "paragraph"
      const text = resolveText(item.text, lang)
      if (type === "list") {
        const items = Array.isArray(item.items)
          ? item.items.map((entry) => String(entry)).filter(Boolean)
          : text
              .split("\n")
              .map((entry) => entry.trim())
              .filter(Boolean)
        return { type, items }
      }
      return { type, text }
    })
    .filter((block) => (block.type === "list" ? (block.items?.length ?? 0) > 0 : Boolean(block.text)))
}

// Section copy handed to components that resolve it themselves: a
// LocalizedText or a legacy marker string, never an already-resolved string.
function copy(value: unknown): string | LocalizedText {
  if (typeof value === "string" || isLocalizedText(value)) return value
  return ""
}
