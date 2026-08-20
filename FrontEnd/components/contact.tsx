"use client"

import Link from "next/link"
import { ArrowRight, Globe, Mail, MapPin, Phone } from "lucide-react"
import type { FormEvent } from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { PageContent } from "@/lib/cms"
import { container } from "@/lib/layout"

interface Office {
  name: string
  address: string
  phone?: string
  fax?: string
  email?: string
  mapEmbedUrl?: string
}

export function Contact({ page }: { page?: PageContent | null }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  // When the form became interactive, used to measure how long the visitor had
  // it open. Scripts that fill and post instantly fail that check. Stamped in
  // an effect because reading the clock during render is impure.
  const openedAt = useRef(0)
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  const content = page?.content ?? {}
  const generalEmail = String(content.email ?? "info@multidayamitra.co.id")
  const generalPhone = String(content.phone ?? "+62 31 592 1256")
  const salesPhone = String(content.salesPhone ?? content.whatsappPhone ?? "+62 811-8303-250")

  const offices: Office[] = Array.isArray(content.offices)
    ? (content.offices as Office[])
    : [
        {
          name: "Head Office (Surabaya)",
          address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
          phone: "+62 31 592 1256",
          fax: "+62 31 591 7845",
          email: "info@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
        },
        {
          name: "Engineering Office & Workshop",
          address: "Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia",
          phone: "+62 811-8303-250",
          email: "sales@multidayamitra.co.id",
          mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
        }
      ]

  const officesWithMap = offices.filter((o) => o.mapEmbedUrl)
  const [activeMapIndex, setActiveMapIndex] = useState(0)

  const cleanSalesPhone = salesPhone.replace(/[^0-9]/g, "")

  const channels = [
    {
      icon: Phone,
      title: "WhatsApp / Sales Hotline",
      body: salesPhone,
      href: `https://wa.me/${cleanSalesPhone}?text=${encodeURIComponent("Hello PT Multi Daya Mitra, I would like to inquire about your engineering solutions and services.")}`,
    },
    {
      icon: Mail,
      title: "Sales & General Email",
      body: generalEmail,
      href: `mailto:${generalEmail}`,
    },
    {
      icon: Phone,
      title: "Head Office Phone",
      body: generalPhone,
      href: `tel:${generalPhone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: Globe,
      title: "Website",
      body: "multidayamitra.co.id",
      href: "https://multidayamitra.co.id",
    },
  ]

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    const form = new FormData(event.currentTarget)
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
      event.currentTarget.reset()
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
                  Let&apos;s talk
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Plan your next electrical or automation project with us.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
                  Tell us about your facility and the outcomes you&apos;re after — our
                  engineers will get back with a tailored scope, approach, and quote.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 self-start"
              >
                <Link href={`mailto:${generalEmail}`}>
                  Email our team
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
                      {channel.title === "General Fax" ? (
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
              Our Locations
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Visit or contact any of our local offices for direct assistance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            {offices.map((office) => (
              <div key={office.name} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-xs">
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
                      <span>Phone: {office.phone}</span>
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
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.name + " " + office.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                    >
                      Get Directions
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
                Interactive Maps
              </h3>
              <div className="flex flex-wrap gap-2">
                {officesWithMap.map((office, idx) => (
                  <button
                    key={office.name}
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
                src={officesWithMap[activeMapIndex].mapEmbedUrl}
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
              Send us a Message
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form below and our team will follow up within 24 hours.
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
                Name
              </label>
              <Input id="name" name="name" required className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Email
              </label>
              <Input id="email" name="email" type="email" required className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="phone">
                Phone
              </label>
              <Input id="phone" name="phone" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="company">
                Company
              </label>
              <Input id="company" name="company" className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="subject">
                Subject
              </label>
              <Input id="subject" name="subject" required className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="message">
                Message
              </label>
              <Textarea id="message" name="message" required className="mt-2 min-h-32" />
            </div>
            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center">
              <Button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send Inquiry"}
              </Button>
              {status === "success" && (
                <p className="text-sm text-muted-foreground">Your inquiry has been sent.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-destructive">Unable to send right now. Please email us directly.</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
