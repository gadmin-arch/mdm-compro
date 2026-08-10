"use client"

import Link from "next/link"
import Image from "next/image"
import { BarChart3, ExternalLink, FileText, Globe2, Home, Image as ImageIcon, Link2, Menu, Newspaper, Package, Settings, Users, Archive, type LucideIcon } from "lucide-react"
import { AdminSignOutDialog } from "@/components/admin/admin-sign-out-dialog"
import { ThemeToggleRow } from "@/components/admin/theme-toggle"
import { cn } from "@/lib/utils"

export interface NavItem {
  label: string
  href: string
  key: string
  icon: LucideIcon
  disabled?: boolean
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", key: "dashboard", icon: Home },
  { label: "Analytics", href: "/admin/analytics", key: "analytics", icon: BarChart3 },
  { label: "Pages", href: "/admin/pages", key: "pages", icon: FileText },
  { label: "Navigation", href: "/admin/navigation", key: "navigation", icon: Menu },
  { label: "Services", href: "/admin/services", key: "services", icon: FileText },
  { label: "Products", href: "/admin/products", key: "products", icon: Package },
  { label: "News", href: "/admin/news", key: "news", icon: Newspaper },
  { label: "Careers", href: "/admin/careers", key: "careers", icon: Users },
  { label: "Short Links", href: "/admin/redirects", key: "redirects", icon: Link2 },
  { label: "Media", href: "/admin/media", key: "media", icon: ImageIcon },
  { label: "Users", href: "/admin/users", key: "users", icon: Users },
  { label: "Archive", href: "/admin/archive", key: "archive", icon: Archive },
  { label: "Site Settings", href: "/admin/site-settings", key: "site-settings", icon: Globe2 },
  { label: "Account", href: "/admin/settings", key: "settings", icon: Settings },
]

export function AdminNavItems({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const current = active === item.key
        const itemClass = cn(
          "relative flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
          current && "bg-primary/10 font-semibold text-foreground",
          item.disabled
            ? "cursor-not-allowed opacity-45"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )
        const indicator = current && (
          <span
            aria-hidden="true"
            className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
          />
        )

        if (item.disabled) {
          return (
            <div key={item.key} aria-disabled="true" className={itemClass}>
              {indicator}
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          )
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={itemClass}
            onClick={onNavigate}
          >
            {indicator}
            <Icon className={cn("h-4 w-4", current && "text-primary")} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}

export function AdminNavSidebar({ active }: { active: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background lg:flex print:hidden">
      <Link href="/admin" className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <Image
          src="/Logo PT MDM.png"
          alt="PT Multi Daya Mitra Logo"
          width={34}
          height={34}
          className="h-8 w-auto object-contain"
        />
        <span className="min-w-0">
          <span className="block font-display text-sm font-semibold leading-tight text-foreground">
            MDM CMS
          </span>
          <span className="block truncate text-[11px] text-muted-foreground">Content operations</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Main Menu
        </p>
        <AdminNavItems active={active} />

        <div className="mt-auto space-y-1 border-t border-border pt-3">
          <ThemeToggleRow />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            View Website
          </a>
          <AdminSignOutDialog className="w-full justify-start" />
        </div>
      </nav>
    </aside>
  )
}
