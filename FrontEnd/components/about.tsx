import Image from "next/image"
import { ArrowRight, Compass, Handshake, Mail, MapPin, Phone, Target } from "lucide-react"
import type { PageContent } from "@/lib/cms"

export function About({ page }: { page?: PageContent | null }) {
  const content = page?.content ?? {}
  const overview = String(content.overview ?? "Established in 2013, PT Multi Daya Mitra was founded by a group of seasoned engineers with deep expertise in electricity, industrial automation, fire alarm systems, and mechanical works.")
  const vision = String(content.vision ?? "To become a global electrical, automation, and fire alarm services company.")
  const mission = String(content.mission ?? "Build mutual partnerships and deliver every engagement with professional excellence.")

  return (
    <>
      <section className="border-b border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary">
              <Image
                src="/uploads/automation-project.jpg"
                alt="Industrial automation control room with engineers monitoring SCADA systems"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground/80">
              <span className="rounded-sm bg-accent/30 px-2 py-1">About the company</span>
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              A team built for your most demanding electrical projects.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>{overview}</p>
              <p>
                We have grown into one of the largest electrical service partners in
                East Java — delivering projects across Indonesia and on selected
                overseas assignments. Our company culture of professional discipline
                drives every milestone, and we are certified to recognized quality
                management standards.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Compass className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Our Vision
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {vision}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/30 text-foreground">
                    <Target className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Our Mission
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {mission}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 sm:col-span-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Handshake className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                    Our Culture
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  A professional, fast-moving organization driven by certified
                  engineers, structured processes, and a commitment to safety on every
                  site we operate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Our Locations Section */}
      <section className="border-t border-border/60 bg-secondary/15 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center md:text-left">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Our Offices
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find our physical offices across Indonesia.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Head Office (Surabaya)
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">
                Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia
              </p>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Phone: +62 31 592 1256
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="rotate-90 h-3.5 w-3.5 text-primary" />
                  Fax: +62 31 591 7845
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  Email: info@multidayamitra.co.id
                </p>
              </div>
              <div className="mt-5">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ruko+Klampis+Megah+Surabaya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  Open in Google Maps
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Workshop
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-grow">
                Ruko Jati Kepuh Indah E-21, Sidoarjo 61271, East Java, Indonesia
              </p>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Phone: +62 811 830 3250
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  Email: info@multidayamitra.co.id
                </p>
              </div>
              <div className="mt-5">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ruko+Jati+Kepuh+Indah+Sidoarjo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                >
                  Open in Google Maps
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
