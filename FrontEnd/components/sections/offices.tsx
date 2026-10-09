"use client"

import { useState } from "react"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import { STALE_MAP_EMBEDS, items, prop } from "@/lib/section-defaults"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"
import { container } from "@/lib/layout"
import { useContentLanguage } from "@/components/cms/content-language"

// Only render embeds that are really Google Maps iframes — the URL is
// admin-provided free text.
function isMapEmbedUrl(url: string) {
  return url.startsWith("https://www.google.com/maps/embed")
}

// Mirrors the "Our Offices" block of the original About component, plus the
// interactive maps switcher from the Contact page.
export function OfficesSection({ props, lang: pageLang }: { props: Record<string, unknown>; lang?: Locale }) {
  const { lang: contextLang } = useContentLanguage()
  const lang = pageLang ?? contextLang
  const isIndonesian = lang === "id"
  const title = resolveText(prop(props, "title"), lang)
  const description = resolveText(prop(props, "description"), lang)
  const offices = items(props, "items")
    .map((office) => {
      const mapEmbedUrl = String(office.mapEmbedUrl ?? "")
      const stale = Object.keys(STALE_MAP_EMBEDS).find((placeId) => mapEmbedUrl.includes(placeId))
      return {
        name: resolveText(office.name, lang),
        address: resolveText(office.address, lang),
        phone: String(office.phone ?? ""),
        fax: String(office.fax ?? ""),
        email: String(office.email ?? ""),
        mapEmbedUrl: stale ? STALE_MAP_EMBEDS[stale] : mapEmbedUrl,
      }
    })
    .filter((office) => office.name || office.address)
  const officesWithMap = offices.filter((office) => office.mapEmbedUrl && isMapEmbedUrl(office.mapEmbedUrl))
  const [activeMapIndex, setActiveMapIndex] = useState(0)
  if (offices.length === 0) return null

  const activeMap = officesWithMap[Math.min(activeMapIndex, officesWithMap.length - 1)]

  return (
    <section className="border-t border-border/60 bg-secondary/15 py-16">
      <div className={container()}>
        <div className="text-center md:text-left">
          {title && (
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {offices.map((office, index) => (
            <div key={`${office.name}-${index}`} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                {office.name}
              </h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-muted-foreground">
                {office.address}
              </p>
              <div className="mt-6 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                {office.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    {isIndonesian ? "Telepon: " : "Phone: "}{office.phone}
                  </p>
                )}
                {office.fax && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 rotate-90 text-primary" />
                    Fax: {office.fax}
                  </p>
                )}
                {office.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    Email: {office.email}
                  </p>
                )}
              </div>
              {office.address && (
                <div className="mt-5">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office.name} ${office.address}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                  >
                    {isIndonesian ? "Buka di Google Maps" : "Open in Google Maps"}
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {activeMap && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-secondary/30 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
                {isIndonesian ? "Peta Interaktif" : "Interactive Maps"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {officesWithMap.map((office, idx) => (
                  <button
                    key={`${office.name}-${idx}`}
                    onClick={() => setActiveMapIndex(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      activeMap === office
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {office.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full h-[350px] md:h-[450px]">
              <iframe
                src={activeMap.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
