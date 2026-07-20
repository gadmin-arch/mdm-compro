import { AdminShell } from "@/components/admin-shell"
import { RedirectForm } from "@/components/admin/redirects/redirect-form"
import { saveRedirectAction } from "../actions"

export default function NewRedirectPage() {
  return (
    <AdminShell active="redirects" breadcrumbs={[{ label: "Short Links", href: "/admin/redirects" }, { label: "New Short Link" }]} eyebrow="Marketing" title="New Short Link">
      <RedirectForm action={saveRedirectAction} mode="create" />
    </AdminShell>
  )
}
