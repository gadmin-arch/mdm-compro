import { cn } from "@/lib/utils"

// Single source of truth for the page container so width/gutter changes apply
// site-wide instead of being copy-pasted per section.
export function container(className?: string) {
  return cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)
}
