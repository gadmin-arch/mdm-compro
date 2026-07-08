"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { defaultMenuItems, type ContentNode, type Navigation } from "@/lib/cms"
import { cn } from "@/lib/utils"

type NavChild = { id: string; label: string; href: string; summary?: string }
type NavEntry = { id: string; label: string; href: string; children: NavChild[] }

// The CMS menu drives the header; system items flagged with `auto` also pull
// their dropdown children from the services/products content trees.
function buildEntries(navigation: Navigation): NavEntry[] {
  const menu = navigation.menu?.length ? navigation.menu : defaultMenuItems

  return menu
    .filter((item) => item.visible !== false)
    .map((item) => {
      const autoChildren: NavChild[] =
        item.auto === "services"
          ? contentChildren(navigation.services, "/services")
          : item.auto === "products"
            ? contentChildren(navigation.products, "/products")
            : []

      const manualChildren: NavChild[] = (item.children ?? [])
        .filter((child) => child.visible !== false)
        .map((child) => ({ id: child.id, label: child.label, href: child.href || "#" }))

      return {
        id: item.id,
        label: item.label,
        href: item.href || "#",
        children: [...autoChildren, ...manualChildren],
      }
    })
}

function contentChildren(nodes: ContentNode[], basePath: string): NavChild[] {
  return nodes.map((node) => ({
    id: node.id,
    label: node.title,
    href: `${basePath}/${node.fullPath}`,
    summary: node.summary,
  }))
}

export function SiteHeaderClient({ navigation }: { navigation: Navigation }) {
  const [open, setOpen] = useState(false)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const pathname = usePathname()
  const entries = buildEntries(navigation)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")

  const closeMobileMenu = () => {
    setOpen(false)
    setOpenMobileSection(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/Logo PT MDM.png"
            alt="PT Multi Daya Mitra Logo"
            width={36}
            height={36}
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">
              Multi Daya Mitra
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Electrical · Automation · Fire
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {entries.map((item) => (
            <div key={item.id} className="group relative">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
                {item.children.length > 0 && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
              {item.children.length > 0 && (
                <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 translate-y-1 scale-[0.98] rounded-md border border-border bg-popover p-2 opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-popover-foreground hover:bg-secondary"
                    >
                      <span className="font-medium">{child.label}</span>
                      {child.summary && (
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                          {child.summary}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Link href="/search" aria-label="Search">
              <Search className="h-4.5 w-4.5" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/contact">Request a Quote</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Link href="/search" aria-label="Search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen)
              if (!nextOpen) setOpenMobileSection(null)
            }}
          >
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-[min(22rem,calc(100vw-1rem))] overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-display">Navigation</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1 px-4 pb-4">
              {entries.map((item) => {
                const hasChildren = item.children.length > 0
                const sectionOpen = openMobileSection === item.id

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.id}
                      open={sectionOpen}
                      onOpenChange={(nextOpen) => setOpenMobileSection(nextOpen ? item.id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className={cn(
                            "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors",
                            isActive(item.href) ? "bg-secondary text-foreground" : "text-foreground hover:bg-secondary",
                          )}
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground transition-transform duration-200",
                              sectionOpen && "rotate-180",
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 overflow-hidden">
                        <div className="mb-2 ml-3 border-l border-border pl-3">
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                          >
                            All {item.label}
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={closeMobileMenu}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                }

                return (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href) ? "bg-secondary text-foreground" : "text-foreground hover:bg-secondary",
                      )}
                    >
                      {item.label}
                    </Link>
                  </div>
                )
              })}
              <Button asChild className="mt-3">
                <Link href="/contact" onClick={closeMobileMenu}>
                  Request a Quote
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>
  )
}
