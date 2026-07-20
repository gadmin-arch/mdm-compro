"use client"

import { useRef, useState } from "react"
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"
import { DefaultSectionIcon, sectionIcons } from "@/components/cms/section-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { SECTION_ICON_NAMES, type FieldDef } from "@/lib/sections"

// TipTap loads only when a section actually renders a rich-text field.
const RichTextEditor = dynamic(
  () => import("@/components/admin/rich-text-editor").then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <Skeleton className="h-40 w-full" /> },
)

const selectClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

type EditorProps = {
  fields: FieldDef[]
  value: Record<string, unknown>
  onChange: (patch: Record<string, unknown>) => void
}

export function SectionFieldsEditor({ fields, value, onChange }: EditorProps) {
  return (
    <div className="grid gap-4">
      {fields.map((def) => (
        <FieldControl
          key={def.name}
          def={def}
          value={value[def.name]}
          onChange={(next) => onChange({ [def.name]: next })}
        />
      ))}
    </div>
  )
}

function FieldControl({
  def,
  value,
  onChange,
}: {
  def: FieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (def.kind) {
    case "text":
      return (
        <LabeledField label={def.label}>
          <Input
            className="bg-background"
            placeholder={def.placeholder}
            value={asString(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </LabeledField>
      )
    case "textarea":
      return (
        <LabeledField label={def.label}>
          <Textarea
            className="min-h-20 bg-background"
            placeholder={def.placeholder}
            value={asString(value)}
            onChange={(event) => onChange(event.target.value)}
          />
        </LabeledField>
      )
    case "lines":
      return (
        <LabeledField label={def.label}>
          <Textarea
            className="min-h-20 bg-background"
            placeholder={def.placeholder ?? "One item per line"}
            value={Array.isArray(value) ? value.map(String).join("\n") : asString(value)}
            onChange={(event) => onChange(event.target.value.split("\n"))}
            onBlur={(event) =>
              onChange(
                event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
            }
          />
        </LabeledField>
      )
    case "number":
      return (
        <LabeledField label={def.label}>
          <Input
            className="bg-background"
            type="number"
            min={def.min}
            max={def.max}
            value={value == null || value === "" ? "" : Number(value)}
            onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
          />
        </LabeledField>
      )
    case "toggle":
      return (
        <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
          <Checkbox checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked === true)} />
          {def.label}
        </label>
      )
    case "select":
      return (
        <LabeledField label={def.label}>
          <select
            className={selectClass}
            value={asString(value) || def.options[0]?.value}
            onChange={(event) => onChange(event.target.value)}
          >
            {def.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </LabeledField>
      )
    case "icon":
      return <IconField label={def.label} value={asString(value)} onChange={onChange} />
    case "richtext":
      return (
        <LabeledField label={def.label}>
          <RichTextEditor value={asString(value)} onChange={(html) => onChange(html)} />
        </LabeledField>
      )
    case "image":
      return <ImageField label={def.label} value={asString(value)} onChange={onChange} />
    case "list":
      return <ListField def={def} value={value} onChange={onChange} />
    default:
      return null
  }
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function IconField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: unknown) => void
}) {
  const Icon = sectionIcons[value] ?? DefaultSectionIcon
  return (
    <LabeledField label={label}>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-secondary/50">
          <Icon className="h-4 w-4" />
        </span>
        <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value)}>
          <option value="">(default)</option>
          {SECTION_ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </LabeledField>
  )
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: unknown) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setUploading(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = (await response.json().catch(() => null)) as { url?: string; message?: string } | null
      if (!response.ok || !data?.url) {
        setError(data?.message ?? "Upload failed.")
        return
      }
      onChange(data.url)
    } catch {
      setError("Upload failed.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <LabeledField label={label}>
      <div className="flex items-center gap-2">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-9 w-14 shrink-0 rounded-md border border-border object-cover"
          />
        )}
        <Input
          className="bg-background"
          placeholder="/placeholder.jpg or upload"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          ref={fileRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void upload(file)
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          aria-label="Upload image"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </LabeledField>
  )
}

function ListField({
  def,
  value,
  onChange,
}: {
  def: Extract<FieldDef, { kind: "list" }>
  value: unknown
  onChange: (value: unknown) => void
}) {
  const items = Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    : []

  function updateItem(index: number, patch: Record<string, unknown>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return
    const copy = [...items]
    const [moved] = copy.splice(index, 1)
    copy.splice(nextIndex, 0, moved)
    onChange(copy)
  }

  function addItem() {
    const empty = Object.fromEntries(def.fields.map((field) => [field.name, ""]))
    onChange([...items, empty])
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {def.label}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={def.max != null && items.length >= def.max}
          onClick={addItem}
        >
          <Plus className="h-3.5 w-3.5" />
          {def.itemLabel}
        </Button>
      </div>

      <div className="mt-2 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-md border border-border bg-secondary/20 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {def.itemLabel} {index + 1}
              </p>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => removeItem(index)}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <SectionFieldsEditor
              fields={def.fields}
              value={item}
              onChange={(patch) => updateItem(index, patch)}
            />
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-md border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
            No {def.label.toLowerCase()} yet.
          </div>
        )}
      </div>
    </div>
  )
}

function asString(value: unknown): string {
  return value == null ? "" : String(value)
}
