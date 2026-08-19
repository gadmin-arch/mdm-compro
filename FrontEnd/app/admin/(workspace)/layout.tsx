import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { AdminNavSidebar } from "@/components/admin/admin-nav-menu"
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav"
import { ThemeToggle } from "@/components/admin/theme-toggle"
import { adminFetch, type AdminUser } from "@/lib/admin-api"

export default async function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  const user = await adminFetch<AdminUser>("/profile", {}, "/admin").catch(() => null)

  return (
    <main className="min-h-dvh bg-slate-50/50 dark:bg-[#080c14]">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-[#0b0f17]/95 sm:px-6 lg:hidden print:hidden shadow-xs">
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 shadow-2xs dark:bg-slate-800">
            <Image
              src="/Logo PT MDM.png"
              alt="PT Multi Daya Mitra Logo"
              width={24}
              height={24}
              className="h-5 w-auto object-contain"
            />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-tight text-slate-900 dark:text-slate-100">
              MDM Admin
            </span>
            <span className="text-[9px] font-semibold text-slate-400">PT Multi Daya Mitra</span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      <div className="lg:flex">
        <AdminNavSidebar user={user} />

        <div className="min-w-0 flex-1">
          <div id="admin-content" className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 xl:px-10">
            {children}
          </div>
        </div>
      </div>

      <AdminBottomNav user={user} />
    </main>
  )
}
