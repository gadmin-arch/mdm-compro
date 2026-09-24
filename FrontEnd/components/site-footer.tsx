import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { getSiteSettings } from "@/lib/cms"
import { container } from "@/lib/layout"
import { SocialButton } from "@/components/social-icons"
import { BilingualText } from "@/components/cms/content-language"

const footerNav = [
  {
    title: "EN: Company\nID: Perusahaan",
    links: [
      { label: "EN: About PT MDM\nID: Tentang PT MDM", href: "/about" },
      { label: "EN: Services & Solutions\nID: Layanan & Solusi", href: "/services" },
      { label: "EN: Products & Partners\nID: Produk & Mitra", href: "/products" },
      { label: "EN: News & Insights\nID: Berita & Artikel", href: "/news" },
      { label: "EN: Careers\nID: Karir", href: "/career" },
      { label: "EN: Contact Us\nID: Hubungi Kami", href: "/contact" },
    ],
  },
  {
    title: "EN: Services & Solutions\nID: Layanan & Solusi",
    links: [
      { label: "EN: Electrical Construction & Installation\nID: Konstruksi & Instalasi Elektrikal", href: "/services/electrical-construction-installation" },
      { label: "EN: Electrical Maintenance & Servicing\nID: Pemeliharaan & Perawatan Sistem Kelistrikan", href: "/services/electrical-maintenance-service" },
      { label: "EN: Automation Solutions & Services\nID: Solusi & Layanan Otomasi Industri", href: "/services/automation-solutions-services" },
      { label: "EN: Inspection, Testing & Commissioning\nID: Inspeksi, Pengujian & Commissioning", href: "/services/inspection-testing-commissioning" },
      { label: "EN: Mechanical Services & Supplies\nID: Layanan Mekanikal & Pengadaan Industri", href: "/services/mechanical-services-supplies" },
    ],
  },
  {
    title: "EN: Products & Partners\nID: Produk & Mitra",
    links: [
      { label: "EN: Rittal Authorized Distributor\nID: Distributor Resmi Rittal", href: "/products/rittal-distributor" },
      { label: "EN: Schneider Electric System Integrator\nID: System Integrator Schneider Electric", href: "/products/schneider-integrator" },
      { label: "EN: Electrical Distribution\nID: Distribusi Kelistrikan", href: "/products/electrical-distribution" },
      { label: "EN: Automation & Control\nID: Otomasi & Kontrol Industri", href: "/products/automation-control" },
      { label: "EN: Enclosure & Climate Control Systems\nID: Sistem Enclosure & Kontrol Suhu Industri", href: "/products/enclosure-climate-control" },
      { label: "EN: Power Quality Systems & Active Filters\nID: Sistem Kualitas Daya & Filter Harmonisa Aktif", href: "/products/power-quality" },
      { label: "EN: Fire Alarm & Suppression Systems\nID: Sistem Fire Alarm & Pemadam Kebakaran", href: "/products/fire-alarm-products" },
    ],
  },
]

export async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="border-t border-border bg-background">
      <div className={container("py-14")}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
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
              <BilingualText text={settings.footerDescription} />
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              {settings.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="max-w-sm">
                    <BilingualText text={settings.address} />
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">
                    <BilingualText text="EN: WhatsApp Direct:\nID: Kontak WhatsApp:" />
                  </span>
                  <div className="flex flex-col gap-1 text-xs sm:text-sm">
                    <a
                      href="https://wa.me/628118303250"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:text-emerald-600 hover:underline transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-muted-foreground font-normal">
                        <BilingualText text="EN: Technical Expert:\nID: Konsultasi Teknis:" />
                      </span>
                      +62 811-8303-250
                    </a>
                    <a
                      href="https://wa.me/6282140074122"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:text-emerald-600 hover:underline transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-muted-foreground font-normal">
                        <BilingualText text="EN: Sales & Inquiry:\nID: Penjualan & Penawaran:" />
                      </span>
                      +62 821-4007-4122
                    </a>
                  </div>
                </div>
              </li>
              {settings.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-foreground">
                    <span className="text-muted-foreground font-normal">
                      <BilingualText text="EN: Office:\nID: Kantor:" />{" "}
                    </span>
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
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {settings.socials.map((social) => (
                  <SocialButton
                    key={`${social.label}-${social.url}`}
                    social={social}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8 xl:gap-12">
            {footerNav.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  <BilingualText text={column.title} />
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap"
                      >
                        <BilingualText text={link.label} />
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
            &copy; {new Date().getFullYear()} PT Multi Daya Mitra.{" "}
            <BilingualText text="EN: All rights reserved.\nID: Seluruh hak cipta dilindungi undang-undang." />
          </p>
          <p className="font-medium uppercase tracking-[0.14em]">
            <BilingualText text={settings.tagline} />
          </p>
        </div>
      </div>
    </footer>
  )
}
