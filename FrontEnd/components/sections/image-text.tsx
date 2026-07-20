import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { str, lines } from "@/lib/sections"
import { container } from "@/lib/layout"

export function ImageTextSection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow")
  const title = str(props, "title")
  const body = str(props, "body")
  const bullets = lines(props, "bullets")
  const imageUrl = str(props, "imageUrl", "/placeholder.jpg")
  const imageAlt = str(props, "imageAlt")
  const imageRight = str(props, "imagePosition", "left") === "right"
  const ctaLabel = str(props, "ctaLabel")
  const ctaHref = str(props, "ctaHref")
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className={cn("lg:col-span-5", imageRight && "lg:order-last")}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary">
              <Image src={imageUrl || "/placeholder.jpg"} alt={imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          </div>

          <div className="lg:col-span-7">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
                <span className="rounded-sm bg-accent/30 px-2 py-1">{eyebrow}</span>
              </p>
            )}
            {title && (
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                {title}
              </h2>
            )}
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {bullets.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {bullets.map((bullet, index) => (
                  <li key={`${bullet}-${index}`} className="flex items-start gap-2.5 text-sm text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {ctaLabel && ctaHref && (
              <div className="mt-8">
                <Button asChild>
                  <Link href={ctaHref}>
                    {ctaLabel}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
