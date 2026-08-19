"use client"

import { useState, useRef } from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Redo2,
  Trash2,
  Undo2,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 border border-border",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "cms-prose min-h-[260px] px-4 py-3 outline-none text-sm text-foreground",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.isEmpty ? "" : editor.getHTML())
    },
  })

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-background shadow-2xs", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

function Toolbar({ editor }: { editor: Editor | null }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkOpenNewTab, setLinkOpenNewTab] = useState(true)

  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return <div className="h-10 border-b border-border bg-secondary/30" />
  }

  const openLinkDialog = () => {
    const current = (editor.getAttributes("link").href as string | undefined) ?? ""
    const currentTarget = (editor.getAttributes("link").target as string | undefined) ?? ""
    setLinkUrl(current)
    setLinkOpenNewTab(currentTarget === "_blank")
    setLinkDialogOpen(true)
  }

  const handleApplyLink = () => {
    const trimmed = linkUrl.trim()
    if (!trimmed || trimmed === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      const formatted = trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")
        ? trimmed
        : `https://${trimmed}`
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: formatted,
          target: linkOpenNewTab ? "_blank" : undefined,
        })
        .run()
    }
    setLinkDialogOpen(false)
  }

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkDialogOpen(false)
  }

  const openImageDialog = () => {
    setImageUrl("")
    setImageAlt("")
    setUploadError("")
    setUploadProgress(0)
    setImageDialogOpen(true)
  }

  const handleUploadFile = (file: File) => {
    const maxMB = 25
    if (file.size > maxMB * 1024 * 1024) {
      setUploadError(`File size exceeds limit of ${maxMB}MB.`)
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadError("")

    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/admin/upload")

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      setUploading(false)
      if (xhr.status === 201) {
        try {
          const res = JSON.parse(xhr.responseText)
          if (res.url) {
            setImageUrl(res.url)
          }
        } catch {
          setUploadError("Failed to parse server response.")
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText)
          setUploadError(res.message || "Upload failed.")
        } catch {
          setUploadError(`Error ${xhr.status}: Upload failed.`)
        }
      }
    }

    xhr.onerror = () => {
      setUploading(false)
      setUploadError("Network connection error.")
    }

    xhr.send(formData)
  }

  const handleInsertImage = () => {
    if (!imageUrl.trim()) return
    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl.trim(),
        alt: imageAlt.trim() || undefined,
      })
      .run()
    setImageDialogOpen(false)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-slate-50/70 dark:bg-slate-900/50 px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Insert Link" active={editor.isActive("link")} onClick={openLinkDialog}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Insert Image" active={false} onClick={openImageDialog}>
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton label="Undo" active={false} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" active={false} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Styled Link Modal */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-sky-500" />
              {editor.isActive("link") ? "Edit Link" : "Insert Link"}
            </DialogTitle>
            <DialogDescription>
              Masukkan URL tujuan tautan di bawah ini.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Link URL</label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleApplyLink()
                  }
                }}
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
              <Checkbox
                checked={linkOpenNewTab}
                onCheckedChange={(checked) => setLinkOpenNewTab(checked === true)}
              />
              Buka tautan di tab baru (target=&ldquo;_blank&rdquo;)
            </label>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            {editor.isActive("link") ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveLink}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Hapus Link
              </Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setLinkDialogOpen(false)}>
                Batal
              </Button>
              <Button type="button" size="sm" onClick={handleApplyLink}>
                Terapkan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Styled Image Upload & URL Modal */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-sky-500" />
              Sisipkan Gambar
            </DialogTitle>
            <DialogDescription>
              Upload gambar langsung dari perangkat atau masukkan URL gambar.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="text-xs">Upload Langsung</TabsTrigger>
              <TabsTrigger value="url" className="text-xs">Gunakan URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 pt-3">
              {imageUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={imageAlt || "Preview"}
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur-xs hover:bg-destructive hover:text-white transition-colors"
                      title="Ganti Gambar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Alt Text (Deskripsi Gambar)</label>
                    <Input
                      placeholder="Contoh: Foto panel distribusi LV"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/50 bg-secondary/20"
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragActive(false)
                    if (e.dataTransfer.files?.[0]) {
                      handleUploadFile(e.dataTransfer.files[0])
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleUploadFile(e.target.files[0])
                      }
                    }}
                    disabled={uploading}
                  />

                  {uploading ? (
                    <div className="w-full max-w-xs space-y-3 py-2 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Mengupload gambar...</p>
                        <Progress value={uploadProgress} className="h-1.5" />
                        <span className="text-[11px] text-muted-foreground">{uploadProgress}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-primary">Klik untuk upload</span> atau drag & drop
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Mendukung JPG, PNG, WebP, SVG, GIF (Maks. 25MB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-medium text-destructive">{uploadError}</p>
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Image URL</label>
                <Input
                  placeholder="https://... atau /uploads/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Alt Text (Deskripsi Gambar)</label>
                <Input
                  placeholder="Contoh: Foto trafo gardu induk"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>

              {imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-secondary/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={imageAlt || "Preview"}
                    className="h-full w-full object-contain"
                    onError={() => {
                      // Handled by user seeing broken preview
                    }}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setImageDialogOpen(false)}>
              Batal
            </Button>
            <Button type="button" size="sm" disabled={!imageUrl.trim()} onClick={handleInsertImage}>
              Sisipkan Gambar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "h-7 w-7 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
        active && "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs",
      )}
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function Divider() {
  return <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />
}

export function RichTextField({
  label,
  name,
  defaultValue = "",
}: {
  label: string
  name: string
  defaultValue?: string
}) {
  const [html, setHtml] = useState(defaultValue)
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type="hidden" name={name} value={html} />
      <RichTextEditor className="mt-1" value={defaultValue} onChange={setHtml} />
    </div>
  )
}
