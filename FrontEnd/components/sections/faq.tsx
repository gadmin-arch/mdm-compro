import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { items, prop } from "@/lib/sections"
import { container } from "@/lib/layout"
import type { Locale } from "@/lib/i18n"
import { resolveText } from "@/lib/localized"

export function FaqSection({ props, lang }: { props: Record<string, unknown>; lang: Locale }) {
  const eyebrow = resolveText(prop(props, "eyebrow"), lang)
  const title = resolveText(prop(props, "title"), lang)
  const entries = items(props, "items")
    .map((item) => ({ question: resolveText(item.question, lang), answer: resolveText(item.answer, lang) }))
    .filter((item) => item.question)
  if (entries.length === 0) return null

  return (
    <section className="border-b border-border/60 bg-background">
      <div className={container("grid gap-10 py-16 lg:grid-cols-12")}>
        <div className="lg:col-span-4">
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
        <div className="lg:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {entries.map((item, index) => (
              <AccordionItem key={`${item.question}-${index}`} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="whitespace-pre-line text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
