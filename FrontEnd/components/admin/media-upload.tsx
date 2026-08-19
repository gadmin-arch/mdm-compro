"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Link2,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type MediaUploadProps = {
  label: string
  name: string
  defaultValue?: string
  accept: string
  isImage?: boolean
  className?: string
}

export function MediaUpload({
  label,
  name,
  defaultValue = "",
  accept,
  isImage = true,
  className,
}: MediaUploadProps) {
  const [value, setValue] = useState(defaultValue)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [urlInput, setUrlInput] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)

  // Track the filename from URL
  const fileName = useMemo(() => {
    if (!value) return ""
    const parts = value.split("/")
    return decodeURIComponent(parts[parts.length - 1] || "")
  }, [value])

  // Sync state if default value changes
  const [prevDefault, setPrevDefault] = useState(defaultValue)
  if (defaultValue !== prevDefault) {
    setPrevDefault(defaultValue)
    setValue(defaultValue)
  }

  // Disable submit button during active upload
  useEffect(() => {
    const isUploading = status === "uploading"
    const form = fileInputRef.current?.form
    if (form) {
      const submitButtons = form.querySelectorAll('button[type="submit"]')
      submitButtons.forEach((btn) => {
        if (isUploading) {
          btn.setAttribute("disabled", "true")
        } else {
          btn.removeAttribute("disabled")
        }
      })
    }
    return () => {
      if (form) {
        const submitButtons = form.querySelectorAll('button[type="submit"]')
        submitButtons.forEach((btn) => btn.removeAttribute("disabled"))
      }
    }
  }, [status])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const uploadFile = (file: File) => {
    const maxMB = 25
    if (file.size > maxMB * 1024 * 1024) {
      setStatus("error")
      setErrorMsg(`Ukuran file melebihi batas ${maxMB}MB.`)
      return
    }

    setStatus("uploading")
    setProgress(0)
    setErrorMsg("")

    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr
    xhr.open("POST", "/api/admin/upload")

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        setProgress(percent)
      }
    }

    xhr.onload = () => {
      xhrRef.current = null
      if (xhr.status === 201) {
        try {
          const res = JSON.parse(xhr.responseText)
          setValue(res.url)
          setStatus("success")
        } catch {
          setStatus("error")
          setErrorMsg("Gagal memproses respon server.")
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText)
          setStatus("error")
          setErrorMsg(res.message || "Upload gagal.")
        } catch {
          setStatus("error")
          setErrorMsg(`Error ${xhr.status}: Upload gagal.`)
        }
      }
    }

    xhr.onerror = () => {
      xhrRef.current = null
      setStatus("error")
      setErrorMsg("Koneksi jaringan terputus.")
    }

    xhr.send(formData)
  }

  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort()
      xhrRef.current = null
    }
    setStatus("idle")
    setProgress(0)
  }

  const handleClear = () => {
    setValue("")
    setUrlInput("")
    setStatus("idle")
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setValue(urlInput.trim())
      setStatus("success")
    }
  }

  const handleCopyUrl = () => {
    if (value) {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const fullUrl = value.startsWith("http") ? value : origin + value
      navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={handleClear}
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Hapus
          </Button>
        )}
      </div>

      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 shadow-2xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {isImage && (value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || value.includes("media/uploads") || value.startsWith("data:image")) ? (
              <div className="relative aspect-video w-full sm:w-36 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt={fileName || "Preview"}
                  className="h-full w-full object-contain p-1"
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full sm:w-36 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/40">
                <FileText className="h-8 w-8 text-sky-500" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-xs font-bold truncate text-foreground">
                {fileName || "File terpilih"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate text-[11px] font-mono">{value}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7.5 px-2.5 text-xs font-semibold"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Ganti File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7.5 px-2.5 text-xs font-semibold"
                  onClick={handleCopyUrl}
                >
                  {copied ? (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Salin URL
                    </>
                  )}
                </Button>
                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-7.5 items-center justify-center rounded-md border border-input bg-background px-2.5 text-xs font-semibold shadow-2xs hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5 text-slate-500" /> Buka
                </a>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900/40 shadow-2xs">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "upload" | "url")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-3">
              <TabsTrigger value="upload" className="text-xs font-semibold">
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload File
              </TabsTrigger>
              <TabsTrigger value="url" className="text-xs font-semibold">
                <Link2 className="mr-1.5 h-3.5 w-3.5" /> Masukkan URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50 bg-secondary/15",
                )}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                  disabled={status === "uploading"}
                />

                {status === "uploading" ? (
                  <div className="w-full max-w-xs space-y-3 py-2 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    <div className="space-y-1">
                      <p className="text-xs font-semibold">Mengupload file...</p>
                      <Progress value={progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{progress}%</span>
                        <button
                          type="button"
                          onClick={handleCancelUpload}
                          className="hover:text-foreground underline cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      {isImage ? <ImageIcon className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-primary">Klik untuk pilih file</span> atau drag & drop ke sini
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {isImage
                        ? "Mendukung JPG, PNG, WebP, SVG, GIF (Maks. 25MB)"
                        : "Mendukung PDF, DOC, DOCX, XLS, XLSX, ZIP (Maks. 25MB)"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <Input
                  placeholder={isImage ? "https://... atau /uploads/gambar.jpg" : "https://... atau /uploads/dokumen.pdf"}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleApplyUrl()
                    }
                  }}
                  className="text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="text-xs font-semibold shrink-0"
                >
                  Gunakan
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Anda juga dapat menyalin URL dari menu Media Library dan menempelkannya di sini.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive border border-destructive/20 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="font-medium">{errorMsg}</div>
        </div>
      )}
    </div>
  )
}
