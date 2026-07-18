import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { AdminNavMenu, AdminNavSidebar } from "@/components/admin/admin-nav-menu"

type AdminShellProps = {
  active: string
  eyebrow: string
  title: string
  children: ReactNode
  actions?: ReactNode
}

export function AdminShell({ active, eyebrow, title, actions, children }: AdminShellProps) {
  return (
    <main className="min-h-dvh bg-secondary/40">
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
        <AdminNavMenu active={active} />
      </header>

      <div className="lg:flex">
        <AdminNavSidebar active={active} />

        <div className="min-w-0 flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
            <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {eyebrow}
                </p>
                <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {title}
                </h1>
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>

            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
