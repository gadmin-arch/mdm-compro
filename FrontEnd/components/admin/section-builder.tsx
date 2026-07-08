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
  BarChart3,
  ChevronDown,
  Copy,
  Database,
  Factory,
  GripVertical,
  HelpCircle,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Megaphone,
  MonitorPlay,
  PanelTop,
  Plus,
  Sparkles,
  Text,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionFieldsEditor } from "@/components/admin/section-fields"
import { cn } from "@/lib/utils"
import {
  createSection,
  makeSectionId,
  pageTemplates,
  sectionDefs,
  sectionDefsByType,
  type Section,
} from "@/lib/sections"

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
      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
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
    <aside className="rounded-lg border border-border bg-background p-3 lg:sticky lg:top-6 lg:self-start">
      <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Sections
      </p>
      <p className="mt-1 px-1 text-xs text-muted-foreground">Click or drag into the page.</p>
      <div className="mt-3 grid gap-1.5">
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
        "flex w-full cursor-grab items-center gap-2.5 rounded-md border border-transparent px-2 py-2 text-left text-sm transition-colors hover:border-border hover:bg-secondary",
        isDragging && "opacity-50",
      )}
      {...attributes}
      {...listeners}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium text-foreground">{label}</span>
      </span>
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
  const summary = sectionSummary(section)

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-lg border border-border bg-background",
        isDragging && "z-10 opacity-70 shadow-lg",
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
        <button type="button" onClick={onToggle} className="min-w-0 flex-1 text-left">
          <span className="block text-sm font-medium text-foreground">{def?.label ?? section.type}</span>
          {summary && <span className="block truncate text-xs text-muted-foreground">{summary}</span>}
        </button>
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
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </Button>
      </div>

      {expanded && def && (
        <div className="border-t border-border bg-secondary/20 p-4">
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
