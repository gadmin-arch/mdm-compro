import type { ReactNode } from "react"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getAnalyticsConfig } from "@/lib/cms"

export default async function SiteLayout({ children }: { children: ReactNode }) {
  // Feature-flagged server-side: when analytics is off, zero tracker code
  // reaches the browser.
  const analytics = await getAnalyticsConfig()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
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
