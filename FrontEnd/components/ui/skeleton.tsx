import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  // bg-foreground/10, not the shadcn default bg-accent: this theme overrides
  // --accent to brand amber, which would make skeletons pulse yellow.
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-foreground/10 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
