import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CareerDetailView } from "@/components/cms/career-detail"
import { fallbackCareers, getCareer } from "@/lib/cms"
import { toLocale } from "@/lib/i18n"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string; slug: string }>
}

export function generateStaticParams() {
  return fallbackCareers.data.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const career = await getCareer(slug)
  if (!career) return {}
  return buildLocalizedMetadata({
    lang: toLocale(lang),
    path: `/career/${career.slug}`,
    title: career.seo?.title || career.title,
    description: career.seo?.description || career.summary,
    canonical: career.seo?.canonical,
    noIndex: career.seo?.noIndex,
  })
}

export default async function CareerDetailPage({ params }: Props) {
  const career = await getCareer((await params).slug)
  if (!career) notFound()

  return <CareerDetailView career={career} />
}
