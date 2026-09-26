"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  Copy,
  Database,
  Factory,
  GripVertical,
  HeartHandshake,
  HelpCircle,
  History,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Megaphone,
  MonitorPlay,
  PanelTop,
  Plus,
  Shield,
  ShieldCheck,
  Pencil,
  Sparkles,
  Target,
  Text,
  Trash2,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionFieldsEditor } from "@/components/admin/section-fields"
import { combineBilingualText, extractBilingualText, filterBilingualText } from "@/lib/bilingual"
import { cn } from "@/lib/utils"
import {
  createSection,
  makeSectionId,
  pageTemplates,
  sectionDefs,
  sectionDefsByType,
  type Section,
} from "@/lib/sections"

function decodeHtmlEntities(str: string): string {
  if (!str) return ""
  return str
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rsquo;/gi, "’")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ")
}

const paletteIcons: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  "panel-top": PanelTop,
  image: ImageIcon,
  text: Text,
  "layout-grid": LayoutGrid,
  "bar-chart": BarChart3,
  database: Database,
  factory: Factory,
  images: Images,
  "help-circle": HelpCircle,
  megaphone: Megaphone,
  "monitor-play": MonitorPlay,
  building: Building2,
  "building-2": Building2,
  compass: Compass,
  wrench: Wrench,
  users: Users,
  shield: Shield,
  "shield-check": ShieldCheck,
  activity: Activity,
  history: History,
  award: Award,
  handshake: HeartHandshake,
  target: Target,
  "check-circle": CheckCircle2,
}


const PALETTE_PREFIX = "palette:"

type SectionBuilderProps = {
  sections: Section[]
  onChange: (sections: Section[]) => void
}

export function SectionBuilder({ sections, onChange }: SectionBuilderProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activeDrag, setActiveDrag] = useState<{ label: string } | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function addSection(type: string, index?: number) {
    const section = createSection(type)
    const next = [...sections]
    next.splice(index ?? sections.length, 0, section)
    onChange(next)
    setExpandedId(section.id)
  }

  function updateSection(id: string, patch: Record<string, unknown>) {
    onChange(
      sections.map((section) =>
        section.id === id ? { ...section, props: { ...section.props, ...patch } } : section,
      ),
    )
  }

  function duplicateSection(id: string) {
    const index = sections.findIndex((section) => section.id === id)
    if (index < 0) return
    const source = sections[index]
    const clone: Section = {
      id: makeSectionId(),
      type: source.type,
      props: structuredClone(source.props),
    }
    const next = [...sections]
    next.splice(index + 1, 0, clone)
    onChange(next)
  }

  function removeSection(id: string) {
    onChange(sections.filter((section) => section.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    if (id.startsWith(PALETTE_PREFIX)) {
      const def = sectionDefsByType[id.slice(PALETTE_PREFIX.length)]
      setActiveDrag({ label: def?.label ?? "Section" })
      return
    }
    const section = sections.find((item) => item.id === id)
    const def = section ? sectionDefsByType[section.type] : undefined
    setActiveDrag({ label: def?.label ?? "Section" })
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null)
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId.startsWith(PALETTE_PREFIX)) {
      const type = activeId.slice(PALETTE_PREFIX.length)
      if (overId === "builder-canvas") {
        addSection(type)
        return
      }
      const overIndex = sections.findIndex((section) => section.id === overId)
      addSection(type, overIndex < 0 ? undefined : overIndex + 1)
      return
    }

    if (activeId === overId) return
    const oldIndex = sections.findIndex((section) => section.id === activeId)
    const newIndex = sections.findIndex((section) => section.id === overId)
    if (oldIndex < 0 || newIndex < 0) return
    onChange(arrayMove(sections, oldIndex, newIndex))
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <SectionPalette onAdd={(type) => addSection(type)} />
        <BuilderCanvas
          sections={sections}
          expandedId={expandedId}
          onToggle={(id) => setExpandedId((current) => (current === id ? null : id))}
          onUpdate={updateSection}
          onDuplicate={duplicateSection}
          onRemove={removeSection}
          onUseTemplate={(templateSections) => onChange(templateSections)}
        />
      </div>

      <DragOverlay>
        {activeDrag && (
          <div className="rounded-md border border-primary/40 bg-background px-3 py-2 text-sm font-medium shadow-lg">
            {activeDrag.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function SectionPalette({ onAdd }: { onAdd: (type: string) => void }) {
  return (
    <aside className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-background p-3 lg:sticky lg:top-6 lg:self-start">
      <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sections
      </p>
      <p className="mt-1 px-1 text-xs text-muted-foreground">Click or drag into the page.</p>
      <div className="mt-3 flex flex-col gap-1.5 w-full min-w-0 overflow-hidden">
        {sectionDefs.map((def) => (
          <PaletteItem key={def.type} type={def.type} label={def.label} description={def.description} icon={def.icon} onAdd={onAdd} />
        ))}
      </div>
    </aside>
  )
}

function PaletteItem({
  type,
  label,
  description,
  icon,
  onAdd,
}: {
  type: string
  label: string
  description: string
  icon: string
  onAdd: (type: string) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${PALETTE_PREFIX}${type}`,
  })
  const Icon = paletteIcons[icon] ?? LayoutTemplate

  return (
    <button
      ref={setNodeRef}
      type="button"
      title={description}
      onClick={() => onAdd(type)}
      className={cn(
        "flex w-full min-w-0 max-w-full cursor-grab items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 text-left text-sm transition-colors hover:border-border hover:bg-secondary",
        isDragging && "opacity-50",
      )}
      {...attributes}
      {...listeners}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1 overflow-hidden">
        <span className="block truncate font-medium text-foreground" title={label}>{label}</span>
      </div>
      <Plus className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </button>
  )
}

function BuilderCanvas({
  sections,
  expandedId,
  onToggle,
  onUpdate,
  onDuplicate,
  onRemove,
  onUseTemplate,
}: {
  sections: Section[]
  expandedId: string | null
  onToggle: (id: string) => void
  onUpdate: (id: string, patch: Record<string, unknown>) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  onUseTemplate: (sections: Section[]) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "builder-canvas" })

  if (sections.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "rounded-lg border-2 border-dashed border-border bg-background p-8",
          isOver && "border-primary bg-primary/5",
        )}
      >
        <div className="mx-auto max-w-md text-center">
          <LayoutTemplate className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
            Start building this page
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag a section from the left, or start from a template.
          </p>
        </div>
        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
          {pageTemplates.map((template) => (
            <button
              key={template.key}
              type="button"
              onClick={() => onUseTemplate(template.sections())}
              className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary"
            >
              <p className="font-medium text-foreground">{template.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} className={cn("space-y-3 rounded-lg", isOver && "ring-2 ring-primary/30")}>
      <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableSectionCard
            key={section.id}
            section={section}
            expanded={expandedId === section.id}
            onToggle={() => onToggle(section.id)}
            onUpdate={(patch) => onUpdate(section.id, patch)}
            onDuplicate={() => onDuplicate(section.id)}
            onRemove={() => onRemove(section.id)}
          />
        ))}
      </SortableContext>
    </div>
  )
}

function SortableSectionCard({
  section,
  expanded,
  onToggle,
  onUpdate,
  onDuplicate,
  onRemove,
}: {
  section: Section
  expanded: boolean
  onToggle: () => void
  onUpdate: (patch: Record<string, unknown>) => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })
  const def = sectionDefsByType[section.type]
  const Icon = paletteIcons[def?.icon ?? ""] ?? LayoutTemplate

  const rawTitle =
    typeof section.props?.customTitle === "string" && section.props.customTitle.trim()
      ? section.props.customTitle
      : typeof section.props?.title === "string" && section.props.title.trim()
        ? section.props.title
        : ""

  const cleanTitle = rawTitle
    ? filterBilingualText(rawTitle, "id") || filterBilingualText(rawTitle, "en") || rawTitle
    : ""
  const displayLabel = cleanTitle || def?.label || section.type
  const typeBadge = def?.label ?? section.type
  const summary = sectionSummary(section)

  const [isEditingInline, setIsEditingInline] = useState(false)
  const [inlineTitle, setInlineTitle] = useState("")

  function handleSaveInlineTitle() {
    const trimmed = inlineTitle.trim()
    onUpdate({
      title: trimmed,
      customTitle: trimmed,
    })
    setIsEditingInline(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-lg border border-border bg-background transition-shadow",
        isDragging && "z-10 opacity-70 shadow-lg",
        expanded && "border-primary/40 shadow-xs",
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <button
          type="button"
          className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>

        {isEditingInline ? (
          <div className="min-w-0 flex-1 flex items-center gap-1.5 py-0.5">
            <Input
              autoFocus
              className="h-8 text-xs font-semibold bg-background border-primary/50 shadow-xs"
              value={inlineTitle}
              placeholder={`Ubah judul elemen ${typeBadge}...`}
              onChange={(e) => setInlineTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSaveInlineTitle()
                } else if (e.key === "Escape") {
                  setIsEditingInline(false)
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              className="h-8 w-8 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveInlineTitle}
              title="Simpan Judul"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-secondary"
              onClick={() => setIsEditingInline(false)}
              title="Batal"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              className="min-w-0 flex-1 text-left py-0.5 group"
              title="Klik untuk membuka / menutup editor elemen ini"
            >
              <div className="flex items-center gap-2">
                <span className="block truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {decodeHtmlEntities(displayLabel)}
                </span>
                {cleanTitle && (
                  <span className="inline-flex shrink-0 items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                    {typeBadge}
                  </span>
                )}
              </div>
              {rawTitle ? (
                <span className="block truncate text-xs text-muted-foreground mt-0.5 font-mono">
                  {decodeHtmlEntities(rawTitle.replace(/\n/g, " · "))}
                </span>
              ) : summary ? (
                <span className="block truncate text-xs text-muted-foreground mt-0.5">
                  {decodeHtmlEntities(summary)}
                </span>
              ) : null}
            </button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0 gap-1.5 border-dashed border-border"
              onClick={(e) => {
                e.stopPropagation()
                setInlineTitle(rawTitle || cleanTitle)
                setIsEditingInline(true)
              }}
              title="Ubah judul elemen ini secara langsung tanpa perlu expand"
            >
              <Pencil className="h-3 w-3 text-primary" />
              <span>Ganti Judul</span>
            </Button>
          </div>
        )}

        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate} aria-label="Duplicate section">
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
          onClick={onRemove}
          aria-label="Remove section"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
          aria-label={expanded ? "Collapse section" : "Edit section"}
          title={expanded ? "Tutup detail elemen" : "Buka detail elemen"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </Button>
      </div>

      {expanded && def && (
        <div className="border-t border-border bg-secondary/20 p-4 space-y-4">
          {/* Prominent Element Title / Judul Elemen */}
          <SectionHeadingEditor
            rawTitle={
              typeof section.props.title === "string"
                ? section.props.title
                : typeof section.props.customTitle === "string"
                  ? section.props.customTitle
                  : ""
            }
            typeBadge={typeBadge}
            onChange={(newTitle) => {
              onUpdate({
                title: newTitle,
                customTitle: newTitle,
              })
            }}
          />

          <SectionFieldsEditor fields={def.fields} value={section.props} onChange={onUpdate} />
        </div>
      )}
    </div>
  )
}

function sectionSummary(section: Section): string {
  const props = section.props ?? {}
  for (const key of ["title", "eyebrow", "source", "url"]) {
    const value = props[key]
    if (typeof value === "string" && value.trim()) return value
  }
  return ""
}

function SectionHeadingEditor({
  rawTitle,
  typeBadge,
  onChange,
}: {
  rawTitle: string
  typeBadge: string
  onChange: (newTitle: string) => void
}) {
  const [showRaw, setShowRaw] = useState(false)
  const decoded = decodeHtmlEntities(rawTitle)
  const { id, en } = extractBilingualText(decoded)
  const hasId = Boolean(id.trim())
  const hasEn = Boolean(en.trim())

  function handleIdChange(newId: string) {
    const combined = combineBilingualText({ id: newId, en })
    onChange(combined)
  }

  function handleEnChange(newEn: string) {
    const combined = combineBilingualText({ id, en: newEn })
    onChange(combined)
  }

  return (
    <div className="rounded-lg border border-primary/25 bg-background p-3.5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            Judul Elemen / Section Title (Heading)
          </label>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            Dwi-Bahasa
          </span>
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
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRaw(!showRaw)}
            className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {showRaw ? "Mode Dwi-Bahasa" : "Raw"}
          </button>
        </div>
      </div>

      {showRaw ? (
        <div className="mt-2.5">
          <Input
            className="bg-background font-mono text-xs h-9"
            placeholder={`Judul khusus untuk elemen ${typeBadge}...`}
            value={rawTitle}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      ) : (
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          {/* Bahasa Indonesia (ID) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                <span>Bahasa Indonesia (ID)</span>
              </div>
              {!hasId && hasEn && (
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  (belum diisi)
                </span>
              )}
            </div>
            <Input
              className="bg-background text-xs font-medium h-9"
              placeholder={`Judul dalam Bahasa Indonesia untuk ${typeBadge}...`}
              value={id}
              onChange={(e) => handleIdChange(e.target.value)}
            />
          </div>

          {/* English (EN) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                <span>English (EN)</span>
              </div>
              {hasId && !hasEn && (
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  (belum diisi)
                </span>
              )}
            </div>
            <Input
              className="bg-background text-xs font-medium h-9"
              placeholder={`Title in English for ${typeBadge}...`}
              value={en}
              onChange={(e) => handleEnChange(e.target.value)}
            />
          </div>
        </div>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Ubah judul heading elemen ini secara terpisah untuk versi Bahasa Indonesia dan English.
      </p>
    </div>
  )
}

