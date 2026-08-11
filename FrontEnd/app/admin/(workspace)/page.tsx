import Link from "next/link"
import {
  Archive,
  Briefcase,
  FileText,
  Inbox,
  ListTree,
  Newspaper,
  Package,
  Plus,
  Radio,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { KpiCard } from "@/components/admin/kpi-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AdminApiError,
  adminFetch,
  type AdminActivityEntry,
  type AdminContactInquiry,
  type AdminDashboardResponse,
} from "@/lib/admin-api"

type ModuleCard = {
  label: string
  key: string
  icon: LucideIcon
  href: string
  // Content modules get a per-status breakdown line under the count.
  content?: boolean
}

const moduleCards: ModuleCard[] = [
  { label: "Pages", key: "pages", icon: FileText, href: "/admin/pages", content: true },
  { label: "Services", key: "services", icon: Wrench, href: "/admin/services", content: true },
  { label: "Products", key: "products", icon: Package, href: "/admin/products", content: true },
  { label: "News", key: "news", icon: Newspaper, href: "/admin/news", content: true },
  { label: "Careers", key: "careers", icon: Briefcase, href: "/admin/careers", content: true },
  { label: "Users", key: "users", icon: Users, href: "/admin/users" },
  { label: "Archive", key: "archive", icon: Archive, href: "/admin/archive" },
]

const quickActions = [
  { label: "New Page", href: "/admin/pages/new" },
  { label: "New News Post", href: "/admin/news/new" },
  { label: "New Job Opening", href: "/admin/careers/new" },
]

const statusOrder = ["published", "draft", "scheduled", "archived"] as const

export default async function AdminPage() {
  // The three panels degrade independently — a failing feed should not take
  // the whole dashboard down.
  const [dashboard, contacts, activity] = await Promise.all([
    adminFetch<AdminDashboardResponse>("/dashboard").catch(swallowApiError),
    adminFetch<{ data: AdminContactInquiry[] | null }>("/contacts").catch(swallowApiError),
    adminFetch<{ data: AdminActivityEntry[] | null }>("/activity").catch(swallowApiError),
  ])

  const counts = dashboard?.counts ?? {}
  const statuses = dashboard?.statuses ?? {}
  const inquiries = (contacts?.data ?? []).slice(0, 6)
  const activityEntries = (activity?.data ?? []).slice(0, 8)

  return (
    <>
      <AdminPageHeader eyebrow="Overview" title="Dashboard"
      />
      {!dashboard && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          The admin API is unavailable.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {quickActions.map((action, index) => (
          <Button asChild key={action.href} variant={index === 0 ? "default" : "outline"}>
            <Link href={action.href}>
              <Plus className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
        <Button asChild variant="outline">
          <Link href="/admin/navigation">
            <ListTree className="h-4 w-4" />
            Edit Navigation
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {moduleCards.map((module) => {
          const Icon = module.icon
          return (
            <KpiCard
              key={module.key}
              title={module.label}
              value={counts[module.key] ?? 0}
              href={module.href}
              icon={<Icon className="h-4 w-4" aria-hidden="true" />}
              footer={
                module.content
                  ? statusBreakdown(statuses[module.key]) || "No records yet"
                  : module.key === "archive"
                    ? "Archived items"
                    : "Manage records"
              }
            />
          )
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Contact Inquiries</h2>
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <Link href="/admin/contacts">
                Manage
                {counts.contacts ? ` (${counts.contacts})` : ""}
              </Link>
            </Button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages submitted through the public contact form.
          </p>

          <div className="mt-4 space-y-3">
            {inquiries.map((inquiry) => (
              <article key={inquiry.id} className="rounded-md border border-border bg-secondary/20 p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {inquiry.name}
                    {inquiry.company && (
                      <span className="text-muted-foreground"> · {inquiry.company}</span>
                    )}
                  </p>
                  <time className="text-xs text-muted-foreground">{formatDateTime(inquiry.createdAt)}</time>
                </div>
                {inquiry.subject && (
                  <p className="mt-1 text-sm font-medium text-foreground">{inquiry.subject}</p>
                )}
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{inquiry.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  <a className="hover:text-foreground hover:underline" href={`mailto:${inquiry.email}`}>
                    {inquiry.email}
                  </a>
                  {inquiry.phone && <span> · {inquiry.phone}</span>}
                </p>
              </article>
            ))}
            {inquiries.length === 0 && (
              <p className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                No messages yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest content changes made in the CMS.
          </p>

          <ul className="mt-4 space-y-2.5">
            {activityEntries.map((entry) => (
              <li key={entry.id} className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2.5 text-sm last:border-b-0 last:pb-0">
                <span className="min-w-0 text-foreground">
                  <span className="font-medium">{entry.actorName || "Someone"}</span>{" "}
                  <span className="text-muted-foreground">{actionVerb(entry.action)}</span>{" "}
                  {entityLabel(entry.entityType)}
                  {entry.label && <span className="text-muted-foreground"> “{entry.label}”</span>}
                </span>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {formatDateTime(entry.createdAt)}
                </time>
              </li>
            ))}
            {activityEntries.length === 0 && (
              <li className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                No activity recorded yet. Changes to pages, content, and the menu will show up here.
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  )
}

function swallowApiError(error: unknown) {
  if (error instanceof AdminApiError) return null
  throw error
}

// "4 published · 2 draft" — zero-count statuses are skipped.
function statusBreakdown(byStatus?: Record<string, number>) {
  if (!byStatus) return ""
  return statusOrder
    .filter((status) => (byStatus[status] ?? 0) > 0)
    .map((status) => `${byStatus[status]} ${status}`)
    .join(" · ")
}

function actionVerb(action: string) {
  switch (action) {
    case "created":
      return "created"
    case "updated":
      return "updated"
    case "archived":
      return "archived"
    case "restored":
      return "restored"
    case "deleted":
      return "permanently deleted"
    default:
      return action
  }
}

function entityLabel(entityType: string) {
  if (entityType === "navigation") return "the navigation menu"
  if (entityType === "news") return "a news post"
  return `a ${entityType}`
}

function formatDateTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date)
}
