"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Archive,
  BarChart3,
  Briefcase,
  ExternalLink,
  FileText,
  Globe2,
  Home,
  Image as ImageIcon,
  Inbox,
  Layers,
  Link2,
  Menu,
  Newspaper,
  Package,
  PanelLeft,
  PanelLeftClose,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { AdminSignOutDialog } from "@/components/admin/admin-sign-out-dialog"
import { ThemeToggle } from "@/components/admin/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AdminUser } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export type UserRole = "owner" | "admin" | "user"

export interface NavItem {
  label: string
  href: string
  key: string
  icon: LucideIcon
  roles: UserRole[]
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { label: "Dashboard", href: "/admin", key: "dashboard", icon: Home, roles: ["owner", "admin", "user"] },
      { label: "Analytics", href: "/admin/analytics", key: "analytics", icon: BarChart3, roles: ["owner", "admin"] },
      { label: "Inquiries", href: "/admin/contacts", key: "contacts", icon: Inbox, roles: ["owner", "admin"] },
    ],
  },
  {
    label: "Kelola Konten",
    items: [
      { label: "News & Articles", href: "/admin/news", key: "news", icon: Newspaper, roles: ["owner", "admin", "user"] },
      { label: "Career Openings", href: "/admin/careers", key: "careers", icon: Briefcase, roles: ["owner", "admin", "user"] },
      { label: "Products", href: "/admin/products", key: "products", icon: Package, roles: ["owner", "admin", "user"] },
      { label: "Services", href: "/admin/services", key: "services", icon: Layers, roles: ["owner", "admin", "user"] },
      { label: "Pages Builder", href: "/admin/pages", key: "pages", icon: FileText, roles: ["owner", "admin"] },
      { label: "Media Library", href: "/admin/media", key: "media", icon: ImageIcon, roles: ["owner", "admin", "user"] },
    ],
  },
  {
    label: "Sistem & Pengaturan",
    items: [
      { label: "Users & Roles", href: "/admin/users", key: "users", icon: Users, roles: ["owner", "admin"] },
      { label: "Short Links & QR", href: "/admin/redirects", key: "redirects", icon: Link2, roles: ["owner", "admin"] },
      { label: "Navigation Menu", href: "/admin/navigation", key: "navigation", icon: Menu, roles: ["owner", "admin"] },
      { label: "System Archive", href: "/admin/archive", key: "archive", icon: Archive, roles: ["owner", "admin"] },
      { label: "Site Settings", href: "/admin/site-settings", key: "site-settings", icon: Globe2, roles: ["owner", "admin"] },
      { label: "Account Profile", href: "/admin/settings", key: "settings", icon: Settings, roles: ["owner", "admin", "user"] },
    ],
  },
]

export function useActiveNavKey(): string {
  const pathname = usePathname()
  const allItems = NAV_GROUPS.flatMap((g) => g.items)
  let match: NavItem | null = null
  for (const item of allItems) {
    const isMatch = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    if (isMatch && (!match || item.href.length > match.href.length)) {
      match = item
    }
  }
  return match?.key ?? ""
}

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
}

export function AdminNavItems({
  role = "user",
  collapsed = false,
  onNavigate,
}: {
  role?: UserRole
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-3 px-2">
      {NAV_GROUPS.map((group, groupIdx) => {
        const visibleItems = group.items.filter((item) => item.roles.includes(role))
        if (visibleItems.length === 0) return null

        return (
          <div key={group.label} className="flex flex-col gap-1">
            {collapsed ? (
              groupIdx > 0 && (
                <div className="my-1.5 flex justify-center">
                  <span className="h-px w-6 bg-slate-200/70 dark:bg-slate-800" />
                </div>
              )
            ) : (
              <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                {group.label}
              </p>
            )}
            {visibleItems.map((item) => {
              const Icon = item.icon
              const active = isActivePath(pathname, item.href)

              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center transition-all duration-150",
                    collapsed
                      ? "h-10 w-11 justify-center rounded-xl mx-auto"
                      : "gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold",
                    active
                      ? "bg-sky-50 text-sky-950 border border-sky-200/70 shadow-2xs dark:bg-[#0c1427] dark:text-white dark:border-sky-900/40"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
                  )}
                >
                  <Icon
                    className={cn(
                      "shrink-0 transition-colors",
                      collapsed ? "h-5 w-5" : "h-4.5 w-4.5",
                      active
                        ? "text-sky-600 dark:text-[#00a8ff] stroke-[2.25]"
                        : "text-slate-400 stroke-[1.75] group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-200",
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )

              return collapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                linkContent
              )
            })}
          </div>
        )
      })}
    </nav>
  )
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      href="/admin"
      className={cn(
        "flex items-center group transition-colors",
        collapsed ? "justify-center py-3.5" : "gap-3 px-4 py-3.5",
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100 shadow-2xs transition-all group-hover:scale-105 dark:border-slate-700/60 dark:bg-slate-800">
        <Image
          src="/Logo PT MDM.png"
          alt="PT Multi Daya Mitra"
          width={28}
          height={28}
          className="h-5.5 w-auto object-contain"
        />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            MDM Admin
          </span>
          <span className="block truncate text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            PT Multi Daya Mitra
          </span>
        </span>
      )}
    </Link>
  )
}

function SidebarFooter({
  user,
  collapsed,
}: {
  user?: AdminUser | null
  collapsed: boolean
}) {
  const name = user?.name || "MDM User"
  const initials = (name.replace(/[^a-zA-Z ]/g, "").trim().split(/\s+/).map((n) => n[0]).join("") || "MD").substring(0, 2).toUpperCase()
  const role = user?.role || "user"

  return (
    <div className="mt-auto flex flex-col gap-2 px-2.5 pb-2.5">
      <Separator className="my-1" />

      {/* View Website Link */}
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className={cn(
          "flex items-center rounded-2xl text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100",
          collapsed ? "h-10 w-11 justify-center mx-auto" : "gap-2.5 px-3 py-2",
        )}
        title="View live website"
      >
        <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
        {!collapsed && <span>View Website</span>}
      </a>

      {/* User Profile Card */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900/80",
          collapsed && "justify-center p-1.5",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[11px] font-black text-white shadow-xs"
            title={user?.email || user?.name || "Active Session"}
          >
            {initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 text-left">
              <span className="block truncate text-xs font-black text-slate-900 dark:text-slate-100" title={name}>
                {name}
              </span>
              <span className="inline-block rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {role}
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <AdminSignOutDialog iconOnly />
          </div>
        )}
      </div>
    </div>
  )
}

function getSidebarCollapsedSnapshot() {
  try {
    return localStorage.getItem("mdm_admin_sidebar_collapsed") === "true"
  } catch {
    return false
  }
}

const emptySidebarSubscribe = () => () => {}

export function AdminNavSidebar({ user }: { user?: AdminUser | null }) {
  const isClient = useSyncExternalStore(emptySidebarSubscribe, () => true, () => false)
  const [collapsedState, setCollapsedState] = useState<boolean | null>(null)
  const role = user?.role || "user"

  const collapsed = collapsedState ?? (isClient ? getSidebarCollapsedSnapshot() : false)

  const toggleCollapsed = () => {
    const next = !collapsed
    setCollapsedState(next)
    try {
      localStorage.setItem("mdm_admin_sidebar_collapsed", String(next))
    } catch {
      // Ignore localStorage errors
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 ease-in-out dark:border-slate-800/80 dark:bg-[#0b0f17] z-30 lg:flex print:hidden",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <SidebarBrand collapsed={collapsed} />
        <Separator />
        <div className="flex-1 overflow-y-auto py-4">
          <AdminNavItems role={role} collapsed={collapsed} />
        </div>
        <SidebarFooter user={user} collapsed={collapsed} />
        <Separator />
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className="m-2 justify-center text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          aria-label={collapsed ? "Lebarkan menu" : "Ciutkan menu"}
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="mr-2 h-4 w-4" />
              <span className="text-xs font-semibold">Ciutkan</span>
            </>
          )}
        </Button>
      </aside>
    </TooltipProvider>
  )
}
