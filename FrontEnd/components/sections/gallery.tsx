import Image from "next/image"
import { str, records } from "@/lib/sections"
import { container } from "@/lib/layout"

export function GallerySection({ props }: { props: Record<string, unknown> }) {
  const eyebrow = str(props, "eyebrow")
  const title = str(props, "title")
  const images = records(props, "images").filter((image) => image.url)
  if (images.length === 0) return null

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="group">
              <figure>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
                  <Image
                    src={image.url}
                    alt={image.alt ?? ""}
                    fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                {image.caption && (
                  <figcaption className="mt-2 text-sm text-muted-foreground">{image.caption}</figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
