"use client"

import { useRef, useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"
import { DefaultSectionIcon, sectionIcons } from "@/components/cms/section-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { SECTION_ICON_NAMES, type FieldDef } from "@/lib/sections"
import { combineBilingualText, extractBilingualText } from "@/lib/bilingual"

// TipTap loads only when a section actually renders a rich-text field.
const RichTextEditor = dynamic(
  () => import("@/components/admin/rich-text-editor").then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <Skeleton className="h-40 w-full" /> },
)

const selectClass =
  "h-9 w-full appearance-none rounded-lg border border-slate-200/80 bg-white dark:bg-[#0f172a] dark:border-slate-800 px-3 pr-8 text-xs font-medium text-slate-900 dark:text-slate-100 shadow-2xs outline-none transition-colors hover:border-slate-300 dark:hover:border-slate-700 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 cursor-pointer"

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
  if (isTranslatableField(def)) {
    return (
      <BilingualSectionField
        def={def as Extract<FieldDef, { kind: "text" | "textarea" }>}
        value={value}
        onChange={onChange}
      />
    )
  }

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
          <div className="relative flex items-center">
            <select
              className={selectClass}
              value={asString(value) || def.options[0]?.value}
              onChange={(event) => onChange(event.target.value)}
            >
              {def.options.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
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
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 dark:border-slate-800 bg-secondary/50">
          <Icon className="h-4 w-4" />
        </span>
        <div className="relative flex flex-1 items-center">
          <select className={selectClass} value={value} onChange={(event) => onChange(event.target.value)}>
            <option value="" className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">(default)</option>
            {SECTION_ICON_NAMES.map((name) => (
              <option key={name} value={name} className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 py-1">
                {name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
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
          <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-secondary/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <Input
          className="bg-background text-xs"
          placeholder="https://... atau /uploads/..."
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
          size="sm"
          className="shrink-0 text-xs font-semibold"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          aria-label="Upload image"
        >
          {uploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="mr-1.5 h-3.5 w-3.5" /> Upload
            </>
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={() => onChange("")}
            title="Hapus gambar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
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

function isTranslatableField(def: FieldDef): boolean {
  if (def.kind !== "text" && def.kind !== "textarea") return false
  const name = def.name.toLowerCase()
  if (
    name.endsWith("href") ||
    name.endsWith("url") ||
    name.endsWith("path") ||
    name.endsWith("id") ||
    name.endsWith("class") ||
    name.endsWith("color") ||
    name.endsWith("type")
  ) {
    return false
  }
  const excluded = new Set([
    "icon",
    "source",
    "aspect",
    "id",
    "key",
    "phone",
    "fax",
    "email",
    "mapembedurl",
    "color",
    "theme",
    "variant",
    "size",
    "type",
    "value",
    "sortorder",
    "depth",
  ])
  if (excluded.has(name)) return false
  return true
}

function BilingualSectionField({
  def,
  value,
  onChange,
}: {
  def: Extract<FieldDef, { kind: "text" | "textarea" }>
  value: unknown
  onChange: (value: string) => void
}) {
  const strValue = asString(value)
  const [showRaw, setShowRaw] = useState(false)
  const isTextarea = def.kind === "textarea"

  const { id: extractedId, en: extractedEn } = extractBilingualText(strValue)

  function handleIdChange(newId: string) {
    const combined = combineBilingualText({ id: newId, en: extractedEn })
    onChange(combined)
  }

  function handleEnChange(newEn: string) {
    const combined = combineBilingualText({ id: extractedId, en: newEn })
    onChange(combined)
  }

  const hasId = Boolean(extractedId.trim())
  const hasEn = Boolean(extractedEn.trim())

  return (
    <div className="rounded-lg border border-border/70 bg-secondary/15 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {def.label}
          </label>
          {hasId && hasEn ? (
            <span
              title="Lengkap: Versi ID dan EN terisi"
              className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
            >
              ✓ ID + EN
            </span>
          ) : !hasId && hasEn ? (
            <span
              title="Peringatan: Versi Bahasa Indonesia kosong"
              className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            >
              ⚠️ ID Kosong
            </span>
          ) : hasId && !hasEn ? (
            <span
              title="Peringatan: Versi English kosong"
              className="inline-flex items-center gap-1 rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
            >
              ⚠️ EN Kosong
            </span>
          ) : strValue ? (
            <span
              title="Peringatan: Belum terisi"
              className="inline-flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
            >
              ⚠️ Kosong
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setShowRaw(!showRaw)}
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {showRaw ? "Mode Dwi-Bahasa" : "Raw"}
        </button>
      </div>

      {showRaw ? (
        isTextarea ? (
          <Textarea
            className="min-h-20 bg-background font-mono text-xs"
            placeholder={def.placeholder}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Input
            className="bg-background font-mono text-xs"
            placeholder={def.placeholder}
            value={strValue}
            onChange={(e) => onChange(e.target.value)}
          />
        )
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {/* Bahasa Indonesia (ID) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              <span>Bahasa Indonesia (ID)</span>
            </div>
            {isTextarea ? (
              <Textarea
                className="min-h-20 bg-background text-xs"
                placeholder={def.placeholder ? `[ID] ${def.placeholder}` : `[ID] ${def.label}...`}
                value={extractedId}
                onChange={(e) => handleIdChange(e.target.value)}
              />
            ) : (
              <Input
                className="bg-background text-xs"
                placeholder={def.placeholder ? `[ID] ${def.placeholder}` : `[ID] ${def.label}...`}
                value={extractedId}
                onChange={(e) => handleIdChange(e.target.value)}
              />
            )}
          </div>

          {/* English (EN) */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <span>English (EN)</span>
            </div>
            {isTextarea ? (
              <Textarea
                className="min-h-20 bg-background text-xs"
                placeholder={def.placeholder ? `[EN] ${def.placeholder}` : `[EN] ${def.label}...`}
                value={extractedEn}
                onChange={(e) => handleEnChange(e.target.value)}
              />
            ) : (
              <Input
                className="bg-background text-xs"
                placeholder={def.placeholder ? `[EN] ${def.placeholder}` : `[EN] ${def.label}...`}
                value={extractedEn}
                onChange={(e) => handleEnChange(e.target.value)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

