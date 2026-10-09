import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { PageHero } from "@/components/page-hero"
import { BilingualText } from "@/components/cms/content-language"
import { RichText } from "@/components/cms/rich-text"
import { SectionRenderer } from "@/components/cms/section-renderer"
import { getPage, getPages, resolveSectionData } from "@/lib/cms"
import { isLocalizedText, toLocale } from "@/lib/i18n"
import { sectionsFromContent } from "@/lib/sections"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"
import { container } from "@/lib/layout"

type PageProps = {
  params: Promise<{ lang: string; pageKey: string }>
}

// Pages with their own folder under app/[lang] never reach this route. Listing
// them here too would prerender a second page for the same path (/id/news…),
// and whichever is written last would be served.
const OWN_ROUTE_KEYS = ["about", "career", "contact", "industries", "news", "products", "search", "services"]

export async function generateStaticParams() {
  const res = await getPages({ limit: 100 }).catch(() => ({ data: [] }))
  return (res.data || [])
    .filter((p) => p.status === "published" && !["home", "cpanel", "webmail", ...OWN_ROUTE_KEYS].includes(p.key))
    .map((p) => ({ pageKey: p.key }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang, pageKey } = await params
  if (pageKey === "cpanel" || pageKey === "webmail" || pageKey === "home") return {}
  const page = await getPage(pageKey)
  if (!page) return {}

  return buildLocalizedMetadata({
    lang: toLocale(rawLang),
    path: `/${pageKey}`,
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    canonical: page.seo?.canonical,
    noIndex: page.seo?.noIndex,
  })
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const { lang: rawLang, pageKey } = await params
  const lang = toLocale(rawLang)
  if (pageKey === "cpanel") {
    redirect("https://cpanel.multidayamitra.co.id:2083")
  }
  if (pageKey === "webmail") {
    redirect("https://webmail.multidayamitra.co.id:2096")
  }
  // The home page renders at "/" — serving it here too would publish the
  // same content twice under /home.
  if (pageKey === "home") {
    notFound()
  }
  const page = await getPage(pageKey)
  if (!page || page.status !== "published") {
    notFound()
  }

  // Pages built with the section builder render as full-width sections;
  // legacy pages keep the article + fields layout below.
  const sections = sectionsFromContent(page.content)
  if (sections.length > 0) {
    const data = await resolveSectionData(sections)
    return <SectionRenderer sections={sections} data={data} lang={lang} />
  }

  const fields = Object.entries(page.content ?? {}).filter(([key]) => key !== "blocks" && key !== "sections")
  const description = page.seo?.description || firstTextField(fields)

  return (
    <>
      <PageHero
        eyebrow="EN: Page\nID: Halaman"
        title={page.title}
        description={description}
        breadcrumbs={[{ label: "EN: Home\nID: Beranda", href: "/" }, { label: page.title }]}
      />
      <section className={container("grid gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_320px]")}>
        <article className="min-w-0">
          <RichText content={page.content} lang={lang} />
        </article>

        {fields.length > 0 && (
          <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
            {fields.map(([key, value]) => (
              <div className="rounded-lg border border-border bg-background p-4" key={key}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {humanize(key)}
                </p>
                <div className="mt-2 text-sm leading-relaxed text-foreground">
                  {renderField(value)}
                </div>
              </div>
            ))}
          </aside>
        )}
      </section>
    </>
  )
}

function firstTextField(fields: Array<[string, unknown]>) {
  for (const [, value] of fields) {
    if ((typeof value === "string" && value.trim()) || isLocalizedText(value)) return value as string
  }
  return undefined
}

function renderField(value: unknown) {
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((item, index) => (
          <li key={index}>
            {typeof item === "string" || isLocalizedText(item) ? <BilingualText text={item} /> : String(item)}
          </li>
        ))}
      </ul>
    )
  }
  if (typeof value === "string" || isLocalizedText(value)) {
    return <BilingualText as="p" className="whitespace-pre-line" text={value} />
  }
  if (value && typeof value === "object") {
    return <pre className="overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(value, null, 2)}</pre>
  }
  return <p className="whitespace-pre-line">{String(value ?? "")}</p>
}

function humanize(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
