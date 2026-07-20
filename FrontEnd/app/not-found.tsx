import Link from "next/link"
import { Button } from "@/components/ui/button"

// Root-level 404: catches multi-segment unknown URLs that no route matches
// (single-segment slugs fall through to the (site) catch-all and its 404).
export default function RootNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      <p className="font-display text-7xl font-semibold tracking-tight text-primary/20 sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
