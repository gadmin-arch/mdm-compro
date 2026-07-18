"use client"

import { Fragment, useMemo, useRef, useState } from "react"
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
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { SaveErrorBanner, useSaveAction } from "@/components/admin/save-state"
import type { MenuItem } from "@/lib/cms"
import type { SaveAction } from "@/lib/save-result"
import { cn } from "@/lib/utils"

const INDENT_WIDTH = 32

export type PageOption = { key: string; title: string; status: string }

export type AutoChild = { label: string; href: string }

// Top-level services/products content nodes; shown read-only under the menu
// items whose dropdown auto-fills from that content.
export type AutoChildren = { services: AutoChild[]; products: AutoChild[] }

type NavigationEditorProps = {
  action: SaveAction
  initialItems: MenuItem[]
  version: number
  pageOptions: PageOption[]
  autoChildren?: AutoChildren
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
// no top item above it is promoted to the top level. Children fold back in
// from their own depth-1 rows — only the dragged item (whose children were
// excluded from the flat list) keeps its original children.
function buildTree(rows: Array<{ item: MenuItem; depth: number }>, preserveChildrenOf?: string): MenuItem[] {
  const tree: MenuItem[] = []
  for (const row of rows) {
    const keepChildren =
      row.item.id === preserveChildrenOf ? (row.item.children ?? []) : []
    const node: MenuItem = { ...row.item, children: row.depth === 0 ? keepChildren : [] }
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

// Collapses duplicate ids (defensive: repairs menus saved by the old buggy
// drag logic that doubled children).
function dedupeItems(items: MenuItem[]): MenuItem[] {
  const seen = new Set<string>()
  const walk = (list: MenuItem[]): MenuItem[] =>
    list
      .filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })
      .map((item) => ({ ...item, children: walk(item.children ?? []) }))
  return walk(items)
}

function makeItemId() {
  return `nav-${Math.random().toString(36).slice(2, 10)}`
}

export function NavigationEditor({ action, initialItems, version, pageOptions, autoChildren }: NavigationEditorProps) {
  const [items, setItems] = useState<MenuItem[]>(() => dedupeItems(initialItems))
  const [activeId, setActiveId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const { pending, result: saveResult, submit } = useSaveAction(action)

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
        draggedId,
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

  function addChildItem(parentId: string) {
    const child: MenuItem = {
      id: makeItemId(),
      label: "New link",
      kind: "custom",
      href: "/",
      visible: true,
    }
    setItems((current) =>
      current.map((item) =>
        item.id === parentId ? { ...item, children: [...(item.children ?? []), child] } : item,
      ),
    )
    setExpandedId(child.id)
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
    <form
      ref={formRef}
      onSubmit={(event) => {
        // Submitted programmatically so a failed save (e.g. version conflict)
        // returns here and the arranged menu tree stays intact.
        event.preventDefault()
        submit(event.currentTarget)
      }}
      className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
    >
      <input name="items" type="hidden" value={itemsJson} />
      <input name="version" type="hidden" value={version} />

      {saveResult && (
        <div className="xl:col-span-2">
          <SaveErrorBanner
            result={saveResult}
            entity="menu"
            onOverwrite={
              saveResult.serverVersion
                ? () => submit(formRef.current, { version: String(saveResult.serverVersion) })
                : undefined
            }
          />
        </div>
      )}

      <div className="space-y-4">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">Menu Structure</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag to reorder. Use the + button (or drag right) to nest a link under an item.
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
                {rows.map((row) => {
                  const autoEntries =
                    row.depth === 0 && row.item.auto ? (autoChildren?.[row.item.auto] ?? []) : []
                  return (
                    <Fragment key={row.id}>
                      <SortableNavRow
                        row={row}
                        expanded={expandedId === row.id}
                        onToggle={() => setExpandedId((current) => (current === row.id ? null : row.id))}
                        onUpdate={(patch) => updateItem(row.id, patch)}
                        onRemove={() => removeItem(row.id)}
                        onAddChild={row.depth === 0 ? () => addChildItem(row.id) : undefined}
                        autoCount={autoEntries.length}
                        pageOptions={pageOptions}
                      />
                      {/* Read-only ghosts of the dropdown entries auto-filled
                          from CMS content. Not sortable, never submitted. */}
                      {autoEntries.map((child, index) => (
                        <li
                          key={`${row.id}-auto-${index}`}
                          style={{ marginLeft: INDENT_WIDTH }}
                          className="flex items-center gap-2 rounded-md border border-dashed border-border bg-secondary/20 px-3 py-1.5 text-sm text-muted-foreground"
                        >
                          <CornerDownRight className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate font-medium">{child.label}</span>
                          <span className="hidden truncate text-xs sm:inline">{child.href}</span>
                          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                            <Sparkles className="h-2.5 w-2.5" />
                            auto
                          </span>
                        </li>
                      ))}
                    </Fragment>
                  )
                })}
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
          <SubmitButton pending={pending} />
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

function SubmitButton({ pending }: { pending: boolean }) {
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
  onAddChild,
  autoCount = 0,
  pageOptions,
}: {
  row: FlatRow
  expanded: boolean
  onToggle: () => void
  onUpdate: (patch: Partial<MenuItem>) => void
  onRemove: () => void
  onAddChild?: () => void
  autoCount?: number
  pageOptions: PageOption[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })
  const item = row.item
  const isSystem = item.kind === "system"
  const hidden = item.visible === false
  // Which content tree this item's dropdown would auto-fill from, based on
  // its path; lets the switch re-enable auto after it was turned off.
  const autoSource =
    item.href === "/services" ? "services" : item.href === "/products" ? "products" : undefined

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

        {(row.childCount > 0 || autoCount > 0) && (
          <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {row.childCount > 0 && row.childCount}
            {row.childCount > 0 && autoCount > 0 && " · "}
            {autoCount > 0 && `+${autoCount} auto`}
          </span>
        )}

        {onAddChild && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onAddChild}
            aria-label="Add sub-item"
            title="Add a link under this item"
          >
            <Plus className="h-4 w-4" />
          </Button>
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

          {autoSource && (
            <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm sm:col-span-2">
              <Switch
                checked={Boolean(item.auto)}
                onCheckedChange={(checked) => onUpdate({ auto: checked ? autoSource : undefined })}
              />
              <span>
                Fill dropdown automatically from {autoSource === "services" ? "Services" : "Products"} content
                <span className="block text-xs text-muted-foreground">
                  Manual sub-items appear after the automatic entries.
                </span>
              </span>
            </label>
          )}
        </div>
      )}
    </li>
  )
}
