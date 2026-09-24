import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CareerDetailView } from "@/components/cms/career-detail"
import { fallbackCareers, getCareer } from "@/lib/cms"
import { buildBilingualMetadata } from "@/lib/bilingual"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return fallbackCareers.data.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const career = await getCareer((await params).slug)
  if (!career) return {}
  return buildBilingualMetadata({
    title: career.seo?.title || career.title,
    description: career.seo?.description || career.summary,
    canonicalPath: `/career/${career.slug}`,
    noIndex: career.seo?.noIndex,
  })
}

export default async function CareerDetailPage({ params }: Props) {
  const career = await getCareer((await params).slug)
  if (!career) notFound()

  return <CareerDetailView career={career} />
}

