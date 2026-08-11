import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { AdminNavSidebar } from "@/components/admin/admin-nav-menu"
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav"
import { ThemeToggle } from "@/components/admin/theme-toggle"

// The workspace chrome lives in the layout, not in each page: Next keeps a
// layout mounted across navigations inside its segment, so moving between
// admin pages re-renders only the content — the sidebar and bottom nav stay
// put and never reach the wire again. Auth screens (login, password reset)
// sit outside this group and stay chrome-free.
export default function AdminWorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-secondary/40">
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Mobile top bar — the desktop logo lives inside the sidebar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6 lg:hidden print:hidden">
        <Link href="/admin" className="flex min-w-0 items-center gap-3">
          <Image
            src="/Logo PT MDM.png"
            alt="PT Multi Daya Mitra Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
          />
          <span className="min-w-0">
            <span className="block font-display text-base font-semibold text-foreground">MDM CMS</span>
            <span className="block truncate text-xs text-muted-foreground">Content operations</span>
          </span>
        </Link>
        {/* Navigation lives in the bottom bar on this breakpoint. */}
        <ThemeToggle />
      </header>

      <div className="lg:flex">
        <AdminNavSidebar />

        <div className="min-w-0 flex-1">
          {/* pb-24 keeps content clear of the floating bottom nav on mobile. */}
          <div id="admin-content" className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8 xl:px-10">
            {children}
          </div>
        </div>
      </div>

      <AdminBottomNav />
    </main>
  )
}
