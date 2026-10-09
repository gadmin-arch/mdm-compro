import Image from "next/image"
import { Compass, Target } from "lucide-react"
import { container } from "@/lib/layout"
import { prop, str } from "@/lib/sections"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"

export function AboutStorySection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const eyebrow = resolveText(prop(props, "eyebrow", "EN: About PT Multi Daya Mitra\nID: Tentang PT Multi Daya Mitra"), lang)
  const title = resolveText(prop(props, "title", "EN: Integrated electrical, automation & safety solutions for heavy industry.\nID: Solusi terintegrasi elektrikal, otomasi & keselamatan untuk industri berat."), lang)
  const overview = resolveText(prop(props, "overview", "EN: Established in 2012, PT Multi Daya Mitra delivers integrated electrical, industrial automation, and fire alarm solutions across Indonesia with 14+ years of industrial experience, 400+ corporate clients, and over 200 engineers and professionals.\nID: Didirikan pada tahun 2012, PT Multi Daya Mitra menghadirkan solusi terintegrasi di bidang kelistrikan, otomasi industri, dan proteksi kebakaran di seluruh Indonesia dengan pengalaman industri 14+ tahun, 400+ klien korporasi, serta lebih dari 200 insinyur dan tenaga profesional."), lang)
  const description = resolveText(prop(props, "description", "EN: From our headquarters in East Java and branch network across Indonesia, we serve heavy industries including power generation, oil & gas, petrochemicals, manufacturing, food & beverage, cement, pharmaceuticals, and critical infrastructure.\nID: Berpusat di Jawa Timur dengan jangkauan proyek di seluruh Indonesia, kami melayani industri berat termasuk pembangkit listrik, migas, petrokimia, manufaktur, makanan & minuman, semen, farmasi, dan infrastruktur strategis."), lang)
  const tagline = resolveText(prop(props, "tagline", "EN: Always Make an IMPACT — Powering Solution, Creating Impact\nID: Always Make an IMPACT — Solusi Kelistrikan Andal, Menciptakan Dampak Nyata"), lang)
  const established = str(props, "established", "2012")
  const experienceYears = resolveText(prop(props, "experienceYears", "14+ Years"), lang)
  const clientCount = str(props, "clientCount", "400+")
  const teamCount = str(props, "teamCount", "200+")
  const vision = resolveText(prop(props, "vision", "EN: Global Electrical, Automation and Fire Alarm Services Company.\nID: Perusahaan Jasa Layanan Kelistrikan, Otomasi, dan Sistem Fire Alarm Kelas Dunia."), lang)
  const mission = resolveText(prop(props, "mission", "EN: Mutual Partnership and Professionalism in delivering every engineering engagement.\nID: Menjalin Kemitraan Strategis dan Profesionalisme Tinggi dalam Setiap Layanan Rekayasa Teknik."), lang)
  const imageUrl = str(props, "imageUrl", "/uploads/automation-project.jpg")
  const imageAlt = resolveText(prop(props, "imageAlt", "PT Multi Daya Mitra industrial automation and electrical team"), lang)

  const establishedText = established.includes("EN:")
    ? established
    : `EN: Established ${established}\nID: Berdiri Sejak ${established}`

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-20")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-secondary shadow-md">
              <Image
                src={imageUrl || "/uploads/automation-project.jpg"}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  {resolveText(establishedText, lang)}
                </p>
                <p className="mt-1 font-display text-lg font-semibold leading-snug">
                  {tagline}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">
                  {eyebrow}
                </span>
              </p>
            )}
            {title && (
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                {title}
              </h2>
            )}
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              {overview && (
                <p>
                  {overview}
                </p>
              )}
              {description && (
                <p>
                  {description}
                </p>
              )}
            </div>

            {/* 4 Key Numerical Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 border-y border-border/70 py-6">
              <div>
                <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{experienceYears}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {resolveText("EN: Business Experience\nID: Pengalaman Industri", lang)}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{clientCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {resolveText("EN: Corporate Clients\nID: Klien Korporasi", lang)}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{teamCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {resolveText("EN: Staff & Engineers\nID: Tim Ahli & Insinyur", lang)}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground sm:text-3xl">{established}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {resolveText("EN: Founded in Surabaya\nID: Berdiri di Surabaya", lang)}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {vision && (
                <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Compass className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      {resolveText("EN: Our Vision\nID: Visi Kami", lang)}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {vision}
                  </p>
                </div>
              )}

              {mission && (
                <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/30 text-foreground">
                      <Target className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
                      {resolveText("EN: Our Mission\nID: Misi Kami", lang)}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {mission}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
