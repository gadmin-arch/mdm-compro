import type { Metadata } from "next"
import { localizePath, type Locale } from "@/lib/i18n"
import { resolveTextStrict } from "@/lib/localized"

// Canonical URLs always point at the production domain, except in local
// development where they follow NEXT_PUBLIC_SITE_URL.
export function canonicalSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://multidayamitra.co.id"
  return (raw.includes("localhost") ? raw : "https://multidayamitra.co.id").replace(/\/$/, "")
}

export function localizedUrl(path: string, lang: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`
  return `${canonicalSiteUrl()}${localizePath(clean, lang)}`.replace(/(?<=.)\/$/, "")
}

export const SITE_NAME = "PT Multi Daya Mitra"
const DEFAULT_IMAGE = "/uploads/hero-project.jpg"

export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
    { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
    { url: "/icon.svg", type: "image/svg+xml" },
  ],
  apple: "/apple-icon.png",
}

const ROOT_COPY: Record<Locale, { title: string; description: string; ogDescription: string }> = {
  id: {
    title: "PT Multi Daya Mitra | Kontraktor Listrik, Otomasi Industri & Fire System",
    description:
      "PT Multi Daya Mitra adalah kontraktor rekayasa elektrik terintegrasi, otomasi industri (PLC & SCADA), panel maker MV/LV, testing & commissioning, serta distributor resmi Rittal di Indonesia sejak 2012.",
    ogDescription:
      "Solusi rekayasa elektrik, otomasi industri (PLC/SCADA), panel maker MV/LV, testing & commissioning, dan fire protection terpercaya di Indonesia.",
  },
  en: {
    title: "PT Multi Daya Mitra | Electrical Contractor, Industrial Automation & Fire Systems",
    description:
      "PT Multi Daya Mitra is an integrated electrical engineering contractor in Indonesia — industrial automation (PLC & SCADA), MV/LV panel building, testing & commissioning, and authorized Rittal distribution since 2012.",
    ogDescription:
      "Trusted electrical engineering, industrial automation (PLC/SCADA), MV/LV panels, testing & commissioning, and fire protection across Indonesia.",
  },
}

const DEFAULT_KEYWORDS = [
  "PT Multi Daya Mitra",
  "kontraktor listrik surabaya",
  "kontraktor listrik indonesia",
  "otomasi industri plc scada",
  "panel maker surabaya",
  "distributor rittal indonesia",
  "jasa testing dan commissioning listrik",
  "fire alarm system indonesia",
  "electrical contractor indonesia",
  "industrial automation contractor",
  "plc scada system integrator indonesia",
  "mv lv switchgear installation",
]

function alternatesFor(path: string, lang: Locale, canonical?: string): Metadata["alternates"] {
  return {
    canonical: canonical ?? localizedUrl(path, lang),
    languages: {
      "id-ID": localizedUrl(path, "id"),
      "en-US": localizedUrl(path, "en"),
      "x-default": localizedUrl(path, "id"),
    },
  }
}

// Defaults for every public page in one language; pages override title,
// description and alternates through buildLocalizedMetadata().
export function rootMetadataFor(lang: Locale): Metadata {
  const copy = ROOT_COPY[lang]
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://multidayamitra.co.id"),
    title: { default: copy.title, template: `%s | ${SITE_NAME}` },
    description: copy.description,
    keywords: DEFAULT_KEYWORDS,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: true, address: true, telephone: true },
    alternates: alternatesFor("/", lang),
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : "id_ID",
      alternateLocale: [lang === "en" ? "id_ID" : "en_US"],
      url: localizedUrl("/", lang),
      siteName: SITE_NAME,
      title: copy.title,
      description: copy.ogDescription,
      images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.ogDescription,
      images: [DEFAULT_IMAGE],
    },
    icons: siteIcons,
  }
}

export type LocalizedMetadataOptions = {
  lang: Locale
  // Path without the /en prefix, e.g. "/services/x". Both language URLs and
  // the hreflang pair are derived from it.
  path: string
  // CMS values: LocalizedText objects or "EN: …\nID: …" strings.
  title?: unknown
  description?: unknown
  // CMS canonical override. An absolute URL only applies to the Indonesian
  // page; the English page always canonicalises to itself.
  canonical?: string | null
  image?: string | null
  type?: "website" | "article"
  noIndex?: boolean
  keywords?: string[]
}

export function buildLocalizedMetadata(options: LocalizedMetadataOptions): Metadata {
  const { lang, path, image, type = "website", noIndex, keywords = [] } = options
  const title = resolveTextStrict(options.title, lang).replace(/\s+/g, " ").trim()
  const description = resolveTextStrict(options.description, lang).replace(/\s+/g, " ").trim()

  const override = options.canonical?.trim()
  const canonicalPath = override && override.startsWith("/") ? override : path
  const canonical = override && /^https?:\/\//.test(override) && lang === "id" ? override : undefined
  const url = canonical ?? localizedUrl(canonicalPath, lang)
  const ogImage = image || DEFAULT_IMAGE

  return {
    // CMS SEO titles often already end with the company name; skip the
    // layout template for those so it is not repeated.
    title: title ? (/multi daya mitra/i.test(title) ? { absolute: title } : title) : undefined,
    description: description || undefined,
    keywords: Array.from(new Set([...keywords, ...(title ? [title] : []), ...DEFAULT_KEYWORDS])),
    alternates: alternatesFor(canonicalPath, lang, url),
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      url,
      siteName: SITE_NAME,
      locale: lang === "en" ? "en_US" : "id_ID",
      alternateLocale: [lang === "en" ? "id_ID" : "en_US"],
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: title || undefined,
      description: description || undefined,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}
