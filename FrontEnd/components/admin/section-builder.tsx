"use client"

import { useMemo, useRef, useState } from "react"
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
  Eye,
  EyeOff,
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
import { useContentLanguage } from "@/components/cms/content-language"
import { resolveText } from "@/lib/localized"
import { cn } from "@/lib/utils"
import {
  createSection,
  makeSectionId,
  pageTemplates,
  sectionDefs,
  sectionDefsByType,
  sectionTranslation,
  type Section,
  type TranslationStatus,
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

  function updateSectionMeta(id: string, patch: Pick<Section, "label" | "hidden">) {
    onChange(sections.map((section) => (section.id === id ? { ...section, ...patch } : section)))
  }

  function duplicateSection(id: string) {
    const index = sections.findIndex((section) => section.id === id)
    if (index < 0) return
    const source = sections[index]
    const clone: Section = {
      id: makeSectionId(),
      type: source.type,
      props: structuredClone(source.props),
      ...(source.hidden ? { hidden: true } : {}),
      ...(source.label ? { label: `${source.label} (copy)` } : {}),
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
      id="section-builder-dnd"
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
          onOpen={setExpandedId}
          onUpdate={updateSection}
          onUpdateMeta={updateSectionMeta}
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
  onOpen,
  onUpdate,
  onUpdateMeta,
  onDuplicate,
  onRemove,
  onUseTemplate,
}: {
  sections: Section[]
  expandedId: string | null
  onToggle: (id: string) => void
  onOpen: (id: string) => void
  onUpdate: (id: string, patch: Record<string, unknown>) => void
  onUpdateMeta: (id: string, patch: Pick<Section, "label" | "hidden">) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  onUseTemplate: (sections: Section[]) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "builder-canvas" })
  const { lang } = useContentLanguage()
  const translations = useMemo(
    () => new Map(sections.map((section) => [section.id, sectionTranslation(section)])),
    [sections],
  )
  const incomplete = sections.filter((section) => !section.hidden && translations.get(section.id)?.gaps.length)
  // Cards by section id, for scrolling. Not DOM ids: preset sections get
  // random ids that differ between the server render and hydration.
  const cards = useRef(new Map<string, HTMLDivElement>())

  // Opens the card and scrolls it into view once it has expanded.
  function openSection(id: string) {
    onOpen(id)
    requestAnimationFrame(() => cards.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

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
      {incomplete.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <p className="font-semibold">
            {incomplete.length} section belum lengkap bahasanya — teks yang hanya terisi satu bahasa akan tampil dalam
            bahasa itu di kedua versi website.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {incomplete.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => openSection(section.id)}
                className="rounded-md border border-amber-300 bg-background px-2 py-1 font-medium text-foreground transition-colors hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/40"
              >
                {decodeHtmlEntities(sectionDisplayLabel(section, lang))}
                <span className="ml-1 text-amber-700 dark:text-amber-300">· {translations.get(section.id)?.gaps.length}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <SortableContext items={sections.map((section) => section.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableSectionCard
            key={section.id}
            section={section}
            cardRef={(node) => {
              if (node) cards.current.set(section.id, node)
              else cards.current.delete(section.id)
            }}
            translation={translations.get(section.id) ?? sectionTranslation(section)}
            expanded={expandedId === section.id}
            onToggle={() => onToggle(section.id)}
            onUpdate={(patch) => onUpdate(section.id, patch)}
            onUpdateMeta={(patch) => onUpdateMeta(section.id, patch)}
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
  cardRef,
  translation,
  expanded,
  onToggle,
  onUpdate,
  onUpdateMeta,
  onDuplicate,
  onRemove,
}: {
  section: Section
  cardRef: (node: HTMLDivElement | null) => void
  translation: TranslationStatus
  expanded: boolean
  onToggle: () => void
  onUpdate: (patch: Record<string, unknown>) => void
  onUpdateMeta: (patch: Pick<Section, "label" | "hidden">) => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })
  const def = sectionDefsByType[section.type]
  const Icon = paletteIcons[def?.icon ?? ""] ?? LayoutTemplate

  const { lang } = useContentLanguage()
  const heading = resolveText(section.props?.title ?? section.props?.eyebrow, lang)
  const displayLabel = sectionDisplayLabel(section, lang)
  const typeBadge = def?.label ?? section.type
  const summary = section.label ? heading : sectionSummary(section, lang)
  const incomplete = translation.gaps.length > 0

  const [isEditingInline, setIsEditingInline] = useState(false)
  const [inlineLabel, setInlineLabel] = useState("")

  // Renames the card in the builder only; the public heading is edited in the
  // section's fields.
  function handleSaveInlineLabel() {
    onUpdateMeta({ label: inlineLabel.trim() || undefined })
    setIsEditingInline(false)
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node)
        cardRef(node)
      }}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "scroll-mt-24 rounded-lg border border-border bg-background transition-shadow",
        isDragging && "z-10 opacity-70 shadow-lg",
        expanded && "border-primary/40 shadow-xs",
        incomplete && "border-amber-300 border-l-4 border-l-amber-400 dark:border-amber-800 dark:border-l-amber-600",
        section.hidden && "border-dashed opacity-70",
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
              value={inlineLabel}
              placeholder={`Nama ${typeBadge} di builder...`}
              aria-label="Nama section di builder"
              onChange={(e) => setInlineLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSaveInlineLabel()
                } else if (e.key === "Escape") {
                  setIsEditingInline(false)
                }
              }}
            />
            <Button
              type="button"
              size="icon"
              className="h-8 w-8 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSaveInlineLabel}
              title="Simpan nama"
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
              {/* Badges wrap under the name on narrow cards instead of
                  squeezing it out or running under the buttons. */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="block max-w-full truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {decodeHtmlEntities(displayLabel)}
                </span>
                {section.hidden && (
                  <span className="inline-flex shrink-0 items-center rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    Disembunyikan
                  </span>
                )}
                {displayLabel !== typeBadge && (
                  <span className="inline-block max-w-full truncate rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                    {typeBadge}
                  </span>
                )}
                <TranslationBadge status={translation} />
              </div>
              {summary && summary !== displayLabel ? (
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
                setInlineLabel(section.label ?? "")
                setIsEditingInline(true)
              }}
              title="Beri nama section ini di builder (tidak tampil di website)"
            >
              <Pencil className="h-3 w-3 text-primary" />
              <span>Nama</span>
            </Button>
          </div>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdateMeta({ hidden: !section.hidden })}
          aria-label={section.hidden ? "Show section on the website" : "Hide section from the website"}
          title={section.hidden ? "Tampilkan di website" : "Sembunyikan dari website (tetap tersimpan)"}
        >
          {section.hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
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
          {incomplete && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <p className="font-semibold">Belum lengkap di section ini:</p>
              <ul className="mt-1 space-y-0.5">
                {translation.gaps.map((gap, index) => (
                  <li key={`${gap.field}-${index}`}>
                    <span className="font-semibold">{gap.missing === "en" ? "EN" : "ID"} kosong</span> — {gap.field}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <SectionFieldsEditor fields={def.fields} value={section.props} onChange={onUpdate} />
        </div>
      )}
    </div>
  )
}

// Completeness of the section's translatable text: amber with the number of
// values missing a language, green once every filled value has both.
function TranslationBadge({ status }: { status: TranslationStatus }) {
  if (status.total === 0) return null
  if (status.gaps.length === 0) {
    return (
      <span className="inline-flex shrink-0 items-center rounded-md border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
        ID + EN ✓
      </span>
    )
  }
  const missingEn = status.gaps.filter((gap) => gap.missing === "en").length
  const missingId = status.gaps.length - missingEn
  const label = [missingEn > 0 && `EN kurang ${missingEn}`, missingId > 0 && `ID kurang ${missingId}`]
    .filter(Boolean)
    .join(" · ")
  return (
    <span
      title={status.gaps.map((gap) => `${gap.missing.toUpperCase()} kosong: ${gap.field}`).join("\n")}
      className="inline-flex shrink-0 items-center rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
    >
      {label}
    </span>
  )
}

function sectionDisplayLabel(section: Section, lang: "id" | "en"): string {
  const heading = resolveText(section.props?.title ?? section.props?.eyebrow, lang)
  const def = sectionDefsByType[section.type]
  return section.label || heading || def?.label || section.type
}

function sectionSummary(section: Section, lang: "id" | "en"): string {
  const props = section.props ?? {}
  for (const key of ["eyebrow", "source", "url"]) {
    const value = resolveText(props[key], lang)
    if (value.trim()) return value
  }
  return ""
}
