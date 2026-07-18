import { Capabilities } from "@/components/capabilities"
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
import type { ContentNode, NewsItem } from "@/lib/cms"
import { str, type Section } from "@/lib/sections"

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
  listingPlaceholder = false,
}: {
  sections: Section[]
  data?: SectionData
  // Admin preview only: draw a placeholder box where the automatic listing
  // will render. On the public site the marker renders nothing (the landing
  // route injects the real listing at that spot).
  listingPlaceholder?: boolean
}) {
  return (
    <>
      {sections.map((section) => (
        <SectionView key={section.id} section={section} data={data} listingPlaceholder={listingPlaceholder} />
      ))}
    </>
  )
}

export function SectionView({
  section,
  data,
  listingPlaceholder = false,
}: {
  section: Section
  data: SectionData
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
      return <Hero props={props} />
    case "pageHero":
      return (
        <PageHero
          eyebrow={str(props, "eyebrow")}
          title={str(props, "title")}
          description={str(props, "description") || undefined}
          // The eyebrow ("About Us") makes a usable breadcrumb; the title is
          // a full headline and would overflow the trail.
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: str(props, "eyebrow") || str(props, "title") },
          ]}
        />
      )
    case "aboutIntro":
      return <AboutIntroSection props={props} />
    case "offices":
      return <OfficesSection props={props} />
    case "capabilities":
      return <Capabilities props={props} />
    case "servicesShowcase":
      return <Services services={data.services.length > 0 ? data.services : undefined} props={props} />
    case "imageText":
      return <ImageTextSection props={props} />
    case "richText": {
      const html = str(props, "html").trim()
      const blocks: Array<{ type: string; text?: string; items?: string[]; html?: string }> =
        normalizeBlocks(props.blocks)
      if (html) blocks.unshift({ type: "html", html })
      return (
        <section className="border-b border-border/60 bg-background">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <RichText content={{ blocks }} />
          </div>
        </section>
      )
    }
    case "features":
      return <WhyUs props={props} />
    case "stats":
      return <StatsSection props={props} />
    case "contentGrid":
      return <ContentGridSection props={props} data={data} />
    case "industries":
      return <Industries props={props} />
    case "gallery":
      return <GallerySection props={props} />
    case "faq":
      return <FaqSection props={props} />
    case "cta":
      return (
        <CtaBanner
          title={str(props, "title")}
          description={str(props, "description")}
          primaryLabel={str(props, "primaryLabel") || undefined}
          primaryHref={str(props, "primaryHref") || undefined}
          secondaryLabel={str(props, "secondaryLabel") || undefined}
          secondaryHref={str(props, "secondaryHref") || undefined}
        />
      )
    case "embed":
      return <EmbedSection props={props} />
    default:
      return null
  }
}

// Blocks authored in the builder store list items as newline-separated text;
// RichText expects { type, text, items } blocks.
function normalizeBlocks(value: unknown): Array<{ type: string; text?: string; items?: string[] }> {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => {
      const type = typeof item.type === "string" ? item.type : "paragraph"
      const text = typeof item.text === "string" ? item.text : ""
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
