import type { ReactNode } from "react"
import { AnalyticsTracker } from "@/components/analytics/analytics-tracker"
import { SiteChrome } from "@/components/site-chrome"
import { getAnalyticsConfig } from "@/lib/cms"

export const revalidate = 86400

export default async function SiteLayout({ children }: { children: ReactNode }) {
  // Feature-flagged server-side: when analytics is off, zero tracker code
  // reaches the browser.
  const analytics = await getAnalyticsConfig()

  return (
    <SiteChrome>
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
  )
}
