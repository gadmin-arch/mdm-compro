import { Spinner } from "@/components/ui/spinner"

export default function AdminLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        Loading…
      </div>
    </div>
  )
}
