import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsArticleView } from "@/components/cms/news-article"
import { fallbackNews, getNewsItem } from "@/lib/cms"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return fallbackNews.data.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNewsItem((await params).slug)
  if (!news) return {}
  return {
    title: news.seo?.title ?? `${news.title} — PT Multi Daya Mitra`,
    description: news.seo?.description ?? news.excerpt,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsItem((await params).slug)
  if (!news) notFound()

  return <NewsArticleView news={news} />
}
