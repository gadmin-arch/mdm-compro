"use client"

import type { ReactNode } from "react"
import { useState, useRef } from "react"
import type { Career, ContentNode, NewsItem } from "@/lib/cms"
import type { SaveAction, SaveResult } from "@/lib/save-result"
import {
  adminStatusOptions,
  employmentTypeOptions,
  htmlFromBlocks,
  specsToText,
  textFromBlocks,
  toDateTimeLocal,
} from "@/lib/admin-content"
import { extractBilingualText } from "@/lib/bilingual"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Save } from "lucide-react"
import { MediaUpload } from "@/components/admin/media-upload"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
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

// TipTap is the heaviest admin dependency; load it only when a form that
// actually renders the editor mounts.
const RichTextField = dynamic(
  () => import("@/components/admin/rich-text-editor").then((mod) => mod.RichTextField),
  { ssr: false, loading: () => <Skeleton className="h-56 w-full" /> },
)
const BilingualRichTextField = dynamic(
  () => import("@/components/admin/rich-text-editor").then((mod) => mod.BilingualRichTextField),
  { ssr: false, loading: () => <Skeleton className="h-56 w-full" /> },
)

type ContentItemFormProps = {
  action: SaveAction
  item?: ContentNode
  mode: "create" | "edit"
  parentOptions?: ContentNode[]
  resource: "services" | "products"
}

type NewsFormProps = {
  action: SaveAction
  item?: NewsItem
  mode: "create" | "edit"
}

type CareerFormProps = {
  action: SaveAction
  item?: Career
  mode: "create" | "edit"
}

// Shared banner slot spanning both grid columns at the top of a form.
function FormBanner({
  result,
  entity,
  onOverwrite,
}: {
  result: SaveResult | null
  entity: string
  onOverwrite?: () => void
}) {
  if (!result) return null
  return (
    <div className="xl:col-span-2">
      <SaveErrorBanner result={result} entity={entity} onOverwrite={onOverwrite} />
    </div>
  )
}

export function ContentItemForm({ action, item, mode, parentOptions = [], resource }: ContentItemFormProps) {
  const isProduct = resource === "products"
  const entity = isProduct ? "product" : "service"
  const selectableParents = parentOptions.filter((option) => option.id !== item?.id)
  const formRef = useRef<HTMLFormElement>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const { pending, result, submit } = useSaveAction(action)
  const fields = result?.fields

  const handleSaveClick = () => {
    if (formRef.current) {
      if (formRef.current.checkValidity()) {
        setShowConfirm(true)
      } else {
        formRef.current.reportValidity()
      }
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-8 grid gap-6 pb-24 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <FormBanner
        result={result}
        entity={entity}
        onOverwrite={
          result?.serverVersion
            ? () => submit(formRef.current, { version: String(result.serverVersion) })
            : undefined
        }
      />
      <input name="resource" type="hidden" value={resource} />
      {mode === "edit" && item && (
        <>
          <input name="id" type="hidden" value={item.id} />
          <input name="version" type="hidden" value={item.version ?? 0} />
          <input name="oldPath" type="hidden" value={item.fullPath} />
        </>
      )}

      <div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0b0f17]">
        <BilingualField
          label={isProduct ? "Product Name / Nama Produk" : "Service Name / Nama Layanan"}
          nameId="title_id"
          nameEn="title_en"
          nameFallback="title"
          defaultValue={item?.title}
          required
          error={fields?.title}
          placeholderId={isProduct ? "cth. Panel Distribusi Tegangan Rendah (LVMDP)" : "cth. Instalasi & Terminasi Kabel MV & LV"}
          placeholderEn={isProduct ? "e.g. Low Voltage Main Distribution Panel" : "e.g. MV & LV Cable Installation & Termination"}
        />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <Field label="Slug (URL)" name="slug" required defaultValue={item?.slug} error={fields?.slug} />
          <SelectField
            label="Parent"
            name="parentId"
            defaultValue={item?.parentId ?? ""}
            options={[
              { value: "", label: "No parent" },
              ...selectableParents.map((option) => ({
                value: option.id,
                label: option.fullPath || option.title,
              })),
            ]}
          />
        </div>

        <BilingualTextAreaField
          label="Short description / Ringkasan Singkat"
          nameId="summary_id"
          nameEn="summary_en"
          nameFallback="summary"
          defaultValue={item?.summary}
          rows={2}
          error={fields?.summary}
          placeholderId="Ringkasan singkat dalam Bahasa Indonesia..."
          placeholderEn="Short summary in English..."
        />
        <BilingualRichTextField
          label="Description"
          nameId="contentHtml_id"
          nameEn="contentHtml_en"
          nameFallback="contentText"
          rawDefaultValue={item?.content}
        />
        <MediaUpload
          label="Image"
          name="imageUrl"
          defaultValue={item?.imageUrl}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          isImage={true}
        />
        {isProduct && (
          <>
            <MediaUpload
              label="Datasheet Document"
              name="datasheetUrl"
              defaultValue={item?.datasheetUrl}
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip"
              isImage={false}
            />
            <TextAreaField
              label="Specs"
              name="specsText"
              placeholder="Brand: Schneider&#10;Voltage: 20kV&#10;Availability: In stock"
              rows={7}
              defaultValue={specsToText(item?.specs)}
            />
          </>
        )}
      </div>

      <Sidebar
        buttonLabel={mode === "create" ? `Create ${isProduct ? "Product" : "Service"}` : "Save Changes"}
        itemVersion={item?.version}
        pending={pending}
        onClickSubmit={handleSaveClick}
      >
        <StatusField defaultValue={item?.status} error={fields?.status} />
        <Field label="Publish date" name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocal(item?.publishedAt)} />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(item?.sortOrder ?? 0)} error={fields?.sortOrder} />
        <SeoFields seo={item?.seo} />
      </Sidebar>

      <MobileActionBar
        buttonLabel={mode === "create" ? `Create ${isProduct ? "Product" : "Service"}` : "Save Changes"}
        pending={pending}
        onClickSubmit={handleSaveClick}
      />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save {isProduct ? "Product" : "Service"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save changes to this {isProduct ? "product" : "service"}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirm(false)
                formRef.current?.requestSubmit()
              }}
            >
              Confirm Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

export function NewsForm({ action, item, mode }: NewsFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const { pending, result, submit } = useSaveAction(action)
  const fields = result?.fields

  const handleSaveClick = () => {
    if (formRef.current) {
      if (formRef.current.checkValidity()) {
        setShowConfirm(true)
      } else {
        formRef.current.reportValidity()
      }
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-8 grid gap-6 pb-24 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <FormBanner
        result={result}
        entity="news post"
        onOverwrite={
          result?.serverVersion
            ? () => submit(formRef.current, { version: String(result.serverVersion) })
            : undefined
        }
      />
      {mode === "edit" && item && (
        <>
          <input name="id" type="hidden" value={item.id} />
          <input name="version" type="hidden" value={item.version} />
          <input name="oldSlug" type="hidden" value={item.slug} />
        </>
      )}

      <div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0b0f17]">
        <BilingualField
          label="Title / Judul Berita & Artikel"
          nameId="title_id"
          nameEn="title_en"
          nameFallback="title"
          defaultValue={item?.title}
          required
          error={fields?.title}
          placeholderId="cth. Distribusi Listrik yang Andal untuk Fasilitas Industri"
          placeholderEn="e.g. Reliable Power Distribution for Industrial Facilities"
        />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <Field label="Slug (URL)" name="slug" required defaultValue={item?.slug} error={fields?.slug} />
          <NewsCategoryField defaultValue={item?.category} error={fields?.category} />
        </div>

        <BilingualTextAreaField
          label="Excerpt / Ringkasan Singkat"
          nameId="excerpt_id"
          nameEn="excerpt_en"
          nameFallback="excerpt"
          defaultValue={item?.excerpt}
          rows={2}
          error={fields?.excerpt}
          placeholderId="Ringkasan singkat artikel dalam Bahasa Indonesia..."
          placeholderEn="Short summary of the article in English..."
        />
        <BilingualRichTextField
          label="Body Content"
          nameId="bodyHtml_id"
          nameEn="bodyHtml_en"
          nameFallback="bodyHtml"
          rawDefaultValue={item?.body}
        />
        <MediaUpload
          label="Featured Image"
          name="featuredImageUrl"
          defaultValue={item?.featuredImageUrl}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          isImage={true}
        />
      </div>

      <Sidebar buttonLabel={mode === "create" ? "Create News" : "Save News"} itemVersion={item?.version} pending={pending} onClickSubmit={handleSaveClick}>
        <StatusField defaultValue={item?.status} error={fields?.status} />
        <Field label="Publish date" name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocal(item?.publishedAt)} />
        <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-xs font-medium cursor-pointer">
          <input defaultChecked={Boolean(item?.featured)} name="featured" type="checkbox" />
          Featured Article
        </label>
        <SeoFields seo={item?.seo} />
      </Sidebar>

      <MobileActionBar
        buttonLabel={mode === "create" ? "Create News" : "Save News"}
        pending={pending}
        onClickSubmit={handleSaveClick}
      />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save News Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save changes to this news article?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirm(false)
                formRef.current?.requestSubmit()
              }}
            >
              Confirm Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

export function CareerForm({ action, item, mode }: CareerFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const { pending, result, submit } = useSaveAction(action)
  const fields = result?.fields

  const handleSaveClick = () => {
    if (formRef.current) {
      if (formRef.current.checkValidity()) {
        setShowConfirm(true)
      } else {
        formRef.current.reportValidity()
      }
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-8 grid gap-6 pb-24 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <FormBanner
        result={result}
        entity="career"
        onOverwrite={
          result?.serverVersion
            ? () => submit(formRef.current, { version: String(result.serverVersion) })
            : undefined
        }
      />
      {mode === "edit" && item && (
        <>
          <input name="id" type="hidden" value={item.id} />
          <input name="version" type="hidden" value={item.version} />
          <input name="oldSlug" type="hidden" value={item.slug} />
        </>
      )}

      <div className="space-y-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-[#0b0f17]">
        <BilingualField
          label="Role title / Posisi Lowongan"
          nameId="title_id"
          nameEn="title_en"
          nameFallback="title"
          defaultValue={item?.title}
          required
          error={fields?.title}
          placeholderId="cth. Teknisi Listrik Tegangan Menengah"
          placeholderEn="e.g. MV Electrical Technician"
        />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field label="Slug (URL)" name="slug" required defaultValue={item?.slug} error={fields?.slug} />
          <Field label="Department" name="department" required defaultValue={item?.department} error={fields?.department} />
        </div>

        <BilingualTextAreaField
          label="Summary / Ringkasan Posisi"
          nameId="summary_id"
          nameEn="summary_en"
          nameFallback="summary"
          defaultValue={item?.summary}
          rows={3}
          error={fields?.summary}
          placeholderId="Ringkasan posisi dalam Bahasa Indonesia..."
          placeholderEn="Role summary in English..."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Department" name="department" required defaultValue={item?.department} error={fields?.department} />
          <Field label="Location" name="location" required defaultValue={item?.location} error={fields?.location} />
        </div>
        <BilingualRichTextField
          label="Job description"
          nameId="descriptionHtml_id"
          nameEn="descriptionHtml_en"
          nameFallback="descriptionHtml"
          rawDefaultValue={item?.description}
        />
        <Field label="Apply URL" name="applyUrl" placeholder="https://docs.google.com/forms/..." defaultValue={item?.applyUrl} error={fields?.applyUrl} />
      </div>

      <Sidebar buttonLabel={mode === "create" ? "Create Career" : "Save Career"} itemVersion={item?.version} pending={pending} onClickSubmit={handleSaveClick}>
        <StatusField defaultValue={item?.status} error={fields?.status} />
        <SelectField
          label="Employment"
          name="employmentType"
          defaultValue={item?.employmentType ?? "full_time"}
          options={employmentTypeOptions}
          error={fields?.employmentType}
        />
        <Field label="Deadline" name="deadline" type="datetime-local" defaultValue={toDateTimeLocal(item?.deadline)} />
        <Field label="Publish date" name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocal(item?.publishedAt)} />
      </Sidebar>

      <MobileActionBar
        buttonLabel={mode === "create" ? "Create Career" : "Save Career"}
        pending={pending}
        onClickSubmit={handleSaveClick}
      />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Career Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save changes to this career opening?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowConfirm(false)
                formRef.current?.requestSubmit()
              }}
            >
              Confirm Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  )
}

function Sidebar({
  buttonLabel,
  children,
  itemVersion,
  pending,
  onClickSubmit,
}: {
  buttonLabel: string
  children: ReactNode
  itemVersion?: number
  pending: boolean
  onClickSubmit?: () => void
}) {
  return (
    <aside className="space-y-4 rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-[#0b0f17] xl:sticky xl:top-6 xl:self-start">
      <h2 className="font-display text-base font-bold text-foreground">Publish Settings</h2>
      {children}
      {itemVersion && (
        <div className="rounded-lg bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground font-mono">
          Version: {itemVersion}
        </div>
      )}
      <Button
        className="hidden w-full lg:flex font-semibold shadow-xs"
        disabled={pending}
        type="button"
        onClick={onClickSubmit}
      >
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : buttonLabel}
      </Button>
    </aside>
  )
}

function MobileActionBar({
  buttonLabel,
  pending,
  onClickSubmit,
}: {
  buttonLabel: string
  pending: boolean
  onClickSubmit?: () => void
}) {
  return (
    <div className="fixed inset-x-3 bottom-[76px] z-30 flex items-center gap-2 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden print:hidden">
      <Button
        className="min-h-11 flex-1 font-semibold"
        disabled={pending}
        type="button"
        onClick={onClickSubmit}
      >
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : buttonLabel}
      </Button>
    </div>
  )
}

function StatusField({ defaultValue, error }: { defaultValue?: string; error?: string }) {
  return (
    <SelectField
      label="Status"
      name="status"
      defaultValue={defaultValue ?? "draft"}
      options={adminStatusOptions.map((status) => ({ value: status, label: status }))}
      error={error}
    />
  )
}

function SeoFields({ seo }: { seo?: { title?: string; description?: string; canonical?: string; noIndex?: boolean } }) {
  return (
    <div className="space-y-3 border-t border-border pt-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO Settings</h3>
      <Field label="SEO title" name="seoTitle" defaultValue={seo?.title} />
      <TextAreaField label="SEO description" name="seoDescription" rows={3} defaultValue={seo?.description} />
      <Field label="Canonical URL" name="seoCanonical" defaultValue={seo?.canonical} />
      <label className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-xs font-medium cursor-pointer">
        <input defaultChecked={Boolean(seo?.noIndex)} name="seoNoIndex" type="checkbox" />
        Hide from search engines
      </label>
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-xs text-destructive font-medium" id={id}>
      {message}
    </p>
  )
}

function Field({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  required,
  type = "text",
}: {
  label: string
  name: string
  defaultValue?: string
  error?: string
  placeholder?: string
  required?: boolean
  type?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor={name}>
        {label}
      </label>
      <Input
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="bg-background text-xs"
        defaultValue={defaultValue ?? ""}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  )
}

function TextAreaField({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  rows,
}: {
  label: string
  name: string
  defaultValue?: string
  error?: string
  placeholder?: string
  rows: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor={name}>
        {label}
      </label>
      <Textarea
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="bg-background text-xs"
        defaultValue={defaultValue ?? ""}
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  )
}

function BilingualField({
  label,
  nameId,
  nameEn,
  nameFallback,
  defaultValue,
  required,
  error,
  placeholderId,
  placeholderEn,
}: {
  label: string
  nameId: string
  nameEn: string
  nameFallback?: string
  defaultValue?: string
  required?: boolean
  error?: string
  placeholderId?: string
  placeholderEn?: string
}) {
  const extracted = extractBilingualText(defaultValue)
  const [idVal, setIdVal] = useState(extracted.id)
  const [enVal, setEnVal] = useState(extracted.en)

  const hasId = Boolean(idVal.trim())
  const hasEn = Boolean(enVal.trim())

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor={nameId}>
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Dwi-Bahasa (Bilingual)
          </span>
        </div>
        {hasId && hasEn ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            ✓ Lengkap (ID + EN)
          </span>
        ) : !hasId && hasEn ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            ⚠️ Versi ID Belum Diisi
          </span>
        ) : hasId && !hasEn ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            ⚠️ Versi EN Belum Diisi
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            🇮🇩 Bahasa Indonesia & 🇬🇧 English
          </span>
        )}
      </div>

      {!hasId && hasEn && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-semibold">Versi Bahasa Indonesia belum diisi</p>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              Pengunjung berbahasa Indonesia akan melihat teks versi English sebagai fallback.
            </p>
          </div>
        </div>
      )}

      {hasId && !hasEn && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-semibold">Versi English belum diisi</p>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              Pengunjung berbahasa English akan melihat teks versi Bahasa Indonesia sebagai fallback.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              <span>Bahasa Indonesia (ID)</span>
            </div>
            {!hasId && hasEn && <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">(belum diisi)</span>}
          </div>
          <Input
            id={nameId}
            name={nameId}
            value={idVal}
            onChange={(e) => setIdVal(e.target.value)}
            placeholder={placeholderId || "Judul dalam Bahasa Indonesia..."}
            className={cn("bg-background text-xs", !hasId && hasEn && "border-amber-400/80 focus-visible:ring-amber-400/20")}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <span>English (EN)</span>
            </div>
            {hasId && !hasEn && <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">(belum diisi)</span>}
          </div>
          <Input
            id={nameEn}
            name={nameEn}
            value={enVal}
            onChange={(e) => setEnVal(e.target.value)}
            placeholder={placeholderEn || "Title in English..."}
            className={cn("bg-background text-xs", hasId && !hasEn && "border-amber-400/80 focus-visible:ring-amber-400/20")}
          />
        </div>
      </div>

      {nameFallback && <input type="hidden" name={nameFallback} value={defaultValue ?? ""} />}
      <FieldError id={`${nameId}-error`} message={error} />
    </div>
  )
}

function BilingualTextAreaField({
  label,
  nameId,
  nameEn,
  nameFallback,
  defaultValue,
  rows = 3,
  error,
  placeholderId,
  placeholderEn,
}: {
  label: string
  nameId: string
  nameEn: string
  nameFallback?: string
  defaultValue?: string
  rows?: number
  error?: string
  placeholderId?: string
  placeholderEn?: string
}) {
  const extracted = extractBilingualText(defaultValue)
  const [idVal, setIdVal] = useState(extracted.id)
  const [enVal, setEnVal] = useState(extracted.en)

  const hasId = Boolean(idVal.trim())
  const hasEn = Boolean(enVal.trim())

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor={nameId}>
            {label}
          </label>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Dwi-Bahasa (Bilingual)
          </span>
        </div>
        {hasId && hasEn ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            ✓ Lengkap (ID + EN)
          </span>
        ) : !hasId && hasEn ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            ⚠️ Versi ID Belum Diisi
          </span>
        ) : hasId && !hasEn ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            ⚠️ Versi EN Belum Diisi
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            🇮🇩 Bahasa Indonesia & 🇬🇧 English
          </span>
        )}
      </div>

      {!hasId && hasEn && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-semibold">Ringkasan versi Bahasa Indonesia belum diisi</p>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              Pengunjung berbahasa Indonesia akan melihat ringkasan versi English.
            </p>
          </div>
        </div>
      )}

      {hasId && !hasEn && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
          <span className="text-base leading-none">⚠️</span>
          <div>
            <p className="font-semibold">Ringkasan versi English belum diisi</p>
            <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
              Pengunjung berbahasa English akan melihat ringkasan versi Bahasa Indonesia.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              <span>Bahasa Indonesia (ID)</span>
            </div>
            {!hasId && hasEn && <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">(belum diisi)</span>}
          </div>
          <Textarea
            id={nameId}
            name={nameId}
            rows={rows}
            value={idVal}
            onChange={(e) => setIdVal(e.target.value)}
            placeholder={placeholderId || "Ringkasan dalam Bahasa Indonesia..."}
            className={cn("bg-background text-xs", !hasId && hasEn && "border-amber-400/80 focus-visible:ring-amber-400/20")}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <span>English (EN)</span>
            </div>
            {hasId && !hasEn && <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">(belum diisi)</span>}
          </div>
          <Textarea
            id={nameEn}
            name={nameEn}
            rows={rows}
            value={enVal}
            onChange={(e) => setEnVal(e.target.value)}
            placeholder={placeholderEn || "Summary in English..."}
            className={cn("bg-background text-xs", hasId && !hasEn && "border-amber-400/80 focus-visible:ring-amber-400/20")}
          />
        </div>
      </div>

      {nameFallback && <input type="hidden" name={nameFallback} value={defaultValue ?? ""} />}
      <FieldError id={`${nameId}-error`} message={error} />
    </div>
  )
}

function NewsCategoryField({ defaultValue = "", error }: { defaultValue?: string; error?: string }) {
  const isDefaultInList = defaultNewsCategories.includes(defaultValue)
  const [isCustom, setIsCustom] = useState(!isDefaultInList && Boolean(defaultValue))
  const [selected, setSelected] = useState(isDefaultInList ? defaultValue : defaultValue ? "__custom__" : defaultNewsCategories[0])
  const [customValue, setCustomValue] = useState(isDefaultInList ? "" : defaultValue)

  const handleSelectChange = (val: string) => {
    if (val === "__custom__") {
      setIsCustom(true)
      setSelected("__custom__")
    } else {
      setIsCustom(false)
      setSelected(val)
      setCustomValue("")
    }
  }

  const finalValue = isCustom ? customValue : selected

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="category_select">
          Category
        </label>
        <button
          type="button"
          onClick={() => {
            if (isCustom) {
              setIsCustom(false)
              setSelected(defaultNewsCategories[0])
            } else {
              setIsCustom(true)
              setSelected("__custom__")
            }
          }}
          className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 cursor-pointer"
        >
          {isCustom ? "Pilih dari daftar" : "+ Kustom"}
        </button>
      </div>

      <input type="hidden" name="category" value={finalValue} />

      {isCustom ? (
        <Input
          placeholder="Ketik nama kategori..."
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          className="bg-background text-xs"
          autoFocus
        />
      ) : (
        <div className="relative flex items-center">
          <select
            id="category_select"
            value={selected}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="h-9 w-full appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 px-3 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"
          >
            {defaultNewsCategories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
                {cat}
              </option>
            ))}
            <option value="__custom__" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
              + Kustom (Ketik Sendiri)...
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      )}

      <FieldError id="category-error" message={error} />
    </div>
  )
}

const defaultNewsCategories = [
  "Company News",
  "Projects & Commissioning",
  "Product & Technology",
  "Press Release",
  "CSR & Sustainability",
  "Events & Exhibitions",
  "Awards & Achievements",
  "Industry Insights",
  "General",
]

function SelectField({
  label,
  name,
  defaultValue,
  error,
  options,
}: {
  label: string
  name: string
  defaultValue: string
  error?: string
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor={name}>
        {label}
      </label>
      <div className="relative flex items-center">
        <select
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className="h-9 w-full appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 px-3 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"
          defaultValue={defaultValue}
          id={name}
          name={name}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </div>
  )
}
