import sanitizeHtml from "sanitize-html"

// jsdom-free sanitizer (isomorphic-dompurify pulls jsdom on the server, which
// crashes on Vercel's Node runtime). Mirrors DOMPurify's html profile: common
// rich-text tags only, safe URL schemes, no scripts/styles/event handlers.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "u",
    "s",
    "figure",
    "figcaption",
    "span",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "name", "target", "rel"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
}

type Block = {
  type?: string
  text?: string
  items?: string[]
  html?: string
  data?: {
    text?: string
    items?: string[]
  }
}

export function RichText({ content }: { content?: { blocks?: Block[] } | unknown }) {
  const blocks = isBlockContent(content) ? content.blocks : []

  if (blocks.length === 0) {
    return <p className="text-muted-foreground">Details will be published soon.</p>
  }

  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      {blocks.map((block, index) => {
        const text = block.text ?? block.data?.text
        const items = block.items ?? block.data?.items ?? []

        if (block.type === "html") {
          // Rich-text editor output; always sanitized before injection.
          const clean = sanitizeHtml(block.html ?? "", SANITIZE_OPTIONS)
          if (!clean) return null
          return <div key={index} className="cms-prose" dangerouslySetInnerHTML={{ __html: clean }} />
        }
        if (block.type === "heading") {
          return (
            <h2 key={index} className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {text}
            </h2>
          )
        }
        if (block.type === "quote") {
          return (
            <blockquote key={index} className="border-l-2 border-primary pl-4 text-foreground">
              {text}
            </blockquote>
          )
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          )
        }
        return <p key={index}>{text}</p>
      })}
    </div>
  )
}

function isBlockContent(value: unknown): value is { blocks: Block[] } {
  return Boolean(value && typeof value === "object" && "blocks" in value && Array.isArray((value as { blocks?: unknown }).blocks))
}
