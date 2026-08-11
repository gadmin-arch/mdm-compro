import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { RedirectForm } from "@/components/admin/redirects/redirect-form"
import { saveRedirectAction } from "../actions"

export default function NewRedirectPage() {
  return (
    <>
      <AdminPageHeader breadcrumbs={[{ label: "Short Links", href: "/admin/redirects" }, { label: "New Short Link" }]} eyebrow="Marketing" title="New Short Link"
      />
      <RedirectForm action={saveRedirectAction} mode="create" />
    </>
  )
}
