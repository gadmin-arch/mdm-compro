"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { FileText, Home, Menu, Newspaper, Package, Wrench } from "lucide-react"
import { AdminNavItems } from "@/components/admin/admin-nav-menu"
import { AdminSignOutDialog } from "@/components/admin/admin-sign-out-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// The five content modules reached most often; everything else lives behind
// Menu. Shown wherever the desktop sidebar is hidden (below lg) so tablets
// are never left without navigation.
const quickLinks = [
  { label: "Home", href: "/admin", key: "dashboard", icon: Home },
  { label: "Pages", href: "/admin/pages", key: "pages", icon: FileText },
  { label: "Services", href: "/admin/services", key: "services", icon: Wrench },
  { label: "Products", href: "/admin/products", key: "products", icon: Package },
  { label: "News", href: "/admin/news", key: "news", icon: Newspaper },
]

export function AdminBottomNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 bottom-2.5 z-40 flex h-[58px] items-center justify-around rounded-2xl border border-border/80 bg-background/95 px-1 shadow-2xl backdrop-blur-xl lg:hidden print:hidden"
    >
      {quickLinks.map((item) => {
        const Icon = item.icon
        // Match the shell's active key first; fall back to the path so the
        // bar still highlights on pages that pass a different key.
        const current = active === item.key || pathname === item.href
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-1 select-none flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors",
              current ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-full px-3.5 py-1 transition-colors",
                current && "bg-primary/10 text-primary",
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
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl px-0">
          <SheetHeader className="border-b border-border px-4 pb-4 sm:px-6">
            <SheetTitle className="font-display">CMS Menu</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4 sm:px-6">
            <nav className="grid gap-1.5 sm:grid-cols-2">
              <AdminNavItems active={active} onNavigate={() => setOpen(false)} />
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <AdminSignOutDialog className="w-full justify-start" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
