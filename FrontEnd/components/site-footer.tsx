import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { getSiteSettings } from "@/lib/cms"

const footerNav = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "News", href: "/news" },
      { label: "Career", href: "/career" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Electrical Services", href: "/services" },
      { label: "Industrial Automation", href: "/services" },
      { label: "Fire Alarm Systems", href: "/services" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Testing Equipment", href: "/products/testing-equipment" },
      { label: "Protection Relay", href: "/products/protection-relay" },
      { label: "Instrumentation", href: "/products/instrumentation" },
    ],
  },
]

export async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/Logo PT MDM.png"
                alt="PT Multi Daya Mitra Logo"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                PT Multi Daya Mitra
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {settings.footerDescription}
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="max-w-sm">{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-foreground">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`mailto:${settings.email}`} className="transition-colors hover:text-foreground">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
            {settings.socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-3">
                {settings.socials.map((social) => (
                  <li key={`${social.label}-${social.url}`}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} PT Multi Daya Mitra. All rights reserved.
          </p>
          <p className="font-medium uppercase tracking-[0.14em]">{settings.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
