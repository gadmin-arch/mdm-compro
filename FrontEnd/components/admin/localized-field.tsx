"use client"

import { useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { localizedStatus, type Locale, type LocalizedText } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// TipTap loads only when a rich-text field is on screen.
const RichTextEditor = dynamic(
  () => import("@/components/admin/rich-text-editor").then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <Skeleton className="h-40 w-full" /> },
)

export type LocalizedValue = Required<LocalizedText>

const LANG_TAG: Record<Locale, string> = { id: "ID", en: "EN" }
const LANG_NAME: Record<Locale, string> = { id: "Bahasa Indonesia", en: "English" }

// Amber only marks a missing translation (the other language has text); a
// field empty in both is just an unused optional field.
const MISSING_INPUT = "border-amber-400 bg-amber-50/60 dark:border-amber-700 dark:bg-amber-950/20"

function StatusChip({ filled, lang, otherFilled }: { filled: boolean; lang: Locale; otherFilled: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold",
        filled
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          : otherFilled
            ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            : "border-border bg-secondary/60 text-muted-foreground",
      )}
    >
      {LANG_TAG[lang]} {filled ? "✓" : "kosong"}
    </span>
  )
}

function FieldHeader({
  label,
  value,
  required,
  htmlFor,
  hint,
}: {
  label: string
  value: LocalizedText
  required?: boolean
  htmlFor?: string
  hint?: ReactNode
}) {
  const status = localizedStatus(value)
  return (
    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      <div className="flex items-center gap-1.5">
        {hint}
        <StatusChip filled={status.id} lang="id" otherFilled={status.en} />
        <StatusChip filled={status.en} lang="en" otherFilled={status.id} />
      </div>
    </div>
  )
}

function CopyFromIdButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      title="Isi versi English dengan teks Indonesia sebagai titik awal terjemahan"
    >
      <Copy className="h-3 w-3" />
      Salin dari ID
    </button>
  )
}

function LangTag({ lang }: { lang: Locale }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
      <span className={cn("inline-block h-1.5 w-1.5 rounded-full", lang === "id" ? "bg-red-500" : "bg-blue-500")} />
      {LANG_NAME[lang]}
    </span>
  )
}

/**
 * One translatable text, edited as two plain inputs side by side (stacked on
 * small screens). The value is the { id, en } pair itself — nothing is parsed
 * or merged while typing, so clearing, pasting and line breaks behave like
 * any other input. English shows the Indonesian text as its placeholder; an
 * empty English falls back to Indonesian on the public site.
 */
export function LocalizedTextInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  required,
  idPrefix,
  hint,
  error,
}: {
  label: string
  value: LocalizedText
  onChange: (value: LocalizedValue) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  required?: boolean
  // Gives the inputs stable ids (label targets, form validation).
  idPrefix?: string
  hint?: ReactNode
  error?: string
}) {
  const current: LocalizedValue = { id: value.id ?? "", en: value.en ?? "" }
  const set = (lang: Locale, text: string) => onChange({ ...current, [lang]: text })
  const missing = (lang: Locale) => !current[lang].trim() && Boolean(current[lang === "id" ? "en" : "id"].trim())

  const control = (lang: Locale) => {
    const common = {
      id: idPrefix ? `${idPrefix}-${lang}` : undefined,
      value: current[lang],
      lang,
      "aria-label": `${label} (${LANG_NAME[lang]})`,
      "aria-invalid": lang === "id" && error ? true : undefined,
      placeholder: lang === "en" ? current.id || placeholder || "English…" : placeholder || "Bahasa Indonesia…",
      className: cn("bg-background text-sm", missing(lang) && MISSING_INPUT, lang === "id" && error && "border-destructive"),
    }
    return multiline ? (
      <Textarea {...common} rows={rows} onChange={(event) => set(lang, event.target.value)} />
    ) : (
      <Input {...common} onChange={(event) => set(lang, event.target.value)} />
    )
  }

  return (
    <div>
      <FieldHeader label={label} value={current} required={required} htmlFor={idPrefix ? `${idPrefix}-id` : undefined} hint={hint} />
      <div className="grid gap-2 md:grid-cols-2">
        <div className="space-y-1">
          <LangTag lang="id" />
          {control("id")}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <LangTag lang="en" />
            <CopyFromIdButton disabled={!current.id.trim()} onClick={() => set("en", current.id)} />
          </div>
          {control("en")}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}

/**
 * A translatable list ("one item per line"). Lines are paired by position: line
 * 3 in Indonesian and line 3 in English are the same item. A missing English
 * line falls back to the Indonesian one on the public site.
 */
export function LocalizedLinesInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: LocalizedText[]
  onChange: (value: LocalizedValue[]) => void
  placeholder?: string
}) {
  // The raw text is kept while editing so a trailing newline survives the
  // round trip through the parsed list.
  const [text, setText] = useState<Record<Locale, string>>(() => ({
    id: value.map((item) => item.id ?? "").join("\n"),
    en: value.map((item) => item.en ?? "").join("\n"),
  }))

  function update(lang: Locale, next: string) {
    const nextText = { ...text, [lang]: next }
    setText(nextText)
    const idLines = nextText.id.split("\n")
    const enLines = nextText.en.split("\n")
    const count = Math.max(idLines.length, enLines.length)
    const items: LocalizedValue[] = []
    for (let index = 0; index < count; index++) {
      const item = { id: (idLines[index] ?? "").trim(), en: (enLines[index] ?? "").trim() }
      if (item.id || item.en) items.push(item)
    }
    onChange(items)
  }

  const idCount = text.id.split("\n").filter((line) => line.trim()).length
  const enCount = text.en.split("\n").filter((line) => line.trim()).length
  // Every line with text on one side only, wherever it sits in the list.
  const lines = { id: text.id.split("\n"), en: text.en.split("\n") }
  const short = (lang: Locale) => {
    const other = lang === "id" ? "en" : "id"
    return lines[other].some((line, index) => line.trim() && !(lines[lang][index] ?? "").trim())
  }

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={cn("text-[11px]", idCount === enCount ? "text-muted-foreground" : "text-amber-600 dark:text-amber-400")}>
          {idCount} baris ID · {enCount} baris EN
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {(["id", "en"] as const).map((lang) => (
          <div key={lang} className="space-y-1">
            <LangTag lang={lang} />
            <Textarea
              className={cn("min-h-24 bg-background font-mono text-xs", short(lang) && MISSING_INPUT)}
              lang={lang}
              aria-label={`${label} (${LANG_NAME[lang]})`}
              placeholder={placeholder ?? "Satu item per baris"}
              value={text[lang]}
              onChange={(event) => update(lang, event.target.value)}
            />
          </div>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">Baris ke-n di ID dan EN adalah item yang sama.</p>
    </div>
  )
}

/**
 * Translatable rich text: one editor per language, switched with tabs that
 * are local to this field (independent from the admin's preview language).
 */
export function LocalizedRichTextInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: LocalizedText
  onChange: (value: LocalizedValue) => void
}) {
  const [tab, setTab] = useState<Locale>("id")
  const current: LocalizedValue = { id: value.id ?? "", en: value.en ?? "" }
  const filled = (html: string) => html.replace(/<[^>]+>/g, "").trim().length > 0 || /<img\b/i.test(html)

  return (
    <div>
      <FieldHeader
        label={label}
        value={{ id: filled(current.id) ? "x" : "", en: filled(current.en) ? "x" : "" }}
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <div role="tablist" className="inline-flex rounded-md border border-border bg-secondary/40 p-0.5 text-xs">
          {(["id", "en"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              role="tab"
              aria-selected={tab === lang}
              onClick={() => setTab(lang)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-3 py-1 font-semibold transition-colors",
                tab === lang ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {LANG_TAG[lang]}
              {!filled(current[lang]) && filled(current[lang === "id" ? "en" : "id"]) && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-label="belum diisi" />
              )}
            </button>
          ))}
        </div>
        {tab === "en" && (
          <CopyFromIdButton
            disabled={!filled(current.id)}
            onClick={() => onChange({ ...current, en: current.id })}
          />
        )}
      </div>
      {/* Keyed per language so each tab mounts its own editor instance. */}
      <RichTextEditor
        key={tab}
        value={current[tab]}
        onChange={(html) => onChange({ ...current, [tab]: html })}
      />
    </div>
  )
}

/**
 * LocalizedTextInput for classic <form> submissions: keeps its own state and
 * posts `<name>_id` and `<name>_en` hidden fields for the server action.
 */
export function LocalizedFormField({
  name,
  defaultValue,
  ...rest
}: {
  name: string
  defaultValue: LocalizedText
  label: string
  multiline?: boolean
  rows?: number
  placeholder?: string
  required?: boolean
  hint?: ReactNode
  error?: string
}) {
  const [value, setValue] = useState<LocalizedValue>({ id: defaultValue.id ?? "", en: defaultValue.en ?? "" })
  return (
    <>
      <input type="hidden" name={`${name}_id`} value={value.id} />
      <input type="hidden" name={`${name}_en`} value={value.en} />
      <LocalizedTextInput {...rest} idPrefix={name} value={value} onChange={setValue} />
    </>
  )
}
