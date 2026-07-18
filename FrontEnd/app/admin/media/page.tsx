import { AdminShell } from "@/components/admin-shell"
import { AdminPagination } from "@/components/admin/admin-pagination"
import { MediaLibrary, MediaSearch, MediaUploadButton } from "@/components/admin/media-library"
import { AdminApiError, adminFetch, type AdminMediaResponse } from "@/lib/admin-api"
import { deleteMediaAction, uploadMediaAction } from "./actions"

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; uploaded?: string; deleted?: string; error?: string }>
}) {
  const query = await searchParams
  const q = query.q?.trim() ?? ""
  const pageNum = Math.max(1, Number(query.page) || 1)
  const params = new URLSearchParams({ perPage: "24", page: String(pageNum) })
  if (q) params.set("q", q)

  let response: AdminMediaResponse | null = null
  let apiError = false
  try {
    response = await adminFetch<AdminMediaResponse>(`/media?${params}`, {}, "/admin/media")
  } catch (error) {
    if (error instanceof AdminApiError) apiError = true
    else throw error
  }

  const message = query.uploaded
    ? "File uploaded."
    : query.deleted
      ? "File deleted."
      : query.error === "upload_failed"
        ? "Upload failed. Use JPG, PNG, WebP, GIF, SVG, PDF, DOC, XLS, or ZIP under 25MB."
        : query.error === "delete_failed"
          ? "The file could not be deleted."
          : ""

  return (
    <AdminShell
      active="media"
      eyebrow="Assets"
      title="Media Library"
      actions={<MediaUploadButton action={uploadMediaAction} />}
    >
      {message && (
        <p
          className={`mt-6 rounded-md border px-3 py-2 text-sm ${
            query.error
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-border bg-background text-foreground"
          }`}
        >
          {message}
        </p>
      )}
      {apiError && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Media could not be loaded from the admin API.
        </p>
      )}

      <MediaSearch q={q} />

      <MediaLibrary items={response?.data ?? []} deleteAction={deleteMediaAction} />

      {response && (
        <AdminPagination
          basePath="/admin/media"
          page={response.pagination.page}
          totalPages={response.pagination.totalPages}
          total={response.pagination.total}
          query={{ q }}
        />
      )}
    </AdminShell>
  )
}
