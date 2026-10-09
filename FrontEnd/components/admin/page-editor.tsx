"use client"

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { Eye, FileJson, Globe2, LayoutTemplate, Save, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
import { LocalizedTextInput, type LocalizedValue } from "@/components/admin/localized-field"
import { SectionBuilder } from "@/components/admin/section-builder"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import { ContentLanguageProvider, useContentLanguage } from "@/components/cms/content-language"
import { SectionRenderer, emptySectionData, type SectionData } from "@/components/cms/section-renderer"
import { isSystemPageKey } from "@/lib/cms-shared"
import type { PageContent } from "@/lib/cms"
import { serializeLocalizedText, type Locale } from "@/lib/i18n"
import { toLocalizedText } from "@/lib/localized"
import type { SaveAction } from "@/lib/save-result"
import {
  addTranslation,
  emptyTranslation,
  normalizeSectionForEditor,
  presetSectionsForKey,
  sectionTranslation,
  sectionsFromContent,
  type Section,
  type TranslationStatus,
} from "@/lib/sections"
import { cn } from "@/lib/utils"

const statusOptions = ["draft", "published", "scheduled", "archived"]

type PageEditorProps = {
  action: SaveAction
  mode: "create" | "edit"
  page?: PageContent
  previewData?: SectionData
}

type SeoState = {
  title: LocalizedValue
  description: LocalizedValue
  canonical: string
  noIndex: boolean
}

export function PageEditor({ action, mode, page, previewData }: PageEditorProps) {
  const { lang: adminLang } = useContentLanguage()
  const initialContent = useMemo(() => page?.content ?? {}, [page?.content])

  const [title, setTitle] = useState<LocalizedValue>(() => toLocalizedText(page?.title))
  const [key, setKey] = useState(page?.key ?? "")
  const [slugTouched, setSlugTouched] = useState(mode === "edit")
  const [status, setStatus] = useState(page?.status ?? "draft")
  const [publishedAtInput, setPublishedAtInput] = useState(toDateTimeLocal(page?.publishedAt))
  const [seo, setSeo] = useState<SeoState>(() => ({
    title: toLocalizedText(page?.seo?.title),
    description: toLocalizedText(page?.seo?.description),
    canonical: page?.seo?.canonical ?? "",
    noIndex: Boolean(page?.seo?.noIndex),
  }))
  // Older "EN: …\nID: …" strings become { id, en } here, so the page is saved
  // in the new shape the first time it is edited.
  const [sections, setSections] = useState<Section[]>(() => {
    const existing = sectionsFromContent(initialContent)
    if (existing.length > 0) return existing.map(normalizeSectionForEditor)
    // Built-in pages open prefilled with their live design so editing here
    // edits exactly what visitors already see.
    return presetSectionsForKey(page?.key ?? "", initialContent) ?? []
  })
  const [previewLang, setPreviewLang] = useState<Locale>(adminLang)

  const formRef = useRef<HTMLFormElement>(null)
  const submittingRef = useRef(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { pending, result: saveResult, submit } = useSaveAction(action)
  // System pages are routed by the public site; their slug is fixed and the
  // backend rejects renames, so lock the field up front.
  const slugLocked = mode === "edit" && isSystemPageKey(page?.key ?? "")

  // Fields outside the builder (older pages kept data next to `sections`) are
  // carried over untouched.
  const content = useMemo(() => {
    const rest = Object.fromEntries(Object.entries(initialContent).filter(([field]) => field !== "sections"))
    return { ...rest, sections }
  }, [initialContent, sections])
  const contentJson = useMemo(() => JSON.stringify(content), [content])
  const publishedAt = useMemo(() => toIsoDateTime(publishedAtInput), [publishedAtInput])

  const snapshot = JSON.stringify({ title, key, status, publishedAtInput, seo, sections })
  const [initialSnapshot] = useState(snapshot)
  const dirty = snapshot !== initialSnapshot

  // Leaving with unsaved builder work loses it; ask first.
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => {
      if (submittingRef.current) return
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const progress = useMemo(() => translationProgress(title, seo, sections), [title, seo, sections])

  function handleTitleChange(next: LocalizedValue) {
    setTitle(next)
    if (!slugTouched && !slugLocked) setKey(slugify(next.en || next.id))
  }

  function handleSaveClick() {
    if (!formRef.current) return
    if (formRef.current.checkValidity() && title.id.trim()) {
      setShowConfirm(true)
    } else {
      formRef.current.reportValidity()
    }
  }

  // Enter in a text input triggers the browser's implicit form submission,
  // which would save without the confirmation dialog — route it through the
  // same confirm flow as the Save button instead.
  function handleFormKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || !(event.target instanceof HTMLInputElement)) return
    event.preventDefault()
    handleSaveClick()
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        // Submitted programmatically so a failed save returns state here and
        // the user's edits stay alive instead of the page re-rendering.
        event.preventDefault()
        submittingRef.current = true
        submit(event.currentTarget)
      }}
      onKeyDown={handleFormKeyDown}
      className="mt-2 grid gap-6 pb-24 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <MobileActionBar mode={mode} pending={pending} dirty={dirty} onClick={handleSaveClick} />
      {saveResult && (
        <div className="xl:col-span-2">
          <SaveErrorBanner
            result={saveResult}
            entity="page"
            onOverwrite={
              saveResult.serverVersion
                ? () => submit(formRef.current, { version: String(saveResult.serverVersion) })
                : undefined
            }
          />
        </div>
      )}
      {mode === "edit" && page && (
        <>
          <input name="id" type="hidden" value={page.id} />
          <input name="version" type="hidden" value={page.version} />
          <input name="oldKey" type="hidden" value={page.key} />
        </>
      )}
      <input name="content" type="hidden" value={contentJson} />
      <input name="publishedAt" type="hidden" value={publishedAt} />
      <input name="title_id" type="hidden" value={title.id} />
      <input name="title_en" type="hidden" value={title.en} />
      <input name="seoTitle" type="hidden" value={serializeLocalizedText(seo.title)} />
      <input name="seoDescription" type="hidden" value={serializeLocalizedText(seo.description)} />
      <input name="seoCanonical" type="hidden" value={seo.canonical} />
      {seo.noIndex && <input name="seoNoIndex" type="hidden" value="on" />}

      <div className="min-w-0 space-y-6">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <LocalizedTextInput
              label="Page title / Judul halaman"
              idPrefix="page-title"
              required
              value={title}
              onChange={handleTitleChange}
              error={saveResult?.fields?.title}
            />
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="key">
                Slug
              </label>
              <Input
                className={cn("mt-1.5", slugLocked && "cursor-not-allowed bg-secondary/60 opacity-70")}
                id="key"
                name="key"
                onChange={(event) => {
                  if (slugLocked) return
                  setSlugTouched(true)
                  setKey(slugify(event.target.value))
                }}
                required
                value={key}
                readOnly={slugLocked}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                {slugLocked
                  ? `System page — the website routes to ${publicPath(key)}.`
                  : `ID: ${publicPath(key)} · EN: /en${publicPath(key) === "/" ? "" : publicPath(key)}`}
              </p>
            </div>
          </div>
        </section>

        <Tabs defaultValue="builder" className="gap-4">
          <TabsList className="h-auto rounded-md">
            <TabsTrigger value="builder">
              <LayoutTemplate className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="source">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder">
            <SectionBuilder sections={sections} onChange={setSections} />
          </TabsContent>

          <TabsContent value="preview">
            <section className="overflow-hidden rounded-lg border border-border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {previewLang === "en" ? `/en${publicPath(key) === "/" ? "" : publicPath(key)}` : publicPath(key)}
                </p>
                <div role="group" aria-label="Preview language" className="inline-flex rounded-md border border-border bg-background p-0.5 text-xs">
                  {(["id", "en"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      aria-pressed={previewLang === lang}
                      onClick={() => setPreviewLang(lang)}
                      className={cn(
                        "rounded px-3 py-1 font-semibold",
                        previewLang === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-background">
                {sections.length > 0 ? (
                  // Components that read the language from context follow
                  // the preview toggle, like the public page follows its URL.
                  <ContentLanguageProvider initialLang={previewLang}>
                    <SectionRenderer
                      sections={sections}
                      data={previewData ?? emptySectionData}
                      lang={previewLang}
                      listingPlaceholder
                    />
                  </ContentLanguageProvider>
                ) : (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Belum ada section. Tambahkan dari tab Builder.
                  </p>
                )}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="source">
            <Textarea
              className="min-h-[520px] rounded-lg border-border bg-background font-mono text-xs"
              readOnly
              value={JSON.stringify(content, null, 2)}
            />
          </TabsContent>
        </Tabs>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-lg border border-border bg-background p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Publish</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="status">
                Status
              </label>
              <select
                className="mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                id="status"
                name="status"
                onChange={(event) => setStatus(event.target.value)}
                value={status}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p
                className={cn(
                  "mt-2.5 rounded-md border p-2.5 text-[11px] leading-relaxed",
                  status === "published"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
                )}
              >
                {status === "published"
                  ? "Terpublikasi: perubahan langsung tampil di website setelah disimpan (ID dan EN)."
                  : "Belum publik: halaman sistem menampilkan tampilan bawaan, halaman custom tidak tampil."}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="publishedAtInput">
                Publish date
              </label>
              <Input
                className="mt-2"
                disabled={status !== "published" && status !== "scheduled"}
                id="publishedAtInput"
                onChange={(event) => setPublishedAtInput(event.target.value)}
                type="datetime-local"
                value={publishedAtInput}
              />
            </div>

            <TranslationProgress progress={progress} />

            {mode === "edit" && page && (
              <div className="rounded-md bg-secondary px-3 py-2 text-sm text-muted-foreground">
                <p>Version: {page.version}</p>
                {dirty && <p className="font-medium text-amber-700 dark:text-amber-300">Ada perubahan yang belum disimpan</p>}
              </div>
            )}

            <Button className="hidden w-full lg:flex" disabled={pending} type="button" onClick={handleSaveClick}>
              <Save className="h-4 w-4" />
              {submitLabel(mode, pending)}
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">SEO</h2>
          </div>
          <div className="mt-4 space-y-4">
            <LocalizedTextInput
              label="SEO title"
              value={seo.title}
              onChange={(next) => setSeo((current) => ({ ...current, title: next }))}
              hint={<LengthHint value={seo.title} max={60} />}
            />
            <LocalizedTextInput
              label="SEO description"
              multiline
              value={seo.description}
              onChange={(next) => setSeo((current) => ({ ...current, description: next }))}
              hint={<LengthHint value={seo.description} max={160} />}
            />
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="seoCanonical">
                Canonical URL
              </label>
              <div className="relative mt-2">
                <Globe2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  id="seoCanonical"
                  placeholder="(otomatis per bahasa)"
                  onChange={(event) => setSeo((current) => ({ ...current, canonical: event.target.value }))}
                  value={seo.canonical}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm">
              <Checkbox
                checked={seo.noIndex}
                onCheckedChange={(checked) => setSeo((current) => ({ ...current, noIndex: checked === true }))}
              />
              Hide from search engines
            </label>
          </div>
        </section>
      </aside>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Page Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              {progress.gaps.length > 0
                ? `${progress.gaps.length} teks baru terisi dalam satu bahasa; versi yang kosong akan menampilkan bahasa lainnya di website.`
                : "Are you sure you want to save changes to this page?"}
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

function TranslationProgress({ progress }: { progress: TranslationStatus }) {
  if (progress.total === 0) return null
  const complete = progress.complete >= progress.total
  const missing = missingCounts(progress)
  return (
    <div className="rounded-md border border-border px-3 py-2 text-xs">
      <div className="flex items-center justify-between font-medium text-foreground">
        <span>Terjemahan ID + EN</span>
        <span className={complete ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
          {progress.complete}/{progress.total}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", complete ? "bg-emerald-500" : "bg-amber-500")}
          style={{ width: `${Math.round((progress.complete / progress.total) * 100)}%` }}
        />
      </div>
      {!complete && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {[missing.en > 0 && `${missing.en} teks belum ada versi EN`, missing.id > 0 && `${missing.id} belum ada versi ID`]
            .filter(Boolean)
            .join(" · ")}
          . Section yang belum lengkap ditandai kuning di builder.
        </p>
      )}
    </div>
  )
}

function missingCounts(progress: TranslationStatus): Record<Locale, number> {
  const counts: Record<Locale, number> = { id: 0, en: 0 }
  for (const gap of progress.gaps) counts[gap.missing]++
  return counts
}

function LengthHint({ value, max }: { value: LocalizedValue; max: number }) {
  const longest = Math.max(value.id.length, value.en.length)
  return (
    <span className={cn("text-[10px] tabular-nums", longest > max ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
      {value.id.length}/{value.en.length} · maks {max}
    </span>
  )
}

// Every translatable value on the page — title, SEO, and the localized fields
// of visible sections — and which of them still miss a language.
function translationProgress(title: LocalizedValue, seo: SeoState, sections: Section[]): TranslationStatus {
  const progress = emptyTranslation()
  addTranslation(progress, title, "Judul halaman")
  addTranslation(progress, seo.title, "SEO title")
  addTranslation(progress, seo.description, "SEO description")
  for (const section of sections) {
    if (section.hidden) continue
    const status = sectionTranslation(section)
    progress.total += status.total
    progress.complete += status.complete
    progress.gaps.push(...status.gaps)
  }
  return progress
}

function submitLabel(mode: "create" | "edit", pending: boolean) {
  if (pending) return "Saving..."
  return mode === "create" ? "Create Page" : "Save Page"
}

// Floating save bar for small screens, docked just above the bottom nav.
function MobileActionBar({
  mode,
  pending,
  dirty,
  onClick,
}: {
  mode: "create" | "edit"
  pending: boolean
  dirty: boolean
  onClick?: () => void
}) {
  return (
    <div className="fixed inset-x-3 bottom-[76px] z-30 flex items-center gap-2 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden print:hidden">
      {dirty && <span className="pl-2 text-xs font-medium text-amber-700 dark:text-amber-300">Belum disimpan</span>}
      <Button className="min-h-11 flex-1" disabled={pending} type="button" onClick={onClick}>
        <Save className="h-4 w-4" />
        {submitLabel(mode, pending)}
      </Button>
    </div>
  )
}

// The "home" page is served at the site root, not at /home.
function publicPath(key: string) {
  if (key === "home") return "/"
  return `/${key || "new-page"}`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function toDateTimeLocal(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  try {
    return new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(" ", "T")
  } catch {
    const offset = date.getTimezoneOffset()
    const local = new Date(date.getTime() - offset * 60_000)
    return local.toISOString().slice(0, 16)
  }
}

function toIsoDateTime(value: string) {
  const text = String(value || "").trim()
  if (!text) return ""
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(text)) {
    return new Date(`${text}:00+07:00`).toISOString()
  }
  const date = new Date(text)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString()
}
