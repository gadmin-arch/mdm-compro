"use client"

import { useRef, useState, useTransition } from "react"
import { Check, Copy, FileText, Loader2, Search, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminMediaUpload } from "@/lib/admin-api"

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

function formatDate(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function isImage(item: AdminMediaUpload) {
  return item.mimeType.startsWith("image/")
}

export function MediaSearch({ q }: { q: string }) {
  return (
    <form method="GET" action="/admin/media" className="mt-6 flex max-w-md items-center gap-2">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" defaultValue={q} name="q" placeholder="Search files by name..." />
      </div>
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  )
}

export function MediaUploadButton({ action }: { action: (formData: FormData) => Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, startTransition] = useTransition()

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.svg"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          const formData = new FormData()
          formData.set("file", file)
          startTransition(async () => {
            await action(formData)
          })
          event.target.value = ""
        }}
      />
      <Button type="button" disabled={pending} onClick={() => inputRef.current?.click()}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {pending ? "Uploading..." : "Upload File"}
      </Button>
    </>
  )
}

export function MediaLibrary({
  items,
  deleteAction,
}: {
  items: AdminMediaUpload[]
  deleteAction: (formData: FormData) => Promise<void>
}) {
  const [toDelete, setToDelete] = useState<AdminMediaUpload | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function copyUrl(item: AdminMediaUpload) {
    const url = item.url.startsWith("http") ? item.url : `${window.location.origin}${item.url}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 2000)
    } catch {
      // Clipboard unavailable (permissions/HTTP): show the URL for manual copy.
      window.prompt("Copy the file URL:", url)
    }
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 rounded-lg border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
        No files yet. Upload images, datasheets, and documents to reuse them across the site.
      </p>
    )
  }

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
            {isImage(item) ? (
              <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-secondary/40">
                {/* Backend-served uploads; next/image would need a remote loader for the API origin. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.fileName} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center border-b border-border bg-secondary/40">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-3">
              <p className="truncate text-sm font-medium text-foreground" title={item.fileName}>
                {item.fileName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatBytes(item.sizeBytes)}
                {item.createdAt ? ` · ${formatDate(item.createdAt)}` : ""}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" className="flex-1" onClick={() => copyUrl(item)}>
                  {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedId === item.id ? "Copied" : "Copy URL"}
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  aria-label={`Delete ${item.fileName}`}
                  onClick={() => setToDelete(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => { if (!open) setToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{toDelete?.fileName}&rdquo; will be permanently removed from storage. Pages that still
              reference it will show a broken image or link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {toDelete && (
              <form
                action={async (formData) => {
                  await deleteAction(formData)
                  setToDelete(null)
                }}
              >
                <input name="id" type="hidden" value={toDelete.id} />
                <AlertDialogAction type="submit">Delete permanently</AlertDialogAction>
              </form>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
