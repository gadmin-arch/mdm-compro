import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminShell } from "@/components/admin-shell"
import { FlashToast } from "@/components/admin/flash-toast"
import { CareerForm } from "@/components/admin/resource-forms"
import { Button } from "@/components/ui/button"
import { createCareerAction } from "../../content-actions"

export default async function AdminNewCareerPage() {
  return (
    <AdminShell
      active="careers"
      breadcrumbs={[{ label: "Careers", href: "/admin/careers" }, { label: "New Career" }]}
      eyebrow="Hiring"
      title="New Career"
      actions={
        <Button asChild variant="outline">
          <Link href="/admin/careers">
            <ArrowLeft className="h-4 w-4" />
            Careers
          </Link>
        </Button>
      }
    >
      <FlashToast resource="career" />
      <CareerForm action={createCareerAction} mode="create" />
    </AdminShell>
  )
}
