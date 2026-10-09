import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NewsArticleView } from "@/components/cms/news-article"
import { fallbackNews, getNewsItem } from "@/lib/cms"
import { toLocale } from "@/lib/i18n"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string; slug: string }>
}

export function generateStaticParams() {
  return fallbackNews.data.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const news = await getNewsItem(slug)
  if (!news) return {}
  return buildLocalizedMetadata({
    lang: toLocale(lang),
    path: `/news/${news.slug}`,
    title: news.seo?.title || news.title,
    description: news.seo?.description || news.excerpt,
    canonical: news.seo?.canonical,
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
