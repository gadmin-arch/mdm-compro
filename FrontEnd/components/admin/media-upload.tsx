"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { Upload, X, File, AlertCircle, Loader2, Link2, Copy, Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type MediaUploadProps = {
  label: string
  name: string
  defaultValue?: string
  accept: string
  isImage?: boolean
}

export function MediaUpload({ label, name, defaultValue = "", accept, isImage = true }: MediaUploadProps) {
  const [value, setValue] = useState(defaultValue)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)

  // Track the filename from URL
  const fileName = useMemo(() => {
    if (!value) return ""
    const parts = value.split("/")
    return decodeURIComponent(parts[parts.length - 1] || "")
  }, [value])

  // Sync state if default value changes (e.g. initial form load),
  // derived during render instead of via an effect.
  const [prevDefault, setPrevDefault] = useState(defaultValue)
  if (defaultValue !== prevDefault) {
    setPrevDefault(defaultValue)
    setValue(defaultValue)
  }

  // Monitor form to disable submit button during upload
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
      // Re-enable on unmount if it was stuck
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
    // Validate locally first
    const maxMB = 25
    if (file.size > maxMB * 1024 * 1024) {
      setStatus("error")
      setErrorMsg(`File exceeds ${maxMB}MB limit.`)
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
          setErrorMsg("Failed to parse server response.")
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText)
          setStatus("error")
          setErrorMsg(res.message || "Upload failed.")
        } catch {
          setStatus("error")
          setErrorMsg(`Error ${xhr.status}: Upload failed.`)
        }
      }
    }

    xhr.onerror = () => {
      xhrRef.current = null
      setStatus("error")
      setErrorMsg("Network connection error.")
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
    setStatus("idle")
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCopyUrl = () => {
    if (value) {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      navigator.clipboard.writeText(origin + value)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:bg-destructive/10"
            onClick={handleClear}
          >
            <X className="mr-1 h-3.5 w-3.5" /> Remove
          </Button>
        )}
      </div>

      <input type="hidden" name={name} value={value} />

      {value ? (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {isImage && (value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || value.includes("media/uploads")) ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border border-border bg-secondary/50 sm:w-32">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an arbitrary uploaded URL; no LCP/SEO impact */}
                <img
                  src={value}
                  alt={fileName || "Preview"}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md border border-border bg-secondary/50 sm:w-32">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-semibold truncate text-foreground">{fileName || "Uploaded file"}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{value}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  onClick={handleCopyUrl}
                >
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Link
                </Button>
                <a
                  href={value}
                  download={fileName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-2.5 text-xs font-medium shadow-xs hover:bg-accent hover:text-accent-foreground"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/50 bg-card"
          }`}
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
                <p className="text-sm font-medium">Uploading file...</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progress}%</span>
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="hover:text-foreground underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP, SVG, PDF, DOC, DOCX, XLS, XLSX, ZIP (Max 25MB)
              </p>
            </div>
          )}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2.5 text-xs text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <div className="font-medium">{errorMsg}</div>
        </div>
      )}
    </div>
  )
}
