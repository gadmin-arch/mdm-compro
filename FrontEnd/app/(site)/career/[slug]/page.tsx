import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CareerDetailView } from "@/components/cms/career-detail"
import { fallbackCareers, getCareer } from "@/lib/cms"

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

  return <CareerDetailView career={career} />
}

