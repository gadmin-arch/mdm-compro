import type { Career, MenuItem } from "@/lib/cms"

// Constants and helpers used both by the data layer in lib/cms.ts and by
// client components. Client components import them from here, never from
// lib/cms.ts: that module builds the catalog fallbacks (every product,
// service, news post and career) at import time, and everything a client
// component imports ships to every visitor's browser.

// Mirrors model.SystemPageKeys in the backend: pages the public site routes
// to directly. Their slugs are fixed and they cannot be archived.
export const systemPageKeys = ["home", "about", "contact", "services", "products", "news", "career"]

export function isSystemPageKey(key: string): boolean {
  return systemPageKeys.includes(key)
}

// Mirrors model.DefaultMenuItems in the backend.
export const defaultMenuItems: MenuItem[] = [
  { id: "home", label: "EN: Home\nID: Beranda", href: "/", kind: "system", visible: true },
  { id: "about", label: "EN: About Us\nID: Tentang Kami", href: "/about", kind: "system", visible: true },
  { id: "services", label: "EN: Services\nID: Layanan", href: "/services", kind: "system", auto: "services", visible: true },
  { id: "products", label: "EN: Products\nID: Produk", href: "/products", kind: "system", auto: "products", visible: true },
  { id: "news", label: "EN: News\nID: Berita", href: "/news", kind: "system", visible: true },
  { id: "career", label: "EN: Careers\nID: Karir", href: "/career", kind: "system", visible: true },
  { id: "contact", label: "EN: Contact Us\nID: Hubungi Kami", href: "/contact", kind: "system", visible: true },
]

export function formatDate(value?: string) {
  if (!value) return "Unscheduled"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unscheduled"
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(date)
}

export function isCareerClosed(career?: Career | null): boolean {
  if (!career) return false
  if (career.status === "archived" || career.status === "closed") return true
  if (career.deadline) {
    const deadlineTime = new Date(career.deadline).getTime()
    if (!Number.isNaN(deadlineTime) && deadlineTime < Date.now()) {
      return true
    }
  }
  return false
}

export function employmentTypeLabel(value: string) {
  const normalized = value.toLowerCase().replace(/[- ]/g, "_")
  if (normalized === "full_time") return "EN: Full Time\nID: Penuh Waktu"
  if (normalized === "part_time") return "EN: Part Time\nID: Paruh Waktu"
  if (normalized === "contract") return "EN: Contract\nID: Kontrak"
  if (normalized === "internship") return "EN: Internship\nID: Magang"
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}
