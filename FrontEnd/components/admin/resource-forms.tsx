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
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
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
      className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
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

      <div className="space-y-6 rounded-lg border border-border bg-background p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field label="Name" name="title" required defaultValue={item?.title} error={fields?.title} />
          <Field label="Slug" name="slug" required defaultValue={item?.slug} error={fields?.slug} />
        </div>
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
        <Field label="Short description" name="summary" defaultValue={item?.summary} />
        <TextAreaField
          label="Description"
          name="contentText"
          rows={12}
          defaultValue={textFromBlocks(item?.content)}
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
              label="Datasheet"
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
      className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
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

      <div className="space-y-6 rounded-lg border border-border bg-background p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field label="Title" name="title" required defaultValue={item?.title} error={fields?.title} />
          <Field label="Slug" name="slug" required defaultValue={item?.slug} error={fields?.slug} />
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <Field label="Excerpt" name="excerpt" defaultValue={item?.excerpt} error={fields?.excerpt} />
          <Field label="Category" name="category" defaultValue={item?.category} error={fields?.category} />
        </div>
        <RichTextField label="Body" name="bodyHtml" defaultValue={htmlFromBlocks(item?.body)} />
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
        <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm">
          <input defaultChecked={Boolean(item?.featured)} name="featured" type="checkbox" />
          Featured
        </label>
        <SeoFields seo={item?.seo} />
      </Sidebar>

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
      className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
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

      <div className="space-y-6 rounded-lg border border-border bg-background p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field label="Role title" name="title" required defaultValue={item?.title} error={fields?.title} />
          <Field label="Slug" name="slug" required defaultValue={item?.slug} error={fields?.slug} />
        </div>
        <TextAreaField label="Summary" name="summary" rows={4} defaultValue={item?.summary} error={fields?.summary} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Department" name="department" required defaultValue={item?.department} error={fields?.department} />
          <Field label="Location" name="location" required defaultValue={item?.location} error={fields?.location} />
        </div>
        <RichTextField
          label="Job description"
          name="descriptionHtml"
          defaultValue={htmlFromBlocks(item?.description)}
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
    <aside className="space-y-4 rounded-lg border border-border bg-background p-5 xl:sticky xl:top-6 xl:self-start">
      <h2 className="font-display text-lg font-semibold text-foreground">Publish</h2>
      {children}
      {itemVersion && (
        <div className="rounded-md bg-secondary px-3 py-2 text-sm text-muted-foreground">
          Version: {itemVersion}
        </div>
      )}
      <Button className="w-full" disabled={pending} type="button" onClick={onClickSubmit}>
        <Save className="h-4 w-4" />
        {pending ? "Saving..." : buttonLabel}
      </Button>
    </aside>
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
      <h3 className="text-sm font-semibold text-foreground">SEO</h3>
      <Field label="SEO title" name="seoTitle" defaultValue={seo?.title} />
      <TextAreaField label="SEO description" name="seoDescription" rows={3} defaultValue={seo?.description} />
      <Field label="Canonical URL" name="seoCanonical" defaultValue={seo?.canonical} />
      <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm">
        <input defaultChecked={Boolean(seo?.noIndex)} name="seoNoIndex" type="checkbox" />
        Hide from search engines
      </label>
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1.5 text-sm text-destructive" id={id}>
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
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <Input
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2"
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
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <Textarea
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2"
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
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <select
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className="mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        defaultValue={defaultValue}
        id={name}
        name={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={`${name}-error`} message={error} />
    </div>
  )
}
