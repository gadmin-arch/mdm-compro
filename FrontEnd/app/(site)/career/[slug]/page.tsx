import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Briefcase, CalendarDays, MapPin, XCircle } from "lucide-react"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { employmentTypeLabel, fallbackCareers, formatDate, getCareer, isCareerClosed } from "@/lib/cms"
import { container } from "@/lib/layout"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return fallbackCareers.data.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = await getCareer((await params).slug)
  if (!career) return {}
  return {
    title: career.seo?.title ?? `${career.title} — PT Multi Daya Mitra Careers`,
    description: career.seo?.description ?? career.summary,
  }
}

export default async function CareerDetailPage({ params }: Props) {
  const career = await getCareer((await params).slug)
  if (!career) notFound()

  const isClosed = isCareerClosed(career)

  return (
    <>
      <PageHero
        eyebrow="Career"
        title={career.title}
        description={career.summary ?? "Open role at PT Multi Daya Mitra."}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers", href: "/career" }, { label: career.title }]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className={container("grid gap-10 py-20 lg:grid-cols-12")}>
          <aside className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{career.department}</Badge>
                {isClosed ? (
                  <Badge
                    variant="outline"
                    className="border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold"
                  >
                    <XCircle className="mr-1 h-3 w-3 text-rose-600 dark:text-rose-400" />
                    Application Closed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  >
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open Position
                  </Badge>
                )}
              </div>

              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="font-medium text-muted-foreground">Location</dt>
                    <dd className="text-foreground">{career.location}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="font-medium text-muted-foreground">Employment</dt>
                    <dd className="text-foreground">{employmentTypeLabel(career.employmentType)}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="font-medium text-muted-foreground">Deadline</dt>
                    <dd className={isClosed ? "font-semibold text-rose-600 dark:text-rose-400" : "text-foreground"}>
                      {formatDate(career.deadline)}
                    </dd>
                  </div>
                </div>
              </dl>

              {isClosed ? (
                <div className="mt-6 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-xs font-semibold text-rose-700 dark:text-rose-400">
                  This position has been closed and is no longer accepting new applications.
                </div>
              ) : (
                <Button asChild className="mt-6 w-full">
                  <a
                    href={career.applyUrl || "mailto:hr@multidayamitra.co.id"}
                    data-analytics-event="career_apply"
                    data-analytics-label={career.title}
                  >
                    Apply Now
                  </a>
                </Button>
              )}
            </div>
          </aside>
          <div className="lg:col-span-8">
            {isClosed && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-800 dark:text-rose-300">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="font-semibold">Position Notice</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-rose-700/90 dark:text-rose-300/90">
                    The application period for this role has ended on {formatDate(career.deadline)}. You can browse other open roles on our career page.
                  </p>
                </div>
              </div>
            )}
            <RichText content={career.description} />
          </div>
        </div>
      </section>
      <CtaBanner
        title={isClosed ? "Explore Other Opportunities" : "Ready to grow with us?"}
        description={
          isClosed
            ? "We are regularly opening new engineering and project roles. Browse our active openings or send your spontaneous CV."
            : "Send your profile and our HR team will review it against current openings."
        }
        primaryHref={isClosed ? "/career" : career.applyUrl || "mailto:hr@multidayamitra.co.id"}
        primaryLabel={isClosed ? "View Open Positions" : "Apply Now"}
      />
    </>
  )
}
