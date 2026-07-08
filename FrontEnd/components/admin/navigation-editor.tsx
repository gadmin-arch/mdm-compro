"use client"

import { useMemo, useState } from "react"
import { useFormStatus } from "react-dom"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
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
  ChevronDown,
  CornerDownRight,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  GripVertical,
  Link2,
  Lock,
  Save,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { MenuItem } from "@/lib/cms"
import { cn } from "@/lib/utils"

const INDENT_WIDTH = 32

export type PageOption = { key: string; title: string; status: string }

type NavigationEditorProps = {
  action: (formData: FormData) => void | Promise<void>
  initialItems: MenuItem[]
  version: number
  pageOptions: PageOption[]
}

type FlatRow = {
  id: string
  depth: 0 | 1
  item: MenuItem
  parentId: string | null
  childCount: number
}

function flattenItems(items: MenuItem[], excludeChildrenOf?: string): FlatRow[] {
  const rows: FlatRow[] = []
  for (const item of items) {
    const children = item.children ?? []
    rows.push({ id: item.id, depth: 0, item, parentId: null, childCount: children.length })
    if (item.id === excludeChildrenOf) continue
    for (const child of children) {
      rows.push({ id: child.id, depth: 1, item: child, parentId: item.id, childCount: 0 })
    }
  }
  return rows
}

// Rebuilds the two-level tree from an ordered flat list; a depth-1 row with
// no top item above it is promoted to the top level.
function buildTree(rows: Array<{ item: MenuItem; depth: number }>): MenuItem[] {
  const tree: MenuItem[] = []
  for (const row of rows) {
    const node: MenuItem = { ...row.item, children: row.depth === 0 ? (row.item.children ?? []) : [] }
    if (row.depth === 0 || tree.length === 0) {
      if (row.depth === 1 && tree.length === 0) {
        tree.push({ ...node, children: [] })
        continue
      }
      tree.push(node)
    } else {
      const parent = tree[tree.length - 1]
      parent.children = [...(parent.children ?? []), { ...node, children: [] }]
    }
  }
  return tree
}

function makeItemId() {
  return `nav-${Math.random().toString(36).slice(2, 10)}`
}

export function NavigationEditor({ action, initialItems, version, pageOptions }: NavigationEditorProps) {
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const rows = useMemo(
    () => flattenItems(items, activeId ?? undefined),
    [items, activeId],
  )
  const activeRow = activeId ? rows.find((row) => row.id === activeId) : null
  const itemsJson = useMemo(() => JSON.stringify(items), [items])

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
    setOffsetLeft(0)
    setExpandedId(null)
  }

  function handleDragMove(event: DragMoveEvent) {
    setOffsetLeft(event.delta.x)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    const draggedId = String(active.id)
    setActiveId(null)

    if (!over) return
    const overId = String(over.id)

    const currentRows = flattenItems(items, draggedId)
    const fromIndex = currentRows.findIndex((row) => row.id === draggedId)
    const toIndex = currentRows.findIndex((row) => row.id === overId)
    if (fromIndex < 0 || toIndex < 0) return

    const reordered = arrayMove(currentRows, fromIndex, toIndex)
    const draggedIndex = reordered.findIndex((row) => row.id === draggedId)
    const dragged = reordered[draggedIndex]

    // Horizontal offset decides nesting; items that have children stay on top level.
    const projected = Math.max(
      0,
      Math.min(1, dragged.depth + Math.round(offsetLeft / INDENT_WIDTH)),
    )
    const hasChildren = (dragged.item.children?.length ?? 0) > 0
    const previous = reordered[draggedIndex - 1]
    const depth: 0 | 1 =
      hasChildren || !previous ? 0 : projected === 1 ? 1 : 0

    setItems(
      buildTree(
        reordered.map((row, index) =>
          index === draggedIndex ? { item: row.item, depth } : { item: row.item, depth: row.depth },
        ),
      ),
    )
  }

  function updateItem(id: string, patch: Partial<MenuItem>) {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) return { ...item, ...patch }
        if (item.children?.some((child) => child.id === id)) {
          return {
            ...item,
            children: item.children.map((child) => (child.id === id ? { ...child, ...patch } : child)),
          }
        }
        return item
      }),
    )
  }

  function removeItem(id: string) {
    setItems((current) =>
      current
        .filter((item) => item.id !== id)
        .map((item) => ({
          ...item,
          children: (item.children ?? []).filter((child) => child.id !== id),
        })),
    )
    if (expandedId === id) setExpandedId(null)
  }

  function addItem(kind: "page" | "custom") {
    const item: MenuItem =
      kind === "page"
        ? {
            id: makeItemId(),
            label: pageOptions[0]?.title ?? "New page link",
            kind: "page",
            pageKey: pageOptions[0]?.key ?? "",
            href: pageOptions[0] ? `/${pageOptions[0].key}` : "",
            visible: true,
            children: [],
          }
        : {
            id: makeItemId(),
            label: "New link",
            kind: "custom",
            href: "/",
            visible: true,
            children: [],
          }
    setItems((current) => [...current, item])
    setExpandedId(item.id)
  }

  return (
    <form action={action} className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <input name="items" type="hidden" value={itemsJson} />
      <input name="version" type="hidden" value={version} />

      <div className="space-y-4">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Menu Structure</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag to reorder. Drag right to nest a link under the item above it.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addItem("page")} disabled={pageOptions.length === 0}>
                <FileText className="h-4 w-4" />
                Page link
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addItem("custom")}>
                <Link2 className="h-4 w-4" />
                Custom link
              </Button>
            </div>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveId(null)}
          >
            <SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-5 space-y-1.5">
                {rows.map((row) => (
                  <SortableNavRow
                    key={row.id}
                    row={row}
                    expanded={expandedId === row.id}
                    onToggle={() => setExpandedId((current) => (current === row.id ? null : row.id))}
                    onUpdate={(patch) => updateItem(row.id, patch)}
                    onRemove={() => removeItem(row.id)}
                    pageOptions={pageOptions}
                  />
                ))}
              </ul>
            </SortableContext>
            <DragOverlay>
              {activeRow && (
                <div className="flex items-center gap-2 rounded-md border border-primary/40 bg-background px-3 py-2 text-sm font-medium shadow-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  {activeRow.item.label}
                  {activeRow.childCount > 0 && (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      +{activeRow.childCount}
                    </span>
                  )}
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <section className="rounded-lg border border-border bg-background p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Publish</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Saving updates the public site menu immediately. System items (Home, Services, …) can be
            renamed, hidden, and reordered but not deleted.
          </p>
          <div className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm text-muted-foreground">
            <p>Version: {version}</p>
            <p>Top-level items: {items.length}</p>
          </div>
          <SubmitButton />
        </section>
        <section className="rounded-lg border border-border bg-background p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="font-medium text-foreground">Tips</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4">
            <li>Services and Products fill their dropdowns automatically from CMS content.</li>
            <li>Manual child links appear below the automatic entries.</li>
            <li>Hidden items stay here but disappear from the website.</li>
          </ul>
        </section>
      </aside>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="mt-4 w-full" disabled={pending} type="submit">
      <Save className="h-4 w-4" />
      {pending ? "Saving..." : "Save Menu"}
    </Button>
  )
}

function SortableNavRow({
  row,
  expanded,
  onToggle,
  onUpdate,
  onRemove,
  pageOptions,
}: {
  row: FlatRow
  expanded: boolean
  onToggle: () => void
  onUpdate: (patch: Partial<MenuItem>) => void
  onRemove: () => void
  pageOptions: PageOption[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })
  const item = row.item
  const isSystem = item.kind === "system"
  const hidden = item.visible === false

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        marginLeft: row.depth * INDENT_WIDTH,
      }}
      className={cn(
        "rounded-md border border-border bg-background",
        isDragging && "z-10 opacity-60 shadow-lg",
        hidden && "opacity-60",
      )}
    >
      <div className="flex items-center gap-2 px-2 py-2">
        <button
          type="button"
          className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {row.depth === 1 && <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}

        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="truncate text-sm font-medium text-foreground">{item.label}</span>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{item.href}</span>
        </button>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            isSystem
              ? "bg-primary/10 text-primary"
              : item.kind === "page"
                ? "bg-accent/30 text-accent-foreground"
                : "bg-secondary text-muted-foreground",
          )}
        >
          {isSystem && <Lock className="h-2.5 w-2.5" />}
          {item.kind}
        </span>

        {row.childCount > 0 && (
          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {row.childCount}
          </span>
        )}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onUpdate({ visible: hidden })}
          aria-label={hidden ? "Show in menu" : "Hide from menu"}
        >
          {hidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4" />}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive disabled:opacity-30"
          disabled={isSystem}
          onClick={onRemove}
          aria-label="Remove menu item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
          aria-label={expanded ? "Collapse" : "Edit menu item"}
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </Button>
      </div>

      {expanded && (
        <div className="grid gap-3 border-t border-border bg-secondary/20 p-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Label
            </label>
            <Input
              className="mt-1 bg-background"
              value={item.label}
              onChange={(event) => onUpdate({ label: event.target.value })}
            />
          </div>

          {item.kind === "page" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CMS page
              </label>
              <select
                className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={item.pageKey ?? ""}
                onChange={(event) =>
                  onUpdate({ pageKey: event.target.value, href: `/${event.target.value}` })
                }
              >
                {pageOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.title} (/{option.key}){option.status !== "published" ? ` — ${option.status}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {item.kind === "custom" && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Link URL
              </label>
              <Input
                className="mt-1 bg-background"
                placeholder="/page or https://..."
                value={item.href ?? ""}
                onChange={(event) => onUpdate({ href: event.target.value })}
              />
            </div>
          )}

          {isSystem && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Path
              </label>
              <div className="mt-1 flex h-9 items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 text-sm text-muted-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
                {item.href}
                {item.auto && <span className="ml-auto text-xs">auto dropdown: {item.auto}</span>}
              </div>
            </div>
          )}

          <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2">
            <Switch
              checked={item.visible !== false}
              onCheckedChange={(checked) => onUpdate({ visible: checked })}
            />
            Visible on the website
          </label>
        </div>
      )}
    </li>
  )
}
