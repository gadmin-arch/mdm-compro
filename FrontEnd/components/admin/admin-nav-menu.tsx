"use client"

import Link from "next/link"
import { useState } from "react"
import { FileText, Home, Inbox, Menu, Newspaper, Package, Settings, Users, Archive, type LucideIcon } from "lucide-react"
import { AdminSignOutDialog } from "@/components/admin/admin-sign-out-dialog"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  key: string
  icon: LucideIcon
  disabled?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", key: "dashboard", icon: Home },
  { label: "Pages", href: "/admin/pages", key: "pages", icon: FileText },
  { label: "Navigation", href: "/admin/navigation", key: "navigation", icon: Menu },
  { label: "Services", href: "/admin/services", key: "services", icon: FileText },
  { label: "Products", href: "/admin/products", key: "products", icon: Package },
  { label: "News", href: "/admin/news", key: "news", icon: Newspaper },
  { label: "Careers", href: "/admin/careers", key: "careers", icon: Users },
  { label: "Users", href: "/admin/users", key: "users", icon: Users },
  { label: "Archive", href: "/admin/archive", key: "archive", icon: Archive },
  { label: "Settings", href: "/admin/settings", key: "settings", icon: Settings },
]

function AdminNavItems({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon
        const current = active === item.key
        const itemClass = cn(
          "flex min-h-11 items-center gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
          current && "border-primary/30 bg-primary/10 text-foreground",
          item.disabled
            ? "cursor-not-allowed opacity-45"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )

        if (item.disabled) {
          return (
            <div key={item.key} aria-disabled="true" className={itemClass}>
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
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}

export function AdminNavSidebar({ active }: { active: string }) {
  return (
    <aside className="sticky top-20 hidden h-[calc(100dvh-6rem)] w-64 shrink-0 border-r border-border pr-5 lg:block">
      <nav className="flex h-full flex-col gap-1">
        <AdminNavItems active={active} />
        <div className="mt-auto border-t border-border pt-4">
          <AdminSignOutDialog className="w-full justify-start" />
        </div>
      </nav>
    </aside>
  )
}

export function AdminNavMenu({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  const activeItem = navItems.find((item) => item.key === active)

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <span className="hidden rounded-md border border-border bg-secondary/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground sm:inline-flex">
        {activeItem?.label ?? "Admin"}
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu className="h-4 w-4" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="max-h-[92dvh] overflow-y-auto px-0 pb-0">
          <SheetHeader className="border-b border-border px-4 pb-4 sm:px-6">
            <SheetTitle className="font-display">CMS Menu</SheetTitle>
          </SheetHeader>
          <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <AdminNavItems active={active} onNavigate={() => setOpen(false)} />
            </nav>
            <div className="mt-4 border-t border-border pt-4">
              <AdminSignOutDialog className="sm:w-auto" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
