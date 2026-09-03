import type { ReactNode } from "react"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

// The public site frame, shared by app/(site)/layout.tsx and the admin draft
// preview so a preview looks like the real page.
//
// AnalyticsTracker is deliberately NOT here: the preview must not record
// pageviews for a URL that is not live yet. Add new site-wide chrome HERE
// rather than in the layout, or the preview will quietly drift from the real
// page.
export function SiteChrome({ children }: { children: ReactNode }) {
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
    </div>
  )
}
