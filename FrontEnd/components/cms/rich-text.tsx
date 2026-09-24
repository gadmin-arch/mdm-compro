"use client"

import sanitizeHtml from "sanitize-html"
import {
  type ContentBlock,
  type ContentLanguage,
  filterBilingualBlocks,
  useContentLanguage,
} from "@/components/cms/content-language"

// jsdom-free sanitizer (isomorphic-dompurify pulls jsdom on the server, which
// crashes on Vercel's Node runtime). Mirrors DOMPurify's html profile: common
// rich-text tags only, safe URL schemes, no scripts/styles/event handlers.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
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

export function RichText({
  content,
  lang: forcedLang,
}: {
  content?: { blocks?: ContentBlock[] } | unknown
  lang?: ContentLanguage
}) {
  const { lang: contextLang } = useContentLanguage()
  const activeLang = forcedLang ?? contextLang

  let rawBlocks: ContentBlock[] = []
  if (isBlockContent(content)) {
    rawBlocks = content.blocks
  } else if (typeof content === "string" && content.trim()) {
    rawBlocks = [{ type: "html", html: content.trim() }]
  } else if (content && typeof content === "object" && "html" in content && typeof (content as { html: unknown }).html === "string") {
    rawBlocks = [{ type: "html", html: (content as { html: string }).html.trim() }]
  }

  // Filter bilingual content so only active language (ID or EN) is rendered
  const blocks = filterBilingualBlocks(rawBlocks, activeLang)

  if (blocks.length === 0) {
    return (
      <p className="text-muted-foreground">
        {activeLang === "id" ? "Detail informasi akan segera dipublikasikan." : "Details will be published soon."}
      </p>
    )
  }

  return (
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      {blocks.map((block, index) => {
        const text = block.text ?? block.data?.text
        const items = block.items ?? block.data?.items ?? []
        const type = block.type ?? "paragraph"

        if (type === "html") {
          // Rich-text editor output; always sanitized before injection.
          const clean = sanitizeHtml(block.html ?? "", SANITIZE_OPTIONS)
          if (!clean) return null
          return <div key={index} className="cms-prose" dangerouslySetInnerHTML={{ __html: clean }} />
        }
        if (type === "heading" || type === "header") {
          const level = block.data?.level ?? 2
          if (level === 3) {
            return (
              <h3 key={index} className="font-display text-xl font-semibold tracking-tight text-foreground">
                {text}
              </h3>
            )
          }
          return (
            <h2 key={index} className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {text}
            </h2>
          )
        }
        if (type === "quote") {
          return (
            <blockquote key={index} className="border-l-2 border-primary pl-4 text-foreground">
              {text}
            </blockquote>
          )
        }
        if (type === "list") {
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

function isBlockContent(value: unknown): value is { blocks: ContentBlock[] } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "blocks" in value &&
      Array.isArray((value as { blocks?: unknown }).blocks)
  )
}
