"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Eye,
  FileJson,
  Globe2,
  LayoutTemplate,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react"
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
import * as React from "react"
import { SectionBuilder } from "@/components/admin/section-builder"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import {
  SectionRenderer,
  emptySectionData,
  type SectionData,
} from "@/components/cms/section-renderer"
import { isSystemPageKey, type PageContent, type SEO } from "@/lib/cms"
import type { SaveAction } from "@/lib/save-result"
import { presetSectionsForKey, sectionsFromContent, type Section } from "@/lib/sections"
import { combineBilingualText, extractBilingualText, lookupDictionary } from "@/lib/bilingual"
import { BILINGUAL_PAGE_FIELDS, DEFAULT_BILINGUAL_IMPACT_VALUES } from "@/lib/page-bilingual"

type ContactOffice = {
  name: string
  address: string
  phone?: string
  fax?: string
  email?: string
  mapEmbedUrl?: string
}

const statusOptions = ["draft", "published", "scheduled", "archived"]
const blockTypes = ["heading", "paragraph", "quote", "list"]
const fieldTypes = ["text", "list", "json"] as const

type FieldType = (typeof fieldTypes)[number]

type FieldRow = {
  id: string
  key: string
  type: FieldType
  value: string
}

type BlockRow = {
  id: string
  type: string
  text: string
}

type PageEditorProps = {
  action: SaveAction
  mode: "create" | "edit"
  page?: PageContent
  previewData?: SectionData
}

export function PageEditor({ action, mode, page, previewData }: PageEditorProps) {
  const initialContent = page?.content ?? { blocks: [] }
  const extractedTitle = useMemo(() => extractBilingualText(page?.title), [page?.title])
  const [titleId, setTitleId] = useState(extractedTitle.id || (page?.title ?? ""))
  const [titleEn, setTitleEn] = useState(extractedTitle.en || (page?.title ?? ""))
  const [key, setKey] = useState(page?.key ?? "")
  const [slugTouched, setSlugTouched] = useState(mode === "edit")
  const [status, setStatus] = useState(page?.status ?? "draft")
  const [publishedAtInput, setPublishedAtInput] = useState(toDateTimeLocal(page?.publishedAt))
  const [seo, setSeo] = useState<SEO>(page?.seo ?? {})
  const [fields, setFields] = useState<FieldRow[]>(() => contentToFields(initialContent, page?.key))
  const [blocks, setBlocks] = useState<BlockRow[]>(() => contentToBlocks(initialContent))
  const [sections, setSections] = useState<Section[]>(() => {
    const existing = sectionsFromContent(initialContent)
    if (existing.length > 0) return existing
    // Built-in pages (home/about) open prefilled with their live design so
    // editing here edits exactly what visitors already see.
    return presetSectionsForKey(page?.key ?? "", initialContent) ?? []
  })
  const formRef = React.useRef<HTMLFormElement>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const { pending, result: saveResult, submit } = useSaveAction(action)
  // System pages are routed by the public site; their slug is fixed and the
  // backend rejects renames, so lock the field up front.
  const slugLocked = mode === "edit" && isSystemPageKey(page?.key ?? "")

  const [contactEmail, setContactEmail] = useState(() => String(initialContent.email ?? "info@multidayamitra.co.id"))
  const [contactPhone, setContactPhone] = useState(() => String(initialContent.phone ?? "+62 31 592 1256"))
  const [contactFax, setContactFax] = useState(() => String(initialContent.fax ?? "+62 31 591 7845"))
  const [contactOffices, setContactOffices] = useState<ContactOffice[]>(() => {
    if (Array.isArray(initialContent.offices)) {
      return initialContent.offices as ContactOffice[]
    }
    return [
      {
        name: "Head Office (Surabaya)",
        address: "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia",
        phone: "+62 31 592 1256",
        fax: "+62 31 591 7845",
        email: "info@multidayamitra.co.id",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.574636906236!2d112.7747579!3d-7.2854787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbc8a9c411c1%3A0x3f527ebff4e81cdd!2sMulti%20Daya%20Mitra%20PT.!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
      },
      {
        name: "Jakarta Branch Office",
        address: "Gedung Buncit 36, Jl. Warung Jati Barat No. 36, Ragunan, Pasar Minggu, Jakarta Selatan 12550, Indonesia",
        phone: "+62 21 3049 6101",
        email: "info@multidayamitra.co.id",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.845345719391!2d106.82239457426868!3d-6.2840599937048745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3d53fb7969f%3A0x6e9f16ef0e85d95e!2sGedung%20Buncit%2036!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
      },
      {
        name: "Surabaya Operations Branch",
        address: "Royal Park Residence Blok R No. 23, Gunung Anyar Tambak, Gunung Anyar, Surabaya 60294, Jawa Timur, Indonesia",
        email: "info@multidayamitra.co.id",
        phone: "",
        fax: "",
        mapEmbedUrl: ""
      }
    ]
  })

  const publishedAt = useMemo(() => toIsoDateTime(publishedAtInput), [publishedAtInput])
  const isContactPage = key === "contact"
  const content = useMemo(() => {
    if (isContactPage) {
      const base: Record<string, unknown> = {
        email: contactEmail,
        phone: contactPhone,
        fax: contactFax,
        offices: contactOffices,
        blocks: [],
      }
      if (sections.length > 0) {
        base.sections = sections
      }
      return base
    }
    const base = buildContent(fields, blocks)
    if (sections.length > 0) {
      base.sections = sections
    }
    return base
  }, [isContactPage, fields, blocks, sections, contactEmail, contactPhone, contactFax, contactOffices])
  const contentJson = useMemo(() => JSON.stringify(content), [content])
  const prettyContentJson = useMemo(() => JSON.stringify(content, null, 2), [content])

  function handleTitleIdChange(value: string) {
    setTitleId(value)
    if (!slugTouched && !slugLocked) {
      setKey(slugify(titleEn || value))
    }
  }

  function handleTitleEnChange(value: string) {
    setTitleEn(value)
    if (!slugTouched && !slugLocked) {
      setKey(slugify(value || titleId))
    }
  }

  function addField() {
    setFields((current) => [
      ...current,
      { id: makeId("field"), key: "", type: "text", value: "" },
    ])
  }

  function updateField(id: string, patch: Partial<FieldRow>) {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    )
  }

  function removeField(id: string) {
    setFields((current) => current.filter((field) => field.id !== id))
  }

  function addBlock(type = "paragraph") {
    setBlocks((current) => [...current, { id: makeId("block"), type, text: "" }])
  }

  function updateBlock(id: string, patch: Partial<BlockRow>) {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    )
  }

  function removeBlock(id: string) {
    setBlocks((current) => current.filter((block) => block.id !== id))
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const copy = [...current]
      const [item] = copy.splice(index, 1)
      copy.splice(nextIndex, 0, item)
      return copy
    })
  }

  function handleSaveClick() {
    if (!formRef.current) return
    if (formRef.current.checkValidity()) {
      setShowConfirm(true)
    } else {
      formRef.current.reportValidity()
    }
  }

  // Enter in a text input triggers the browser's implicit form submission,
  // which would save without the confirmation dialog — route it through the
  // same confirm flow as the Save button instead.
  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
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
        submit(event.currentTarget)
      }}
      onKeyDown={handleFormKeyDown}
      className="mt-2 grid gap-6 pb-24 lg:pb-0 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <MobileActionBar mode={mode} pending={pending} onClick={handleSaveClick} />
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
      <input name="seoTitle" type="hidden" value={seo.title ?? ""} />
      <input name="seoDescription" type="hidden" value={seo.description ?? ""} />
      <input name="seoCanonical" type="hidden" value={seo.canonical ?? ""} />
      {seo.noIndex && <input name="seoNoIndex" type="hidden" value="on" />}

      <div className="space-y-6">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Page Title / Judul Halaman <span className="text-destructive">*</span>
                </label>
                {Boolean(titleId.trim()) && Boolean(titleEn.trim()) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    ✓ Lengkap (ID + EN)
                  </span>
                ) : !Boolean(titleId.trim()) && Boolean(titleEn.trim()) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    ⚠️ Versi ID Belum Diisi
                  </span>
                ) : Boolean(titleId.trim()) && !Boolean(titleEn.trim()) ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    ⚠️ Versi EN Belum Diisi
                  </span>
                ) : (
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    Dwi-Bahasa (Bilingual)
                  </span>
                )}
              </div>

              {!Boolean(titleId.trim()) && Boolean(titleEn.trim()) && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                  <span className="text-base leading-none">⚠️</span>
                  <div>
                    <p className="font-semibold">Judul versi Bahasa Indonesia belum diisi</p>
                    <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
                      Pengunjung berbahasa Indonesia akan melihat judul versi English sebagai fallback.
                    </p>
                  </div>
                </div>
              )}

              {Boolean(titleId.trim()) && !Boolean(titleEn.trim()) && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                  <span className="text-base leading-none">⚠️</span>
                  <div>
                    <p className="font-semibold">Judul versi English belum diisi</p>
                    <p className="text-[11px] text-amber-700/90 dark:text-amber-300/90">
                      Pengunjung berbahasa English akan melihat judul versi Bahasa Indonesia sebagai fallback.
                    </p>
                  </div>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    <span>Bahasa Indonesia (ID)</span>
                  </div>
                  <Input
                    className="h-10 text-sm font-semibold"
                    id="title_id"
                    name="title_id"
                    placeholder="Judul dalam Bahasa Indonesia..."
                    value={titleId}
                    onChange={(event) => handleTitleIdChange(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    <span>English (EN)</span>
                  </div>
                  <Input
                    className="h-10 text-sm font-semibold"
                    id="title_en"
                    name="title_en"
                    placeholder="Title in English..."
                    value={titleEn}
                    onChange={(event) => handleTitleEnChange(event.target.value)}
                  />
                </div>
              </div>
              <input
                type="hidden"
                name="title"
                value={combineBilingualText({ id: titleId, en: titleEn }) || titleId || titleEn}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="key">
                Slug
              </label>
              <Input
                className={slugLocked ? "mt-2 cursor-not-allowed bg-secondary/60 opacity-70" : "mt-2"}
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
              {slugLocked && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  System page — the slug is fixed because the website routes to /{key === "home" ? "" : key}.
                </p>
              )}
            </div>
          </div>
        </section>

        <Tabs defaultValue="builder" className="gap-4">
          <TabsList className="grid h-auto w-full grid-cols-3 rounded-md">
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
            {sections.length > 0 ? (
              <section className="overflow-hidden rounded-lg border border-border">
                <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {publicPath(key)}
                  </p>
                  <p className="text-xs text-muted-foreground">Live section preview</p>
                </div>
                <div className="bg-background">
                  <SectionRenderer sections={sections} data={previewData ?? emptySectionData} listingPlaceholder />
                </div>
              </section>
            ) : (
            <section className="rounded-lg border border-border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {publicPath(key)}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
                {titleId || titleEn || "Untitled page"}
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {key === "contact" ? (
                  <div className="space-y-6">
                    <div className="rounded-md border border-border p-4 bg-secondary/10">
                      <h4 className="font-semibold text-foreground">General Details</h4>
                      <p className="mt-2"><strong>Email:</strong> {contactEmail}</p>
                      <p className="mt-1"><strong>Phone:</strong> {contactPhone}</p>
                      <p className="mt-1"><strong>Fax:</strong> {contactFax}</p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Office Locations</h4>
                      {contactOffices.map((office, idx) => (
                        <div key={idx} className="rounded-md border border-border p-4 bg-card">
                          <p className="font-semibold text-primary">{office.name || "Unnamed Office"}</p>
                          <p className="mt-1 text-xs">{office.address || "No address specified"}</p>
                          {office.phone && <p className="mt-1 text-xs"><strong>Phone:</strong> {office.phone}</p>}
                          {office.email && <p className="mt-1 text-xs"><strong>Email:</strong> {office.email}</p>}
                          {office.mapEmbedUrl && <p className="mt-1 text-xs text-muted-foreground">✓ Google Maps embed active</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {previewFields(fields)}
                    {previewBlocks(blocks)}
                  </>
                )}
              </div>
            </section>
            )}
          </TabsContent>

          <TabsContent value="source">
            <Textarea
              className="min-h-[520px] rounded-lg border-border bg-background font-mono text-xs"
              readOnly
              value={prettyContentJson}
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
              {status === "published" ? (
                <div className="mt-2.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-800 dark:text-emerald-300">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    Status: Terpublikasi (Published)
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed opacity-90">
                    Hasil editan di Builder & Content akan langsung aktif di web publik saat disimpan.
                  </p>
                </div>
              ) : (
                <div className="mt-2.5 rounded-md border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                    Status: Draft / Belum Publik
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed opacity-90">
                    Ubah status ke <strong>published</strong> agar editan tampil di website publik.
                  </p>
                </div>
              )}
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

            {mode === "edit" && page && (
              <div className="rounded-md bg-secondary px-3 py-2 text-sm text-muted-foreground">
                <p>Version: {page.version}</p>
                <p>Current URL: {publicPath(page.key)}</p>
              </div>
            )}

            <SubmitButton
              mode={mode}
              pending={pending}
              onClick={handleSaveClick}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold text-foreground">SEO</h2>
          </div>
          <div className="mt-4 space-y-4">
            <BilingualSeoEditor seo={seo} onChange={setSeo} />
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="seoCanonical">
                Canonical URL
              </label>
              <div className="relative mt-2">
                <Globe2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  id="seoCanonical"
                  onChange={(event) =>
                    setSeo((current) => ({ ...current, canonical: event.target.value }))
                  }
                  value={seo.canonical ?? ""}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm">
              <Checkbox
                checked={Boolean(seo.noIndex)}
                onCheckedChange={(checked) =>
                  setSeo((current) => ({ ...current, noIndex: checked === true }))
                }
              />
              Hide from search engines
            </label>
          </div>
        </section>
      </aside>

      {/* Save Page Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Page Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save changes to this page?
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

function submitLabel(mode: "create" | "edit", pending: boolean) {
  if (pending) return "Saving..."
  return mode === "create" ? "Create Page" : "Save Page"
}

function SubmitButton({
  mode,
  pending,
  onClick,
}: {
  mode: "create" | "edit"
  pending: boolean
  onClick?: () => void
}) {
  return (
    // Hidden on small screens: MobileActionBar carries the action there so it
    // is reachable without scrolling past every section.
    <Button className="hidden w-full lg:flex" disabled={pending} type="button" onClick={onClick}>
      <Save className="h-4 w-4" />
      {submitLabel(mode, pending)}
    </Button>
  )
}

function BilingualSeoEditor({
  seo,
  onChange,
}: {
  seo: SEO
  onChange: React.Dispatch<React.SetStateAction<SEO>>
}) {
  const [showRaw, setShowRaw] = useState(false)
  const titleExt = extractBilingualText(seo.title)
  const descExt = extractBilingualText(seo.description)

  const hasTitleId = Boolean(titleExt.id.trim())
  const hasTitleEn = Boolean(titleExt.en.trim())
  const hasDescId = Boolean(descExt.id.trim())
  const hasDescEn = Boolean(descExt.en.trim())

  function handleTitleChange(lang: "id" | "en", val: string) {
    const next = { ...titleExt, [lang]: val }
    const combined = combineBilingualText(next)
    onChange((curr) => ({ ...curr, title: combined }))
  }

  function handleDescChange(lang: "id" | "en", val: string) {
    const next = { ...descExt, [lang]: val }
    const combined = combineBilingualText(next)
    onChange((curr) => ({ ...curr, description: combined }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Dwi-Bahasa
          </span>
          {hasTitleId && hasTitleEn && hasDescId && hasDescEn ? (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              ✓ ID + EN Lengkap
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
        <>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="seoTitle">
              SEO title (Raw)
            </label>
            <Input
              className="mt-2 font-mono text-xs"
              id="seoTitle"
              onChange={(event) =>
                onChange((current) => ({ ...current, title: event.target.value }))
              }
              value={seo.title ?? ""}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground" htmlFor="seoDescription">
              Description (Raw)
            </label>
            <Textarea
              className="mt-2 min-h-24 font-mono text-xs"
              id="seoDescription"
              onChange={(event) =>
                onChange((current) => ({ ...current, description: event.target.value }))
              }
              value={seo.description ?? ""}
            />
          </div>
        </>
      ) : (
        <>
          {/* SEO Title Bilingual */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SEO Title
            </label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    <span>Bahasa Indonesia (ID)</span>
                  </div>
                  {!hasTitleId && hasTitleEn && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      (belum diisi)
                    </span>
                  )}
                </div>
                <Input
                  className="text-xs h-9 bg-background"
                  placeholder="Judul SEO Bahasa Indonesia..."
                  value={titleExt.id}
                  onChange={(e) => handleTitleChange("id", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    <span>English (EN)</span>
                  </div>
                  {hasTitleId && !hasTitleEn && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      (belum diisi)
                    </span>
                  )}
                </div>
                <Input
                  className="text-xs h-9 bg-background"
                  placeholder="SEO Title in English..."
                  value={titleExt.en}
                  onChange={(e) => handleTitleChange("en", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SEO Description Bilingual */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              SEO Description
            </label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                    <span>Bahasa Indonesia (ID)</span>
                  </div>
                  {!hasDescId && hasDescEn && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      (belum diisi)
                    </span>
                  )}
                </div>
                <Textarea
                  className="text-xs min-h-20 bg-background"
                  placeholder="Deskripsi SEO Bahasa Indonesia..."
                  value={descExt.id}
                  onChange={(e) => handleDescChange("id", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                    <span>English (EN)</span>
                  </div>
                  {hasDescId && !hasDescEn && (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      (belum diisi)
                    </span>
                  )}
                </div>
                <Textarea
                  className="text-xs min-h-20 bg-background"
                  placeholder="SEO Description in English..."
                  value={descExt.en}
                  onChange={(e) => handleDescChange("en", e.target.value)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


// Floating save bar for small screens, docked just above the bottom nav.
function MobileActionBar({
  mode,
  pending,
  onClick,
}: {
  mode: "create" | "edit"
  pending: boolean
  onClick?: () => void
}) {
  return (
    <div className="fixed inset-x-3 bottom-[76px] z-30 flex items-center gap-2 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden print:hidden">
      <Button className="min-h-11 flex-1" disabled={pending} type="button" onClick={onClick}>
        <Save className="h-4 w-4" />
        {submitLabel(mode, pending)}
      </Button>
    </div>
  )
}

function contentToFields(content: Record<string, unknown>, pageKey?: string): FieldRow[] {
  const normalizedKey = (pageKey || "").toLowerCase().trim()
  const knownFields = BILINGUAL_PAGE_FIELDS[normalizedKey]

  return Object.entries(content)
    .filter(([fieldKey]) => fieldKey !== "blocks" && fieldKey !== "sections")
    .map(([fieldKey, value]) => {
      let textValue = valueToText(value)
      if (typeof value === "string" && textValue.trim()) {
        const { id: extId, en: extEn } = extractBilingualText(textValue)
        let resolvedId = extId
        let resolvedEn = extEn

        const known = knownFields?.[fieldKey]
        if (known) {
          if (!resolvedId || resolvedId === resolvedEn) resolvedId = known.id
          if (!resolvedEn) resolvedEn = known.en
        }

        if (resolvedId && resolvedEn && resolvedId !== resolvedEn) {
          textValue = combineBilingualText({ id: resolvedId, en: resolvedEn })
        }
      } else if (fieldKey === "impactValues") {
        let items: Array<Record<string, unknown>> = []
        if (Array.isArray(value)) {
          items = value as Array<Record<string, unknown>>
        } else if (typeof value === "string") {
          try {
            const p = JSON.parse(value)
            if (Array.isArray(p)) items = p
          } catch {}
        }
        if (items.length > 0) {
          const enriched = items.map((it, idx) => {
            const def = DEFAULT_BILINGUAL_IMPACT_VALUES[idx] || DEFAULT_BILINGUAL_IMPACT_VALUES[0]
            const letter = String(it.letter || def.letter || "")
            let title = String(it.title || "")
            if (title) {
              const ext = extractBilingualText(title)
              if (!ext.id || ext.id === ext.en) {
                const matched = DEFAULT_BILINGUAL_IMPACT_VALUES.find((d) => d.letter === letter)
                if (matched) title = matched.title
              } else {
                title = combineBilingualText(ext)
              }
            } else {
              title = def.title
            }
            let desc = String(it.desc || "")
            if (desc) {
              const ext = extractBilingualText(desc)
              if (!ext.id || ext.id === ext.en) {
                const matched = DEFAULT_BILINGUAL_IMPACT_VALUES.find((d) => d.letter === letter)
                if (matched) desc = matched.desc
              } else {
                desc = combineBilingualText(ext)
              }
            } else {
              desc = def.desc
            }
            return { letter, title, desc }
          })
          textValue = JSON.stringify(enriched, null, 2)
        }
      }
      return {
        id: `field-${fieldKey}`,
        key: fieldKey,
        type: valueType(value),
        value: textValue,
      }
    })
}

function contentToBlocks(content: Record<string, unknown>): BlockRow[] {
  const maybeBlocks = content.blocks
  if (!Array.isArray(maybeBlocks)) return []
  return maybeBlocks.map((item, index) => {
    if (!item || typeof item !== "object") {
      return { id: `block-${index}`, type: "paragraph", text: "" }
    }
    const block = item as { type?: unknown; text?: unknown; items?: unknown }
    return {
      id: `block-${index}`,
      type: typeof block.type === "string" ? block.type : "paragraph",
      text: Array.isArray(block.items)
        ? block.items.map((value) => String(value)).join("\n")
        : typeof block.text === "string"
          ? block.text
          : "",
    }
  })
}

function buildContent(fields: FieldRow[], blocks: BlockRow[]) {
  const content: Record<string, unknown> = {}
  for (const field of fields) {
    const fieldKey = field.key.trim()
    if (!fieldKey) continue
    content[fieldKey] = parseFieldValue(field)
  }
  content.blocks = blocks
    .map((block) => {
      if (block.type === "list") {
        return {
          type: "list",
          items: block.text
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        }
      }
      return { type: block.type, text: block.text.trim() }
    })
    .filter((block) => {
      if ("items" in block) return Array.isArray(block.items) && block.items.length > 0
      return Boolean(block.text)
    })
  return content
}

function parseFieldValue(field: FieldRow) {
  if (field.type === "list") {
    return field.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  if (field.type === "json") {
    try {
      return JSON.parse(field.value)
    } catch {
      return field.value
    }
  }
  return field.value
}

function previewFields(fields: FieldRow[]) {
  return fields
    .filter((field) => field.key.trim())
    .map((field) => (
      <div className="rounded-md border border-border p-3" key={field.id}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">{field.key}</p>
        <p className="mt-2 whitespace-pre-line">{field.value || "-"}</p>
      </div>
    ))
}

function previewBlocks(blocks: BlockRow[]) {
  return blocks
    .filter((block) => block.text.trim())
    .map((block) => {
      if (block.type === "heading") {
        return (
          <h3 className="font-display text-2xl font-semibold text-foreground" key={block.id}>
            {block.text}
          </h3>
        )
      }
      if (block.type === "quote") {
        return (
          <blockquote className="border-l-2 border-primary pl-4 text-foreground" key={block.id}>
            {block.text}
          </blockquote>
        )
      }
      if (block.type === "list") {
        return (
          <ul className="list-disc space-y-1 pl-5" key={block.id}>
            {block.text
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
          </ul>
        )
      }
      return <p key={block.id}>{block.text}</p>
    })
}

function valueType(value: unknown): FieldType {
  if (Array.isArray(value) && value.every((item) => typeof item !== "object")) return "list"
  if (typeof value === "object" && value !== null) return "json"
  return "text"
}

function valueToText(value: unknown) {
  if (Array.isArray(value) && value.every((item) => typeof item !== "object")) {
    return value.map((item) => String(item)).join("\n")
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2)
  }
  return value == null ? "" : String(value)
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

function slugifyField(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function toDateTimeLocal(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  try {
    const parts = new Intl.DateTimeFormat("sv-SE", {
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
    return parts
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

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function BilingualPageFieldCard({
  field,
  pageKey,
  onUpdateKey,
  onUpdateType,
  onUpdateValue,
  onRemove,
}: {
  field: FieldRow
  pageKey: string
  onUpdateKey: (key: string) => void
  onUpdateType: (type: FieldType) => void
  onUpdateValue: (value: string) => void
  onRemove: () => void
}) {
  const [showRaw, setShowRaw] = useState(false)
  const isText = field.type === "text"

  const extracted = useMemo(() => {
    return extractBilingualText(field.value)
  }, [field.value])

  let idVal = extracted.id
  let enVal = extracted.en

  const normalizedPageKey = (pageKey || "").toLowerCase().trim()
  const known = BILINGUAL_PAGE_FIELDS[normalizedPageKey]?.[field.key]
  if (known) {
    if (!idVal || idVal === enVal) idVal = known.id
    if (!enVal) enVal = known.en
  } else {
    if (!idVal && enVal) {
      idVal = lookupDictionary(enVal, "id") || enVal
    } else if (!enVal && idVal) {
      enVal = lookupDictionary(idVal, "en") || idVal
    }
  }

  function handleIdChange(newId: string) {
    const combined = combineBilingualText({ id: newId, en: enVal })
    onUpdateValue(combined)
  }

  function handleEnChange(newEn: string) {
    const combined = combineBilingualText({ id: idVal, en: newEn })
    onUpdateValue(combined)
  }

  const hasId = Boolean(idVal.trim())
  const hasEn = Boolean(enVal.trim())

  return (
    <div className="rounded-lg border border-border bg-secondary/20 p-4 transition-all hover:border-border/80">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Field:</span>
            <Input
              aria-label="Field key"
              className="h-8 w-44 bg-background font-mono text-xs font-semibold"
              onChange={(event) => onUpdateKey(event.target.value)}
              placeholder="field_key"
              value={field.key}
            />
          </div>

          <select
            aria-label="Field type"
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[2px]"
            onChange={(event) => onUpdateType(event.target.value as FieldType)}
            value={field.type}
          >
            {fieldTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {field.key === "impactValues" ? (
            <span
              title="6 Nilai IMPACT dalam format dwi-bahasa (ID + EN)"
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
            >
              ✓ 6 Nilai IMPACT (ID + EN)
            </span>
          ) : isText && (
            hasId && hasEn ? (
              <span
                title="Lengkap: Versi ID dan EN terisi"
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
              >
                ✓ Lengkap (ID + EN)
              </span>
            ) : !hasId && hasEn ? (
              <span
                title="Peringatan: Versi Bahasa Indonesia kosong"
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              >
                ⚠️ ID Kosong
              </span>
            ) : hasId && !hasEn ? (
              <span
                title="Peringatan: Versi English kosong"
                className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
              >
                ⚠️ EN Kosong
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                Kosong
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          {(isText || field.key === "impactValues") && (
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showRaw ? "Mode Dwi-Bahasa" : field.key === "impactValues" ? "Raw JSON" : "Raw"}
            </button>
          )}
          <Button
            aria-label="Remove field"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={onRemove}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-3">
        {isText ? (
          showRaw ? (
            <Textarea
              aria-label="Field raw value"
              className="min-h-20 bg-background font-mono text-xs"
              onChange={(event) => onUpdateValue(event.target.value)}
              placeholder="EN: Content in English...\nID: Konten dalam Bahasa Indonesia..."
              value={field.value}
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Bahasa Indonesia (ID) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                  <span>Bahasa Indonesia (ID)</span>
                </div>
                <Textarea
                  aria-label={`${field.key || "field"} dalam Bahasa Indonesia`}
                  className="min-h-24 bg-background text-sm"
                  onChange={(e) => handleIdChange(e.target.value)}
                  placeholder={`[ID] Konten ${field.key || ""} dalam Bahasa Indonesia...`}
                  value={idVal}
                />
              </div>

              {/* English (EN) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                  <span>English (EN)</span>
                </div>
                <Textarea
                  aria-label={`${field.key || "field"} in English`}
                  className="min-h-24 bg-background text-sm"
                  onChange={(e) => handleEnChange(e.target.value)}
                  placeholder={`[EN] Content ${field.key || ""} in English...`}
                  value={enVal}
                />
              </div>
            </div>
          )
        ) : field.type === "list" ? (
          <div className="space-y-1.5">
            <p className="text-[11px] text-muted-foreground">
              Satu item per baris. Mendukung format dwi-bahasa (contoh: <code className="text-foreground">EN: Item in English | ID: Item Bahasa Indonesia</code>).
            </p>
            <Textarea
              aria-label="Field value list"
              className="min-h-24 bg-background font-mono text-xs"
              onChange={(event) => onUpdateValue(event.target.value)}
              placeholder="One item per line"
              value={field.value}
            />
          </div>
        ) : field.key === "impactValues" && !showRaw ? (
          <ImpactValuesBilingualEditor value={field.value} onChange={onUpdateValue} />
        ) : (
          <div className="space-y-1.5">
            <p className="text-[11px] text-muted-foreground">
              Data JSON valid (objek atau array).
            </p>
            <Textarea
              aria-label="Field value JSON"
              className="min-h-24 bg-background font-mono text-xs"
              onChange={(event) => onUpdateValue(event.target.value)}
              placeholder='{"key": "value"}'
              value={field.value}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ImpactValuesBilingualEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const items = useMemo(() => {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any, idx: number) => {
          const defaultItem = DEFAULT_BILINGUAL_IMPACT_VALUES[idx] || DEFAULT_BILINGUAL_IMPACT_VALUES[0]
          const letter = String(item.letter || defaultItem.letter || "")

          let title = String(item.title || "")
          if (title) {
            const ext = extractBilingualText(title)
            if (!ext.id || ext.id === ext.en) {
              const matched = DEFAULT_BILINGUAL_IMPACT_VALUES.find((d) => d.letter === letter)
              if (matched) title = matched.title
            } else {
              title = combineBilingualText(ext)
            }
          } else {
            title = defaultItem.title
          }

          let desc = String(item.desc || "")
          if (desc) {
            const ext = extractBilingualText(desc)
            if (!ext.id || ext.id === ext.en) {
              const matched = DEFAULT_BILINGUAL_IMPACT_VALUES.find((d) => d.letter === letter)
              if (matched) desc = matched.desc
            } else {
              desc = combineBilingualText(ext)
            }
          } else {
            desc = defaultItem.desc
          }

          return { letter, title, desc }
        })
      }
    } catch {
      // ignore
    }
    return DEFAULT_BILINGUAL_IMPACT_VALUES
  }, [value])

  function updateItem(index: number, patch: { title?: string; desc?: string; letter?: string }) {
    const updated = items.map((it, idx) => (idx === index ? { ...it, ...patch } : it))
    onChange(JSON.stringify(updated, null, 2))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Prinsip Nilai Budaya Perusahaan (I - M - P - A - C - T)</span>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          ✓ Dwi-Bahasa Terintegrasi (ID + EN)
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const extTitle = extractBilingualText(item.title)
          const extDesc = extractBilingualText(item.desc)

          return (
            <div
              key={item.letter || idx}
              className="rounded-lg border border-border/80 bg-background/80 p-3 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 font-display text-sm font-bold text-primary">
                    {item.letter}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Nilai &quot;{item.letter}&quot;
                  </span>
                </div>
                {Boolean(extTitle.id.trim()) && Boolean(extTitle.en.trim()) && Boolean(extDesc.id.trim()) && Boolean(extDesc.en.trim()) ? (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    ✓ Lengkap
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    ⚠️ Belum Lengkap
                  </span>
                )}
              </div>

              {/* Title Section */}
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground">Judul / Title</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {/* Title ID */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span>Bahasa Indonesia (ID)</span>
                    </div>
                    <Input
                      className="h-8 text-xs font-medium"
                      placeholder="Judul dalam Bahasa Indonesia..."
                      value={extTitle.id}
                      onChange={(e) => {
                        const newTitle = combineBilingualText({ id: e.target.value, en: extTitle.en })
                        updateItem(idx, { title: newTitle })
                      }}
                    />
                  </div>

                  {/* Title EN */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>English (EN)</span>
                    </div>
                    <Input
                      className="h-8 text-xs font-medium"
                      placeholder="Title in English..."
                      value={extTitle.en}
                      onChange={(e) => {
                        const newTitle = combineBilingualText({ id: extTitle.id, en: e.target.value })
                        updateItem(idx, { title: newTitle })
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Desc Section */}
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground">Deskripsi / Description</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {/* Desc ID */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                      <span>Bahasa Indonesia (ID)</span>
                    </div>
                    <Textarea
                      className="min-h-16 text-xs bg-background"
                      placeholder="Deskripsi dalam Bahasa Indonesia..."
                      value={extDesc.id}
                      onChange={(e) => {
                        const newDesc = combineBilingualText({ id: e.target.value, en: extDesc.en })
                        updateItem(idx, { desc: newDesc })
                      }}
                    />
                  </div>

                  {/* Desc EN */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>English (EN)</span>
                    </div>
                    <Textarea
                      className="min-h-16 text-xs bg-background"
                      placeholder="Description in English..."
                      value={extDesc.en}
                      onChange={(e) => {
                        const newDesc = combineBilingualText({ id: extDesc.id, en: e.target.value })
                        updateItem(idx, { desc: newDesc })
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
