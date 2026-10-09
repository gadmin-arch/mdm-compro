"use client"

import { LocalizedLink as Link } from "@/components/cms/localized-link"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import type { FormEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Locale } from "@/lib/i18n"
import { container } from "@/lib/layout"
import { resolveText } from "@/lib/localized"
import { CONTACT_DEFAULTS, STALE_MAP_EMBEDS, items, prop } from "@/lib/section-defaults"

type Office = {
  name: string
  address: string
  phone?: string
  fax?: string
  email?: string
  mapEmbedUrl?: string
}

// Rendered by the "contact" builder section and the /contact fallback page.
// Every text, phone number and office comes from `props` (the section's
// fields or the legacy page content); CONTACT_DEFAULTS only fill keys the
// page has never set.
export function Contact({ props = {}, lang }: { props?: Record<string, unknown>; lang: Locale }) {
  const isIndonesian = lang === "id"
  const t = (name: string) => resolveText(prop(props, name, CONTACT_DEFAULTS[name]), lang)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  // When the form became interactive, used to measure how long the visitor had
  // it open. Scripts that fill and post instantly fail that check. Stamped in
  // an effect because reading the clock during render is impure.
  const openedAt = useRef(0)
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  const generalEmail = t("email")
  const generalPhone = t("phone")
  const technicalPhone = t("technicalPhone")
  const salesPhone = t("salesPhone")

  const offices: Office[] = items(props, "offices", CONTACT_DEFAULTS.offices as Record<string, unknown>[])
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

  const officesWithMap = offices.filter((o) => o.mapEmbedUrl)
  const [activeMapIndex, setActiveMapIndex] = useState(0)

  const cleanTechPhone = technicalPhone.replace(/[^0-9]/g, "")
  const cleanSalesPhone = salesPhone.replace(/[^0-9]/g, "")

  const techWaText = isIndonesian
    ? "Halo PT Multi Daya Mitra, saya ingin berkonsultasi dengan Tim Ahli Teknis mengenai solusi rekayasa dan layanan kelistrikan."
    : "Hello PT Multi Daya Mitra, I would like to consult with a Technical Expert regarding your engineering solutions and services."
  const salesWaText = isIndonesian
    ? "Halo PT Multi Daya Mitra, saya ingin menanyakan informasi harga dan ketersediaan produk."
    : "Hello PT Multi Daya Mitra, I would like to inquire about product pricing and availability."

  const channels = [
    {
      icon: Phone,
      title: isIndonesian ? "WhatsApp Ahli Teknis" : "Technical Expert WhatsApp",
      body: technicalPhone,
      href: `https://wa.me/${cleanTechPhone}?text=${encodeURIComponent(techWaText)}`,
    },
    {
      icon: Mail,
      title: isIndonesian ? "Email Penjualan & Umum" : "Sales & General Email",
      body: generalEmail,
      href: `mailto:${generalEmail}`,
    },
    {
      icon: Phone,
      title: isIndonesian ? "Telepon Kantor Pusat" : "Head Office Phone",
      body: generalPhone,
      href: `tel:${generalPhone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: Phone,
      title: isIndonesian ? "WhatsApp Penjualan" : "Sales WhatsApp",
      body: salesPhone,
      href: `https://wa.me/${cleanSalesPhone}?text=${encodeURIComponent(salesWaText)}`,
    },
  ]

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    // Kept before the await: React clears event.currentTarget once the
    // handler yields, and reset() on null would hide the success message.
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const apiBase =
      process.env.NEXT_PUBLIC_CMS_API_BASE_URL ?? "http://localhost:8080/api/v1/public"

    const response = await fetch(`${apiBase}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        company: form.get("company"),
        subject: form.get("subject"),
        message: form.get("message"),
        // Spam traps — the honeypot stays empty for real visitors, and the
        // server drops anything submitted implausibly fast.
        website: form.get("website"),
        // 0 means "unknown"; the server only enforces the floor above zero.
        formMs: openedAt.current ? Date.now() - openedAt.current : 0,
      }),
    }).catch(() => null)

    if (response?.ok) {
      formElement.reset()
      setStatus("success")
      window.mdmTrack?.("contact_form_submit")
      return
    }
    setStatus("error")
  }

  return (
    <section className="bg-secondary/40">
      <div className={container("py-20")}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="relative bg-primary p-8 text-primary-foreground sm:p-10 lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("eyebrow")}
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  {t("title")}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
                  {t("description")}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 self-start"
              >
                <Link href={`mailto:${generalEmail}`}>
                  {isIndonesian ? "Email Tim Kami" : "Email our team"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl pointer-events-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:col-span-7">
              {channels.map((channel) => {
                const Icon = channel.icon
                const content = (
                  <>
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                      {channel.title.includes("Fax") ? (
                        <Icon className="h-5 w-5 rotate-90" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </span>
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {channel.title}
                      </p>
                      <p className="mt-1.5 font-display text-base font-medium text-foreground">
                        {channel.body}
                      </p>
                    </div>
                  </>
                )

                return channel.href ? (
                  <Link
                    key={channel.title}
                    href={channel.href}
                    className="flex flex-col bg-card p-7 transition-colors hover:bg-secondary/40"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={channel.title}
                    className="flex flex-col bg-card p-7"
                  >
                    {content}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Office Locations Cards */}
        <div className="mt-16">
          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("officesTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("officesDescription")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {offices.map((office, index) => (
              <div key={`${index}-${office.name}`} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {office.name}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-grow">
                  {office.address}
                </p>
                
                <div className="mt-6 space-y-2.5 border-t border-border/60 pt-4 text-xs">
                  {office.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>{isIndonesian ? "Telepon: " : "Phone: "}{office.phone}</span>
                    </div>
                  )}
                  {office.fax && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="rotate-90 h-3.5 w-3.5 text-primary" />
                      <span>Fax: {office.fax}</span>
                    </div>
                  )}
                  {office.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <a href={`mailto:${office.email}`} className="hover:underline">
                        {office.email}
                      </a>
                    </div>
                  )}
                </div>
                
                {office.mapEmbedUrl && (
                  <div className="mt-5">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office.name} ${office.address}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                    >
                      {isIndonesian ? "Petunjuk Arah" : "Get Directions"}
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Maps switcher */}
        {officesWithMap.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-secondary/30 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">
                {isIndonesian ? "Peta Interaktif" : "Interactive Maps"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {officesWithMap.map((office, idx) => (
                  <button
                    key={`${idx}-${office.name}`}
                    onClick={() => setActiveMapIndex(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      activeMapIndex === idx
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
                src={officesWithMap[Math.min(activeMapIndex, officesWithMap.length - 1)].mapEmbedUrl}
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

        {/* Contact Inquiry Form */}
        <div className="mt-16">
          <div className="text-center sm:text-left mb-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("formTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("formDescription")}
            </p>
          </div>

          <form
            onSubmit={submitContact}
            className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-2"
          >
            {/* Honeypot: off-screen rather than display:none so scripted
                fillers still see it, and hidden from people and screen
                readers. Any value here marks the submission as a bot. */}
            <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website (leave blank)</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="name">
                {isIndonesian ? "Nama Lengkap" : "Name"}
              </label>
              <Input id="name" name="name" required className="mt-2" placeholder={isIndonesian ? "Nama lengkap Anda" : "Your full name"} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <Input id="email" name="email" type="email" required className="mt-2" placeholder="name@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="phone">
                {isIndonesian ? "Nomor Telepon" : "Phone"}
              </label>
              <Input id="phone" name="phone" className="mt-2" placeholder="+62 812-..." />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="company">
                {isIndonesian ? "Perusahaan" : "Company"}
              </label>
              <Input id="company" name="company" className="mt-2" placeholder={isIndonesian ? "Nama perusahaan atau institusi" : "Company or organization name"} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="subject">
                {isIndonesian ? "Subjek" : "Subject"}
              </label>
              <Input id="subject" name="subject" required className="mt-2" placeholder={isIndonesian ? "Topik konsultasi atau pengadaan" : "Consultation or procurement topic"} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="message">
                {isIndonesian ? "Pesan" : "Message"}
              </label>
              <Textarea id="message" name="message" required className="mt-2 min-h-32" placeholder={isIndonesian ? "Jelaskan kebutuhan teknis, lokasi, dan detail proyek Anda..." : "Describe your technical requirements, facility location, and project timeline..."} />
            </div>
            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
              <Button type="submit" disabled={status === "submitting"}>
                {status === "submitting"
                  ? (isIndonesian ? "Mengirimkan..." : "Sending...")
                  : (isIndonesian ? "Kirim Pesan" : "Send Inquiry")}
              </Button>
              {status === "success" && (
                <p className="text-sm text-muted-foreground">
                  {isIndonesian
                    ? "Pesan Anda telah berhasil dikirim. Tim kami akan segera merespons."
                    : "Your inquiry has been sent."}
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive">
                  {isIndonesian
                    ? "Tidak dapat mengirim pesan saat ini. Silakan hubungi kami via email langsung."
                    : "Unable to send right now. Please email us directly."}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
