import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Analytics } from "@vercel/analytics/next"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"
import { JsonLdSchema } from "@/components/seo/json-ld"
import { SiteChrome } from "@/components/site-chrome"
import { getAnalyticsConfig } from "@/lib/cms"
import { fontVariables } from "@/lib/fonts"
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n"
import { rootMetadataFor } from "@/lib/seo-metadata"
import "../globals.css"

// Root layout of the public site. A rewrite in next.config.mjs maps "/about"
// to "/id/about" and leaves "/en/about" as is, so every page renders on the
// server in the language of its URL.
export const revalidate = 86400

type Props = {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export function generateStaticParams() {
  // `next dev` records each route's static params in
  // .next/dev/prerender-manifest.json with an unlocked read → modify → write.
  // With [lang] at the root that is every public route, and two first visits
  // at once corrupt the file so every request fails until a restart. Dev
  // renders on demand anyway, so only production builds list the locales.
  if (process.env.NODE_ENV !== "production") return []
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params
  return rootMetadataFor(isLocale(lang) ? lang : DEFAULT_LOCALE)
}

// Only the browser-facing base matters here (contact form, analytics
// beacon). With the recommended relative "/api/v1/public" the browser never
// connects to the API origin, and a preconnect would be wasted.
const apiOrigin = (() => {
  const url = process.env.NEXT_PUBLIC_CMS_API_BASE_URL
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.protocol.startsWith("http") && !parsed.hostname.includes("localhost") && !parsed.hostname.includes("127.0.0.1")) {
      return parsed.origin
    }
  } catch {
    return null
  }
  return null
})()

export default async function SiteRootLayout({ children, params }: Props) {
  const { lang: rawLang } = await params
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE
  // Feature-flagged server-side: when analytics is off, zero tracker code
  // reaches the browser.
  const analytics = await getAnalyticsConfig()

  return (
    <html lang={lang} className={`${fontVariables} bg-background`}>
      <head>
        {apiOrigin && (
          <>
            <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={apiOrigin} />
          </>
        )}
        <JsonLdSchema />
      </head>
      <body className="font-sans antialiased">
        <SiteChrome lang={lang}>
          {children}
          {analytics.enabled && (
            <AnalyticsTracker
              config={{
                ignoreAdmins: analytics.ignoreAdmins,
                respectDnt: analytics.respectDnt,
                trackVitals: analytics.trackVitals,
                trackEvents: analytics.trackEvents,
              }}
            />
          )}
        </SiteChrome>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
