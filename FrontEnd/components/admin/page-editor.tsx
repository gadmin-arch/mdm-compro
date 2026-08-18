"use client"

import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Eye,
  FileJson,
  FileText,
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
  const [title, setTitle] = useState(page?.title ?? "")
  const [key, setKey] = useState(page?.key ?? "")
  const [slugTouched, setSlugTouched] = useState(mode === "edit")
  const [status, setStatus] = useState(page?.status ?? "draft")
  const [publishedAtInput, setPublishedAtInput] = useState(toDateTimeLocal(page?.publishedAt))
  const [seo, setSeo] = useState<SEO>(page?.seo ?? {})
  const [fields, setFields] = useState<FieldRow[]>(() => contentToFields(initialContent))
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
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid"
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
      return {
        email: contactEmail,
        phone: contactPhone,
        fax: contactFax,
        offices: contactOffices,
        blocks: [],
      }
    }
    const base = buildContent(fields, blocks)
    if (sections.length > 0) {
      base.sections = sections
    }
    return base
  }, [isContactPage, fields, blocks, sections, contactEmail, contactPhone, contactFax, contactOffices])
  const contentJson = useMemo(() => JSON.stringify(content), [content])
  const prettyContentJson = useMemo(() => JSON.stringify(content, null, 2), [content])

  function updateTitle(value: string) {
    setTitle(value)
    if (!slugTouched) {
      setKey(slugify(value))
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
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="title">
                Title
              </label>
              <Input
                className="mt-2 h-12 text-lg font-semibold"
                id="title"
                name="title"
                onChange={(event) => updateTitle(event.target.value)}
                required
                value={title}
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

        <Tabs
          defaultValue={
            isContactPage
              ? "content"
              : sections.length > 0 || (fields.length === 0 && blocks.length === 0)
                ? "builder"
                : "content"
          }
          className="gap-4"
        >
          <TabsList
            className={`grid h-auto w-full rounded-md ${isContactPage ? "grid-cols-3" : "grid-cols-4"}`}
          >
            {!isContactPage && (
              <TabsTrigger value="builder">
                <LayoutTemplate className="h-4 w-4" />
                Builder
              </TabsTrigger>
            )}
            <TabsTrigger value="content">
              <FileText className="h-4 w-4" />
              Content
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

          {!isContactPage && (
            <TabsContent value="builder">
              <SectionBuilder sections={sections} onChange={setSections} />
            </TabsContent>
          )}

          <TabsContent value="content" className="space-y-6">
            {key === "contact" ? (
              <>
                <section className="rounded-lg border border-border bg-background p-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">Contact Details</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Manage the general contact information shown on the contact page.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium text-foreground" htmlFor="contactEmail">
                        General Email
                      </label>
                      <Input
                        className="mt-2"
                        id="contactEmail"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground" htmlFor="contactPhone">
                        General Phone
                      </label>
                      <Input
                        className="mt-2"
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground" htmlFor="contactFax">
                        General Fax
                      </label>
                      <Input
                        className="mt-2"
                        id="contactFax"
                        value={contactFax}
                        onChange={(e) => setContactFax(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-background p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Office Locations</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Define the office addresses and interactive map embeds.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setContactOffices((current) => [
                          ...current,
                          { name: "", address: "", phone: "", fax: "", email: "", mapEmbedUrl: "" },
                        ])
                      }
                    >
                      <Plus className="h-4 w-4" />
                      Office
                    </Button>
                  </div>

                  <div className="mt-5 space-y-6">
                    {contactOffices.map((office, idx) => (
                      <div key={idx} className="rounded-md border border-border bg-secondary/30 p-4 relative">
                        <div className="absolute right-4 top-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setContactOffices((current) => current.filter((_, i) => i !== idx))
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Office Name
                            </label>
                            <Input
                              className="mt-1 bg-background"
                              value={office.name}
                              onChange={(e) =>
                                setContactOffices((current) =>
                                  current.map((o, i) => (i === idx ? { ...o, name: e.target.value } : o))
                                )
                              }
                              placeholder="e.g. Surabaya Head Office"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Full Address
                            </label>
                            <Textarea
                              className="mt-1 bg-background min-h-16"
                              value={office.address}
                              onChange={(e) =>
                                setContactOffices((current) =>
                                  current.map((o, i) => (i === idx ? { ...o, address: e.target.value } : o))
                                )
                              }
                              placeholder="Office address..."
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Phone Number
                            </label>
                            <Input
                              className="mt-1 bg-background"
                              value={office.phone ?? ""}
                              onChange={(e) =>
                                setContactOffices((current) =>
                                  current.map((o, i) => (i === idx ? { ...o, phone: e.target.value } : o))
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Fax Number
                            </label>
                            <Input
                              className="mt-1 bg-background"
                              value={office.fax ?? ""}
                              onChange={(e) =>
                                setContactOffices((current) =>
                                  current.map((o, i) => (i === idx ? { ...o, fax: e.target.value } : o))
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Email Address
                            </label>
                            <Input
                              className="mt-1 bg-background"
                              value={office.email ?? ""}
                              onChange={(e) =>
                                setContactOffices((current) =>
                                  current.map((o, i) => (i === idx ? { ...o, email: e.target.value } : o))
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Google Maps Embed URL (iframe src)
                            </label>
                            <Input
                              className="mt-1 bg-background"
                              value={office.mapEmbedUrl ?? ""}
                              onChange={(e) =>
                                setContactOffices((current) =>
                                  current.map((o, i) => (i === idx ? { ...o, mapEmbedUrl: e.target.value } : o))
                                )
                              }
                              placeholder="https://www.google.com/maps/embed?pb=..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="rounded-lg border border-border bg-background p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Page Fields</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Reusable page data outside the main article blocks.
                      </p>
                    </div>
                    <Button onClick={addField} type="button" variant="outline">
                      <Plus className="h-4 w-4" />
                      Field
                    </Button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {fields.map((field) => (
                      <div
                        className="grid gap-3 rounded-md border border-border bg-secondary/30 p-3 md:grid-cols-[180px_120px_minmax(0,1fr)_40px]"
                        key={field.id}
                      >
                        <Input
                          aria-label="Field key"
                          onChange={(event) => updateField(field.id, { key: slugifyField(event.target.value) })}
                          placeholder="overview"
                          value={field.key}
                        />
                        <select
                          aria-label="Field type"
                          className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          onChange={(event) => updateField(field.id, { type: event.target.value as FieldType })}
                          value={field.type}
                        >
                          {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <Textarea
                          aria-label="Field value"
                          className="min-h-20 bg-background"
                          onChange={(event) => updateField(field.id, { value: event.target.value })}
                          placeholder={field.type === "list" ? "One item per line" : "Content"}
                          value={field.value}
                        />
                        <Button
                          aria-label="Remove field"
                          onClick={() => removeField(field.id)}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {fields.length === 0 && (
                      <div className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                        No custom fields yet.
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-lg border border-border bg-background p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-display text-lg font-semibold text-foreground">Blocks</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The publishable body content for this page.
                      </p>
                    </div>
                    <Button onClick={() => addBlock()} type="button" variant="outline">
                      <Plus className="h-4 w-4" />
                      Block
                    </Button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {blocks.map((block, index) => (
                      <div className="rounded-md border border-border bg-secondary/30 p-3" key={block.id}>
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            aria-label="Block type"
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            onChange={(event) => updateBlock(block.id, { type: event.target.value })}
                            value={block.type}
                          >
                            {blockTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          <Button
                            aria-label="Move block up"
                            disabled={index === 0}
                            onClick={() => moveBlock(index, -1)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label="Move block down"
                            disabled={index === blocks.length - 1}
                            onClick={() => moveBlock(index, 1)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            aria-label="Remove block"
                            className="ml-auto"
                            onClick={() => removeBlock(block.id)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          className="mt-3 min-h-28 bg-background"
                          onChange={(event) => updateBlock(block.id, { text: event.target.value })}
                          placeholder={block.type === "list" ? "One item per line" : "Write content"}
                          value={block.text}
                        />
                      </div>
                    ))}

                    {blocks.length === 0 && (
                      <div className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                        No blocks yet.
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="preview">
            {!isContactPage && sections.length > 0 ? (
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
                {title || "Untitled page"}
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
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="seoTitle">
                SEO title
              </label>
              <Input
                className="mt-2"
                id="seoTitle"
                onChange={(event) => setSeo((current) => ({ ...current, title: event.target.value }))}
                value={seo.title ?? ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground" htmlFor="seoDescription">
                Description
              </label>
              <Textarea
                className="mt-2 min-h-24"
                id="seoDescription"
                onChange={(event) =>
                  setSeo((current) => ({ ...current, description: event.target.value }))
                }
                value={seo.description ?? ""}
              />
            </div>
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

function contentToFields(content: Record<string, unknown>): FieldRow[] {
  return Object.entries(content)
    .filter(([fieldKey]) => fieldKey !== "blocks" && fieldKey !== "sections")
    .map(([fieldKey, value]) => ({
      id: `field-${fieldKey}`,
      key: fieldKey,
      type: valueType(value),
      value: valueToText(value),
    }))
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
