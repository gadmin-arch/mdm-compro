"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLayoutEffect, useRef, useState } from "react"
import { ChevronDown, ChevronRight, Menu, Search } from "lucide-react"
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
import { defaultMenuItems, type ContentNode, type MenuItem, type Navigation } from "@/lib/cms"
import { cn } from "@/lib/utils"
import { container } from "@/lib/layout"

type NavNode = {
  id: string
  label: string
  href: string
  summary?: string
  children: NavNode[]
}

// System menu entries are sourced from the CMS content trees, so any service
// or product added below a parent is immediately available in the header.
function buildEntries(navigation: Navigation): NavNode[] {
  const menu = navigation.menu?.length ? navigation.menu : defaultMenuItems

  return menu
    .filter((item) => item.visible !== false)
    .map((item) => {
      const autoChildren =
        item.auto === "services"
          ? contentNodes(navigation.services, "/services")
          : item.auto === "products"
            ? contentNodes(navigation.products, "/products")
            : []

      const manualChildren = (item.children ?? [])
        .filter((child) => child.visible !== false)
        .map(menuNode)

      return {
        id: item.id,
        label: item.label,
        href: item.href || "#",
        children: [...autoChildren, ...manualChildren],
      }
    })
}

function menuNode(item: MenuItem): NavNode {
  return {
    id: item.id,
    label: item.label,
    href: item.href || "#",
    children: (item.children ?? []).filter((child) => child.visible !== false).map(menuNode),
  }
}

function contentNodes(nodes: ContentNode[], basePath: string): NavNode[] {
  return nodes.map((node) => ({
    id: node.id,
    label: node.title,
    href: `${basePath}/${node.fullPath}`,
    summary: node.summary,
    children: contentNodes(node.children ?? [], basePath),
  }))
}

function DesktopNavItem({ entry, active }: { entry: NavNode; active: boolean }) {
  const [activeTrail, setActiveTrail] = useState<string[]>([])
  const [maxWidth, setMaxWidth] = useState<number>()
  const panelRef = useRef<HTMLDivElement>(null)

  const selectNode = (level: number, node: NavNode) => {
    setActiveTrail((current) => [...current.slice(0, level), node.id])
  }

  // The panel stays glued to the trigger's left edge; it never shifts. When
  // expanded columns would cross the viewport's right edge, the panel is capped
  // there instead and the deeper columns become horizontally scrollable.
  // Re-measure on resize — window resizes and browser zoom move the anchor.
  useLayoutEffect(() => {
    const measure = () => {
      const anchor = panelRef.current?.parentElement
      if (!anchor) return
      setMaxWidth(Math.max(280, window.innerWidth - 16 - anchor.getBoundingClientRect().left))
    }
    measure()
    window.addEventListener("resize", measure)
    const observer = new ResizeObserver(measure)
    observer.observe(document.documentElement)
    return () => {
      window.removeEventListener("resize", measure)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="group/menu relative" onMouseLeave={() => setActiveTrail([])}>
      <Link
        href={entry.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        {entry.label}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
      <div
        ref={panelRef}
        aria-label={`${entry.label} menu`}
        style={{ maxWidth }}
        className="pointer-events-none invisible absolute top-full left-0 z-50 flex w-max origin-top-left translate-y-2 scale-[0.98] overflow-x-auto overflow-y-hidden rounded-xl border border-border bg-popover opacity-0 shadow-xl transition-[opacity,transform] duration-300 ease-out group-focus-within/menu:pointer-events-auto group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:scale-100 group-focus-within/menu:opacity-100 group-hover/menu:pointer-events-auto group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:scale-100 group-hover/menu:opacity-100"
        role="menu"
      >
        <MegaMenuColumn
          nodes={entry.children}
          level={0}
          activeTrail={activeTrail}
          onSelect={selectNode}
        />
      </div>
    </div>
  )
}

function MegaMenuColumn({
  nodes,
  level,
  activeTrail,
  onSelect,
}: {
  nodes: NavNode[]
  level: number
  activeTrail: string[]
  onSelect: (level: number, node: NavNode) => void
}) {
  const activeNode = nodes.find((node) => node.id === activeTrail[level])
  const showSummary = level === 0

  return (
    <>
      <section
        className={cn(
          "shrink-0 border-r border-border/70 bg-popover p-2 last:border-r-0",
          showSummary ? "w-80" : "w-72",
        )}
      >
        {nodes.map((node) => {
          const hasChildren = node.children.length > 0
          const selected = activeNode?.id === node.id

          return (
            <div
              key={node.id}
              className={cn(
                "flex items-stretch rounded-lg transition-colors duration-300",
                selected ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
              )}
              onFocus={() => onSelect(level, node)}
              onMouseEnter={() => onSelect(level, node)}
            >
              <Link
                href={node.href}
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-sm font-medium leading-snug",
                  selected ? "text-primary-foreground" : "text-popover-foreground",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block">{node.label}</span>
                  {showSummary && node.summary && (
                    <span
                      className={cn(
                        "mt-1 line-clamp-2 block text-xs font-normal leading-relaxed",
                        selected ? "text-primary-foreground/85" : "text-muted-foreground",
                      )}
                    >
                      {node.summary}
                    </span>
                  )}
                </span>
                {hasChildren && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </Link>
            </div>
          )
        })}
      </section>
      {activeNode?.children.length ? (
        <MegaMenuColumn
          nodes={activeNode.children}
          level={level + 1}
          activeTrail={activeTrail}
          onSelect={onSelect}
        />
      ) : null}
    </>
  )
}

function MobileMenuBranch({
  node,
  openNodeIds,
  onToggle,
  onNavigate,
  level = 0,
}: {
  node: NavNode
  openNodeIds: Set<string>
  onToggle: (id: string) => void
  onNavigate: () => void
  level?: number
}) {
  const hasChildren = node.children.length > 0

  if (!hasChildren) {
    return (
      <Link
        href={node.href}
        onClick={onNavigate}
        className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        {node.label}
      </Link>
    )
  }

  const isOpen = openNodeIds.has(node.id)

  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(node.id)}>
      <div className="flex items-center rounded-md hover:bg-secondary">
        <Link
          href={node.href}
          onClick={onNavigate}
          className="min-w-0 flex-1 px-3 py-2.5 text-sm font-medium text-foreground"
        >
          {node.label}
        </Link>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            aria-label={`Show ${node.label} submenu`}
            className="flex h-10 w-10 items-center justify-center rounded-r-md text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")}
              aria-hidden="true"
            />
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
        <div className={cn("ml-3 border-l border-border pl-3", level === 0 && "mb-1")}>
          {node.children.map((child) => (
            <MobileMenuBranch
              key={child.id}
              node={child}
              level={level + 1}
              openNodeIds={openNodeIds}
              onToggle={onToggle}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function SiteHeaderClient({ navigation }: { navigation: Navigation }) {
  const [open, setOpen] = useState(false)
  const [openMobileNodeIds, setOpenMobileNodeIds] = useState<Set<string>>(new Set())
  const pathname = usePathname()
  const entries = buildEntries(navigation)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/")

  const closeMobileMenu = () => {
    setOpen(false)
    setOpenMobileNodeIds(new Set())
  }

  const toggleMobileNode = (id: string) => {
    setOpenMobileNodeIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className={container("flex h-16 items-center justify-between")}>
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
            <span className="font-display text-sm font-semibold tracking-tight text-foreground">Multi Daya Mitra</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Electrical · Automation · Fire
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {entries.map((item) => {
            const hasChildren = item.children.length > 0

            if (!hasChildren) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              )
            }

            return <DesktopNavItem key={item.id} entry={item} active={isActive(item.href)} />
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
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
              if (!nextOpen) setOpenMobileNodeIds(new Set())
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
              <nav className="mt-6 flex flex-col gap-1 px-4 pb-4" aria-label="Mobile navigation">
                {entries.map((item) => (
                  <MobileMenuBranch
                    key={item.id}
                    node={item}
                    openNodeIds={openMobileNodeIds}
                    onToggle={toggleMobileNode}
                    onNavigate={closeMobileMenu}
                  />
                ))}
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
