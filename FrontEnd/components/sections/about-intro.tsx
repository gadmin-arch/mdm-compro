import Image from "next/image"
import { Compass, Handshake, Target } from "lucide-react"
import { sectionDefsByType, str } from "@/lib/sections"
import { container } from "@/lib/layout"

// Mirrors the intro block of the original About component so the CMS-built
// about page looks identical to the hardcoded one.
const defaults = sectionDefsByType.aboutIntro.defaults

export function AboutIntroSection({ props }: { props: Record<string, unknown> }) {
  const merged = { ...defaults, ...props }
  const eyebrow = str(merged, "eyebrow")
  const title = str(merged, "title")
  const overview = str(merged, "overview")
  const body = str(merged, "body")
  const imageUrl = str(merged, "imageUrl", "/placeholder.jpg")
  const imageAlt = str(merged, "imageAlt")
  const vision = str(merged, "vision")
  const mission = str(merged, "mission")
  const culture = str(merged, "culture")

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
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
              {overview && <p>{overview}</p>}
              {body && <p>{body}</p>}
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {vision && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Compass className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Our Vision
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{vision}</p>
                </div>
              )}

              {mission && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/30 text-foreground">
                      <Target className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Our Mission
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mission}</p>
                </div>
              )}

              {culture && (
                <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Handshake className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      Our Culture
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{culture}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
