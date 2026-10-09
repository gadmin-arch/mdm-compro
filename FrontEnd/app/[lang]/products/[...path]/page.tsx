import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/cms/product-detail"
import { findNodeInTree, flattenContent, getProduct, getProducts } from "@/lib/cms"
import { toLocale } from "@/lib/i18n"
import { buildLocalizedMetadata } from "@/lib/seo-metadata"

type Props = {
  params: Promise<{ lang: string; path: string[] }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return flattenContent(products).map((item) => ({ path: item.fullPath.split("/") }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, path: segments } = await params
  const path = segments.join("/")
  const product = await getProduct(path)
  if (!product) return {}
  return buildLocalizedMetadata({
    lang: toLocale(lang),
    path: `/products/${product.fullPath || path}`,
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.summary,
    canonical: product.seo?.canonical,
    image: product.imageUrl,
    noIndex: product.seo?.noIndex,
  })
}

export default async function ProductDetailPage({ params }: Props) {
  const path = (await params).path.join("/")
  const allProducts = await getProducts()
  const treeNode = findNodeInTree(allProducts, path)
  const product = treeNode ?? (await getProduct(path))
  if (!product) notFound()

  const subProducts = treeNode?.children ?? product.children ?? []

  return <ProductDetailView product={product} subProducts={subProducts} />
}
