import type { ReactNode } from "react"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getAnalyticsConfig } from "@/lib/cms"

export const revalidate = 86400

export default async function SiteLayout({ children }: { children: ReactNode }) {
  // Feature-flagged server-side: when analytics is off, zero tracker code
  // reaches the browser.
  const analytics = await getAnalyticsConfig()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#site-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="site-content" className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
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
    </div>
  )
}
