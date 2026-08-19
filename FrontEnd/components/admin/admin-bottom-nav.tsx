"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Briefcase, FileText, Home, Layers, Menu, Newspaper, Package } from "lucide-react"
import { AdminNavItems, useActiveNavKey } from "@/components/admin/admin-nav-menu"
import { AdminSignOutDialog } from "@/components/admin/admin-sign-out-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { AdminUser } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export function AdminBottomNav({ user }: { user?: AdminUser | null }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const active = useActiveNavKey()
  const role = user?.role || "user"

  const quickLinks =
    role === "user"
      ? [
          { label: "Home", href: "/admin", key: "dashboard", icon: Home },
          { label: "News", href: "/admin/news", key: "news", icon: Newspaper },
          { label: "Careers", href: "/admin/careers", key: "careers", icon: Briefcase },
          { label: "Products", href: "/admin/products", key: "products", icon: Package },
          { label: "Services", href: "/admin/services", key: "services", icon: Layers },
        ]
      : [
          { label: "Home", href: "/admin", key: "dashboard", icon: Home },
          { label: "News", href: "/admin/news", key: "news", icon: Newspaper },
          { label: "Products", href: "/admin/products", key: "products", icon: Package },
          { label: "Services", href: "/admin/services", key: "services", icon: Layers },
          { label: "Pages", href: "/admin/pages", key: "pages", icon: FileText },
        ]

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 bottom-2.5 z-40 flex h-[58px] items-center justify-around rounded-2xl border border-slate-200/80 bg-white/95 px-1 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-[#0b0f17]/95 lg:hidden print:hidden"
    >
      {quickLinks.map((item) => {
        const Icon = item.icon
        const current = active === item.key || pathname === item.href
        return (
          <Link
            key={item.key}
            href={item.href}
            prefetch={true}
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-1 select-none flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors",
              current ? "font-bold text-slate-900 dark:text-slate-100" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-2xl px-3.5 py-1 transition-all",
                current && "bg-[#0c1427] text-[#00a8ff] shadow-xs",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            </span>
            <span className="mt-0.5 leading-none tracking-tight">{item.label}</span>
          </Link>
        )
      })}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="flex min-h-11 flex-1 select-none flex-col items-center justify-center py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Open menu"
        >
          <span className="flex items-center justify-center rounded-full px-3.5 py-1">
            <Menu className="h-5 w-5 shrink-0" aria-hidden="true" />
          </span>
          <span className="mt-0.5 leading-none tracking-tight">Menu</span>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl px-0 dark:bg-[#0b0f17]">
          <SheetHeader className="border-b border-border px-4 pb-4 sm:px-6">
            <SheetTitle className="font-display text-sm font-bold">Menu Navigasi</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4 sm:px-6">
            <AdminNavItems role={role} onNavigate={() => setOpen(false)} />
            <div className="mt-4 border-t border-border pt-4">
              <AdminSignOutDialog className="w-full justify-start" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
