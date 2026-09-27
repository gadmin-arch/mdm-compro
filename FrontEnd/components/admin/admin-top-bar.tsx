"use client"

import { useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { ExternalLink, Globe } from "lucide-react"
import { useContentLanguage } from "@/components/cms/content-language"
import { ThemeToggle } from "@/components/admin/theme-toggle"
import { AdminSignOutDialog } from "@/components/admin/admin-sign-out-dialog"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

export function AdminLanguageToggle({
  className,
}: {
  className?: string
  compact?: boolean
}) {
  const { lang, setLang } = useContentLanguage()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const activeLang = mounted ? lang : "id"

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 text-xs font-semibold dark:border-slate-800 dark:bg-slate-900/90 shadow-2xs",
        className
      )}
      role="group"
      aria-label="Pilih bahasa pengeditan konten"
      suppressHydrationWarning
    >
      <button
        type="button"
        onClick={() => setLang("id")}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
          activeLang === "id"
            ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
            : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
        )}
        title="Bahasa Indonesia (ID)"
        aria-pressed={activeLang === "id"}
        suppressHydrationWarning
      >
        ID
      </button>

      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-md px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
          activeLang === "en"
            ? "bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-slate-50"
            : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
        )}
        title="English (EN)"
        aria-pressed={activeLang === "en"}
        suppressHydrationWarning
      >
        EN
      </button>
    </div>
  )
}

function resolveSectionName(pathname: string): { section: string; sub?: string } {
  if (pathname === "/admin") return { section: "Dashboard" }
  if (pathname.startsWith("/admin/pages")) return { section: "Content Management", sub: "Pages Builder" }
  if (pathname.startsWith("/admin/services")) return { section: "Content Management", sub: "Services" }
  if (pathname.startsWith("/admin/products")) return { section: "Content Management", sub: "Products" }
  if (pathname.startsWith("/admin/news")) return { section: "Content Management", sub: "News & Articles" }
  if (pathname.startsWith("/admin/careers")) return { section: "Content Management", sub: "Career Openings" }
  if (pathname.startsWith("/admin/media")) return { section: "Content Management", sub: "Media Library" }
  if (pathname.startsWith("/admin/contacts")) return { section: "Main", sub: "Inquiries" }
  if (pathname.startsWith("/admin/analytics")) return { section: "Main", sub: "Analytics" }
  if (pathname.startsWith("/admin/users")) return { section: "System & Settings", sub: "Users & Roles" }
  if (pathname.startsWith("/admin/redirects")) return { section: "System & Settings", sub: "Short Links & QR" }
  if (pathname.startsWith("/admin/navigation")) return { section: "System & Settings", sub: "Navigation Menu" }
  if (pathname.startsWith("/admin/archive")) return { section: "System & Settings", sub: "System Archive" }
  if (pathname.startsWith("/admin/site-settings")) return { section: "System & Settings", sub: "Site Settings" }
  if (pathname.startsWith("/admin/settings")) return { section: "System & Settings", sub: "Account Profile" }
  return { section: "Admin Workspace" }
}

export function AdminTopBar(_props?: { user?: unknown }) {
  const pathname = usePathname()
  const { section, sub } = resolveSectionName(pathname)

  return (
    <header className="sticky top-0 z-20 hidden lg:flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0b0f17]/90 shadow-2xs print:hidden">
      {/* Left: Section navigation hint */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-muted-foreground">{section}</span>
        {sub && (
          <>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-bold text-foreground">{sub}</span>
          </>
        )}
      </div>

      {/* Right: Language switch menu, View website link, ThemeToggle, User */}
      <div className="flex items-center gap-3">
        {/* Switch Bahasa in the top menu */}
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <AdminLanguageToggle />
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* View live public website */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title="Buka Website Publik (Tab Baru)"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Website</span>
        </a>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User quick status & sign out */}
        <div className="flex items-center gap-1.5 pl-1">
          <AdminSignOutDialog iconOnly />
        </div>
      </div>
    </header>
  )
}
