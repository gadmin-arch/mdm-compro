import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsArticleView } from "@/components/cms/news-article"
import { fallbackNews, getNewsItem } from "@/lib/cms"
import { buildBilingualMetadata } from "@/lib/bilingual"

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return fallbackNews.data.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNewsItem((await params).slug)
  if (!news) return {}
  return buildBilingualMetadata({
    title: news.seo?.title || news.title,
    description: news.seo?.description || news.excerpt,
    canonicalPath: `/news/${news.slug}`,
    image: news.featuredImageUrl,
    type: "article",
    noIndex: news.seo?.noIndex,
  })
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsItem((await params).slug)
  if (!news) notFound()

  return <NewsArticleView news={news} />
}
