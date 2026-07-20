import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"

export default function SiteNotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="font-display text-7xl font-semibold tracking-tight text-primary/20 sm:text-8xl">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/services">
            Explore services
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </Container>
  )
}
