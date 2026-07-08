"use client"

import type { ReactNode } from "react"
import { useState, useRef } from "react"
import { useFormStatus } from "react-dom"
import type { Career, ContentNode, NewsItem } from "@/lib/cms"
import {
  adminStatusOptions,
  employmentTypeOptions,
  specsToText,
  textFromBlocks,
  toDateTimeLocal,
} from "@/lib/admin-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { MediaUpload } from "@/components/admin/media-upload"
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

type Action = (formData: FormData) => void | Promise<void>

type ContentItemFormProps = {
  action: Action
  item?: ContentNode
  mode: "create" | "edit"
  parentOptions?: ContentNode[]
  resource: "services" | "products"
}

type NewsFormProps = {
  action: Action
  item?: NewsItem
  mode: "create" | "edit"
}

type CareerFormProps = {
  action: Action
  item?: Career
  mode: "create" | "edit"
}

export function ContentItemForm({ action, item, mode, parentOptions = [], resource }: ContentItemFormProps) {
  const isProduct = resource === "products"
  const selectableParents = parentOptions.filter((option) => option.id !== item?.id)
  const formRef = useRef<HTMLFormElement>(null)
  const [showConfirm, setShowConfirm] = useState(false)

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
    <form ref={formRef} action={action} className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
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
          <Field label="Name" name="title" required defaultValue={item?.title} />
          <Field label="Slug" name="slug" required defaultValue={item?.slug} />
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
        onClickSubmit={handleSaveClick}
      >
        <StatusField defaultValue={item?.status} />
        <Field label="Publish date" name="publishedAt" type="datetime-local" defaultValue={toDateTimeLocal(item?.publishedAt)} />
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={String(item?.sortOrder ?? 0)} />
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
    <form ref={formRef} action={action} className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {mode === "edit" && item && (
        <>
          <input name="id" type="hidden" value={item.id} />
          <input name="version" type="hidden" value={item.version} />
          <input name="oldSlug" type="hidden" value={item.slug} />
        </>
      )}

      <div className="space-y-6 rounded-lg border border-border bg-background p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field label="Title" name="title" required defaultValue={item?.title} />
          <Field label="Slug" name="slug" required defaultValue={item?.slug} />
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <Field label="Excerpt" name="excerpt" defaultValue={item?.excerpt} />
          <Field label="Category" name="category" defaultValue={item?.category} />
        </div>
        <TextAreaField label="Body" name="bodyText" rows={14} defaultValue={textFromBlocks(item?.body)} />
        <MediaUpload
          label="Featured Image"
          name="featuredImageUrl"
          defaultValue={item?.featuredImageUrl}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          isImage={true}
        />
      </div>

      <Sidebar buttonLabel={mode === "create" ? "Create News" : "Save News"} itemVersion={item?.version} onClickSubmit={handleSaveClick}>
        <StatusField defaultValue={item?.status} />
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
    <form ref={formRef} action={action} className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {mode === "edit" && item && (
        <>
          <input name="id" type="hidden" value={item.id} />
          <input name="version" type="hidden" value={item.version} />
          <input name="oldSlug" type="hidden" value={item.slug} />
        </>
      )}

      <div className="space-y-6 rounded-lg border border-border bg-background p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
          <Field label="Role title" name="title" required defaultValue={item?.title} />
          <Field label="Slug" name="slug" required defaultValue={item?.slug} />
        </div>
        <TextAreaField label="Summary" name="summary" rows={4} defaultValue={item?.summary} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Department" name="department" required defaultValue={item?.department} />
          <Field label="Location" name="location" required defaultValue={item?.location} />
        </div>
        <TextAreaField
          label="Job description"
          name="descriptionText"
          rows={14}
          defaultValue={textFromBlocks(item?.description)}
        />
        <Field label="Apply URL" name="applyUrl" placeholder="https://docs.google.com/forms/..." defaultValue={item?.applyUrl} />
      </div>

      <Sidebar buttonLabel={mode === "create" ? "Create Career" : "Save Career"} itemVersion={item?.version} onClickSubmit={handleSaveClick}>
        <StatusField defaultValue={item?.status} />
        <SelectField
          label="Employment"
          name="employmentType"
          defaultValue={item?.employmentType ?? "full_time"}
          options={employmentTypeOptions}
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
  onClickSubmit,
}: {
  buttonLabel: string
  children: ReactNode
  itemVersion?: number
  onClickSubmit?: () => void
}) {
  const { pending } = useFormStatus()
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

function StatusField({ defaultValue }: { defaultValue?: string }) {
  return (
    <SelectField
      label="Status"
      name="status"
      defaultValue={defaultValue ?? "draft"}
      options={adminStatusOptions.map((status) => ({ value: status, label: status }))}
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

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  type = "text",
}: {
  label: string
  name: string
  defaultValue?: string
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
        className="mt-2"
        defaultValue={defaultValue ?? ""}
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  )
}

function TextAreaField({
  label,
  name,
  defaultValue,
  placeholder,
  rows,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  rows: number
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <Textarea
        className="mt-2"
        defaultValue={defaultValue ?? ""}
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  )
}

function FileField({
  accept,
  label,
  name,
}: {
  accept: string
  label: string
  name: string
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <Input accept={accept} className="mt-2" id={name} name={name} type="file" />
    </div>
  )
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue: string
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground" htmlFor={name}>
        {label}
      </label>
      <select
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
    </div>
  )
}
