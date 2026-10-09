import type { ReactNode } from "react"
import { LocalizedLink as Link } from "@/components/cms/localized-link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { isLocalizedText, type LocalizedText } from "@/lib/i18n"
import { hasText } from "@/lib/localized"

// CMS copy: a LocalizedText, a legacy "EN: …\nID: …" string, or ready JSX.
type Copy = ReactNode | LocalizedText

interface CtaBannerProps {
  title: Copy
  description: Copy
  primaryHref?: string
  // Omitted → the default "Request a Quote" button. Set but empty → no
  // primary button, so a builder section can remove it.
  primaryLabel?: Copy
  secondaryHref?: string
  secondaryLabel?: Copy
}

const DEFAULT_PRIMARY_LABEL = "EN: Request a Quote\nID: Minta Penawaran"

function renderCopy(value: Copy) {
  if (typeof value === "string" || isLocalizedText(value)) return <BilingualText text={value} />
  return value
}

function hasCopy(value: Copy) {
  if (typeof value === "string" || isLocalizedText(value)) return hasText(value)
  return value != null && value !== false
}

export function CtaBanner({
  title,
  description,
  primaryHref = "/contact",
  primaryLabel = DEFAULT_PRIMARY_LABEL,
  secondaryHref,
  secondaryLabel,
}: CtaBannerProps) {
  const showPrimary = Boolean(primaryHref) && hasCopy(primaryLabel)
  const showSecondary = Boolean(secondaryHref) && hasCopy(secondaryLabel)

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border bg-secondary/50 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            {hasCopy(title) && (
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
                {renderCopy(title)}
              </h2>
            )}
            {hasCopy(description) && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {renderCopy(description)}
              </p>
            )}
          </div>
          {(showPrimary || showSecondary) && (
            <div className="flex flex-wrap items-center gap-3">
              {showSecondary && secondaryHref && (
                <Button asChild size="lg" variant="outline">
                  <Link href={secondaryHref}>{renderCopy(secondaryLabel)}</Link>
                </Button>
              )}
              {showPrimary && (
                <Button asChild size="lg">
                  <Link
                    href={primaryHref}
                    data-analytics-event="cta_click"
                    data-analytics-label={typeof primaryLabel === "string" ? primaryLabel : undefined}
                  >
                    {renderCopy(primaryLabel)}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
