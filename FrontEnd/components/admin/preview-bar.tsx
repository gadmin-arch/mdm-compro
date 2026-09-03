import Link from "next/link"
import { ArrowLeft, EyeOff } from "lucide-react"

const STATUS_NOTE: Record<string, string> = {
  draft: "Draft — belum terlihat oleh publik",
  scheduled: "Terjadwal — belum terlihat oleh publik",
  archived: "Diarsipkan — tidak terlihat oleh publik",
  published: "Sudah tayang — versi publik ada di URL di bawah",
}

// Chrome above the rendered draft. Colours are hardcoded rather than themed so
// the bar reads as tooling, not as part of the article being reviewed.
export function PreviewBar({
  status,
  slug,
  backHref,
}: {
  status: string
  slug: string
  backHref: string
}) {
  return (
    <div className="sticky top-0 z-50 border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-amber-900 print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <EyeOff className="h-4 w-4 shrink-0" aria-hidden="true" />
            {STATUS_NOTE[status] ?? `Status: ${status}`}
          </p>
          <p className="mt-0.5 text-xs text-amber-800">
            Menampilkan versi <strong>tersimpan terakhir</strong> — perubahan yang belum di-Save tidak ikut tampil.
            URL publiknya nanti: <span className="font-mono">/news/{slug}</span>
          </p>
        </div>
        <Link
          href={backHref}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 self-start rounded-md border border-amber-400 bg-white px-3 py-1.5 text-sm font-medium hover:bg-amber-100 sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke editor
        </Link>
      </div>
    </div>
  )
}
