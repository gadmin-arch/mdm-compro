import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { FlashToast } from "@/components/admin/flash-toast"
import { NewsForm } from "@/components/admin/resource-forms"
import { Button } from "@/components/ui/button"
import { createNewsAction } from "../../content-actions"

export default async function AdminNewNewsPage() {
  return (
    <AdminShell
      active="news"
      breadcrumbs={[{ label: "News", href: "/admin/news" }, { label: "New News Post" }]}
      eyebrow="Editorial"
      title="New News"
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/news">
            <ArrowLeft className="h-4 w-4" />
            News
          </Link>
        </Button>
      }
    >
      <FlashToast resource="news post" />
      <NewsForm action={createNewsAction} mode="create" />
    </AdminShell>
  )
}
