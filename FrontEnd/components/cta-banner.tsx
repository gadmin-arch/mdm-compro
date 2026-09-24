import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"

interface CtaBannerProps {
  title: ReactNode | string
  description: ReactNode | string
  primaryHref?: string
  primaryLabel?: ReactNode | string
  secondaryHref?: string
  secondaryLabel?: ReactNode | string
}

export function CtaBanner({
  title,
  description,
  primaryHref = "/contact",
  primaryLabel = "EN: Request a Quote\nID: Minta Penawaran",
  secondaryHref,
  secondaryLabel,
}: CtaBannerProps) {
  const renderText = (val: ReactNode | string) => {
    if (typeof val === "string") {
      return <BilingualText text={val} />
    }
    return val
  }

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-border bg-secondary/50 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
              {renderText(title)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {renderText(description)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {secondaryHref && secondaryLabel && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryHref}>{renderText(secondaryLabel)}</Link>
              </Button>
            )}
            <Button asChild size="lg">
              <Link
                href={primaryHref}
                data-analytics-event="cta_click"
                data-analytics-label={typeof primaryLabel === "string" ? primaryLabel : undefined}
              >
                {renderText(primaryLabel)}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

