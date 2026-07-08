import { AdminShell } from "@/components/admin-shell"
import { NavigationEditor, type PageOption } from "@/components/admin/navigation-editor"
import { AdminApiError, adminFetch, type AdminPagesResponse } from "@/lib/admin-api"
import type { MenuItem } from "@/lib/cms"
import { saveNavigationAction } from "./actions"

type AdminNavigationResponse = {
  items: MenuItem[]
  version: number
}

export default async function AdminNavigationPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const query = await searchParams

  let navigation: AdminNavigationResponse | null = null
  let pageOptions: PageOption[] = []
  let apiError = false

  try {
    const [navResponse, pagesResponse] = await Promise.all([
      adminFetch<AdminNavigationResponse>("/navigation", {}, "/admin/navigation"),
      adminFetch<AdminPagesResponse>("/pages?perPage=100", {}, "/admin/navigation"),
    ])
    navigation = navResponse
    pageOptions = (pagesResponse.data ?? []).map((page) => ({
      key: page.key,
      title: page.title,
      status: page.status,
    }))
  } catch (error) {
    if (error instanceof AdminApiError) {
      apiError = true
    } else {
      throw error
    }
  }

  const message = query.saved
    ? "Menu saved. The public site is updated."
    : query.error === "conflict"
      ? "The menu changed elsewhere. Reload before saving again."
      : query.error === "invalid"
        ? "The menu contains invalid entries. Check labels and links."
        : query.error
          ? "Menu could not be saved."
          : ""

  return (
    <AdminShell
      active="navigation"
      eyebrow="Site Structure"
      title="Navigation Menu"
    >
      {message && (
        <p className="mt-6 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          {message}
        </p>
      )}

      {apiError || !navigation ? (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Navigation could not be loaded from the admin API.
        </p>
      ) : (
        <NavigationEditor
          action={saveNavigationAction}
          initialItems={navigation.items}
          version={navigation.version}
          pageOptions={pageOptions}
        />
      )}
    </AdminShell>
  )
}
