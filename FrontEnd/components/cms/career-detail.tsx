"use client"

import { Briefcase, CalendarDays, MapPin, XCircle } from "lucide-react"
import { RichText } from "@/components/cms/rich-text"
import { CtaBanner } from "@/components/cta-banner"
import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { employmentTypeLabel, formatDate, isCareerClosed, type Career } from "@/lib/cms"
import { container } from "@/lib/layout"
import {
  BilingualText,
  ContentLanguageToggle,
  useContentLanguage,
} from "@/components/cms/content-language"

// The career detail body, lifted out of app/(site)/career/[slug]/page.tsx so
// the public page and the admin draft preview render from ONE definition.
// Purely presentational: no fetching, no notFound() — caller supplies the item.
export function CareerDetailView({ career }: { career: Career }) {
  const { isIndonesian } = useContentLanguage()
  const isClosed = isCareerClosed(career)

  return (
    <>
      <PageHero
        eyebrow={isIndonesian ? "Karir" : "Career"}
        title={<BilingualText text={career.title} />}
        description={
          career.summary ? (
            <BilingualText text={career.summary} />
          ) : isIndonesian ? (
            "Peluang karir dan posisi rekayasa teknik di PT Multi Daya Mitra."
          ) : (
            "Open role at PT Multi Daya Mitra."
          )
        }
        breadcrumbs={[
          { label: isIndonesian ? "Beranda" : "Home", href: "/" },
          { label: isIndonesian ? "Karir" : "Careers", href: "/career" },
          { label: <BilingualText text={career.title} /> },
        ]}
      />
      <section className="border-b border-border/60 bg-background">
        <div className={container("grid gap-10 py-16 lg:grid-cols-12")}>
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{career.department}</Badge>
                {isClosed ? (
                  <Badge
                    variant="outline"
                    className="border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold"
                  >
                    <XCircle className="mr-1 h-3 w-3 text-rose-600 dark:text-rose-400" />
                    {isIndonesian ? "Lowongan Ditutup" : "Application Closed"}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  >
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isIndonesian ? "Posisi Terbuka" : "Open Position"}
                  </Badge>
                )}
              </div>

              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="font-medium text-muted-foreground">{isIndonesian ? "Lokasi Penempatan" : "Location"}</dt>
                    <dd className="text-foreground">{career.location}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="font-medium text-muted-foreground">{isIndonesian ? "Tipe Pekerjaan" : "Employment"}</dt>
                    <dd className="text-foreground">{employmentTypeLabel(career.employmentType)}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="font-medium text-muted-foreground">{isIndonesian ? "Batas Lamaran" : "Deadline"}</dt>
                    <dd className={isClosed ? "font-semibold text-rose-600 dark:text-rose-400" : "text-foreground"}>
                      {formatDate(career.deadline)}
                    </dd>
                  </div>
                </div>
              </dl>

              {isClosed ? (
                <div className="mt-6 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-xs font-semibold text-rose-700 dark:text-rose-400">
                  {isIndonesian
                    ? "Pendaftaran untuk posisi ini telah ditutup. Terima kasih atas antusiasme Anda."
                    : "This position has been closed and is no longer accepting new applications."}
                </div>
              ) : (
                <Button asChild className="mt-6 w-full">
                  <a
                    href={career.applyUrl || "mailto:hr@multidayamitra.co.id"}
                    data-analytics-event="career_apply"
                    data-analytics-label={career.title}
                  >
                    {isIndonesian ? "Lamar Sekarang" : "Apply Now"}
                  </a>
                </Button>
              )}
            </div>
          </aside>
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {isIndonesian ? "Bahasa Konten" : "Content Language"}
              </span>
              <ContentLanguageToggle size="sm" />
            </div>

            {isClosed && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-800 dark:text-rose-300">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="font-semibold">{isIndonesian ? "Pemberitahuan Lowongan" : "Position Notice"}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-rose-700/90 dark:text-rose-300/90">
                    {isIndonesian
                      ? `Batas akhir pendaftaran untuk posisi ini telah berakhir pada ${formatDate(career.deadline)}. Anda dapat meninjau peluang posisi lainnya di halaman Karir kami.`
                      : `The application period for this role has ended on ${formatDate(career.deadline)}. You can browse other open roles on our career page.`}
                  </p>
                </div>
              </div>
            )}
            <RichText content={career.description} />
          </div>
        </div>
      </section>
      <CtaBanner
        title={
          isClosed
            ? isIndonesian
              ? "Jelajahi Peluang Karir Lainnya"
              : "Explore Other Opportunities"
            : isIndonesian
            ? "Siap Berkembang Bersama Kami?"
            : "Ready to grow with us?"
        }
        description={
          isClosed
            ? isIndonesian
              ? "Kami secara berkala membuka kesempatan bagi talenta teknik terbaik. Kirimkan CV dan portfolio Anda."
              : "We are regularly opening new engineering and project roles. Browse our active openings or send your spontaneous CV."
            : isIndonesian
            ? "Kirim profil dan CV Anda, tim HR kami akan segera meninjau kesesuaian kualifikasi Anda."
            : "Send your profile and our HR team will review it against current openings."
        }
        primaryHref={isClosed ? "/career" : career.applyUrl || "mailto:hr@multidayamitra.co.id"}
        primaryLabel={isClosed ? (isIndonesian ? "Lihat Posisi Lain" : "View Open Positions") : (isIndonesian ? "Kirim Lamaran" : "Apply Now")}
      />
    </>
  )
}
