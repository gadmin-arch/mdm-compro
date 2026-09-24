import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Briefcase, FileText, Layout, SearchIcon, Wrench } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { globalSearch } from "@/lib/cms"
import { container } from "@/lib/layout"
import { BilingualText } from "@/components/cms/content-language"
import { buildBilingualMetadata } from "@/lib/bilingual"
import { SearchBox } from "./search-box"

export const metadata: Metadata = buildBilingualMetadata({
  title: "Pencarian Situs\nGlobal Search Results",
  description:
    "Cari produk, layanan, berita, karir, dan dokumentasi PT Multi Daya Mitra.\nSearch products, services, news, careers, and documentation across PT Multi Daya Mitra.",
  canonicalPath: "/search",
})

type Props = {
  searchParams: Promise<{ q?: string; search?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const query = await searchParams
  const q = query.q || query.search || ""

  const results = q ? await globalSearch(q) : { products: [], services: [], careers: [], news: [], pages: [] }

  const totalResults =
    results.products.length +
    results.services.length +
    results.careers.length +
    results.news.length +
    results.pages.length

  return (
    <>
      <PageHero
        eyebrow="EN: Global Search\nID: Pencarian Global"
        title={q ? `EN: Search results for "${q}"\nID: Hasil pencarian untuk "${q}"` : "EN: Search our website\nID: Cari di situs kami"}
        description="EN: Search across products, services, careers, news, and pages.\nID: Temukan informasi produk, layanan, karir, berita, dan halaman situs kami."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "EN: Search\nID: Pencarian" }]}
      />

      <section className="border-b border-border/60 bg-background min-h-[50vh]">
        <div className={container("py-16")}>
          {/* Search Box on Search Page */}
          <SearchBox initialQuery={q} />

          {!q ? (
            <div className="text-center py-10 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground mb-4">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                <BilingualText text="EN: Find what you need\nID: Temukan kebutuhan Anda" />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                <BilingualText text="EN: Type in keywords above to search all documentation, products, services, and career opportunities.\nID: Masukkan kata kunci di atas untuk mencari dokumentasi, produk, layanan, dan lowongan karir kami." />
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-12 max-w-md mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                <BilingualText text="EN: No matching results found\nID: Tidak ada hasil yang cocok" />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                <BilingualText text={`EN: We couldn't find anything matching "${q}". Try adjusting your keywords or checking spelling.\nID: Kami tidak menemukan hasil yang cocok untuk "${q}". Coba sesuaikan kata kunci atau periksa ejaan Anda.`} />
              </p>
            </div>
          ) : (
            <div className="mt-8">
              <div className="mb-6 flex justify-between items-center border-b pb-4">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  <BilingualText text={`EN: Found ${totalResults} match${totalResults !== 1 ? "es" : ""}\nID: Ditemukan ${totalResults} hasil`} />
                </h2>
              </div>

              <Tabs defaultValue={results.products.length > 0 ? "products" : results.services.length > 0 ? "services" : results.news.length > 0 ? "news" : results.careers.length > 0 ? "careers" : "pages"} className="w-full">
                <TabsList className="flex flex-wrap h-auto bg-muted p-1 rounded-xl mb-8 max-w-3xl">
                  <TabsTrigger value="products" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <Wrench className="h-4 w-4" />
                    <BilingualText text={`EN: Products (${results.products.length})\nID: Produk (${results.products.length})`} />
                  </TabsTrigger>
                  <TabsTrigger value="services" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <Briefcase className="h-4 w-4" />
                    <BilingualText text={`EN: Services (${results.services.length})\nID: Layanan (${results.services.length})`} />
                  </TabsTrigger>
                  <TabsTrigger value="news" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <BookOpen className="h-4 w-4" />
                    <BilingualText text={`EN: News (${results.news.length})\nID: Berita (${results.news.length})`} />
                  </TabsTrigger>
                  <TabsTrigger value="careers" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <FileText className="h-4 w-4" />
                    <BilingualText text={`EN: Careers (${results.careers.length})\nID: Karir (${results.careers.length})`} />
                  </TabsTrigger>
                  <TabsTrigger value="pages" className="rounded-lg py-2 px-4 text-sm font-medium flex gap-1.5 items-center">
                    <Layout className="h-4 w-4" />
                    <BilingualText text={`EN: Pages (${results.pages.length})\nID: Halaman (${results.pages.length})`} />
                  </TabsTrigger>
                </TabsList>

                {/* Products Tab Content */}
                <TabsContent value="products" className="mt-0">
                  {results.products.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">
                      <BilingualText text="EN: No products matched your search.\nID: Tidak ada produk yang cocok dengan pencarian Anda." />
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.products.map((item) => (
                        <Link key={item.id} href={`/products/${item.fullPath}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline">
                                  <BilingualText text="EN: Product\nID: Produk" />
                                </Badge>
                                {item.specs?.category && (
                                  <span className="text-xs text-muted-foreground font-medium">
                                    <BilingualText text={item.specs.category} />
                                  </span>
                                )}
                              </div>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                <BilingualText text={item.title} />
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">
                                <BilingualText text={item.summary} />
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Services Tab Content */}
                <TabsContent value="services" className="mt-0">
                  {results.services.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">
                      <BilingualText text="EN: No services matched your search.\nID: Tidak ada layanan yang cocok dengan pencarian Anda." />
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.services.map((item) => (
                        <Link key={item.id} href={`/services/${item.fullPath}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <Badge variant="outline" className="w-fit mb-2">
                                <BilingualText text="EN: Service\nID: Layanan" />
                              </Badge>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                <BilingualText text={item.title} />
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">
                                <BilingualText text={item.summary} />
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* News Tab Content */}
                <TabsContent value="news" className="mt-0">
                  {results.news.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">
                      <BilingualText text="EN: No articles matched your search.\nID: Tidak ada artikel yang cocok dengan pencarian Anda." />
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.news.map((item) => (
                        <Link key={item.id} href={`/news/${item.slug}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline">
                                  <BilingualText text="EN: News\nID: Berita" />
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  <BilingualText text={item.category} />
                                </span>
                              </div>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                <BilingualText text={item.title} />
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">
                                <BilingualText text={item.excerpt} />
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Careers Tab Content */}
                <TabsContent value="careers" className="mt-0">
                  {results.careers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">
                      <BilingualText text="EN: No career openings matched your search.\nID: Tidak ada lowongan karir yang cocok dengan pencarian Anda." />
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {results.careers.map((item) => (
                        <Link key={item.id} href={`/career/${item.slug}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <Badge variant="outline">
                                  <BilingualText text="EN: Career\nID: Karir" />
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  <BilingualText text={item.location} />
                                </span>
                              </div>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                <BilingualText text={item.title} />
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">
                                <BilingualText text={item.summary} />
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Pages Tab Content */}
                <TabsContent value="pages" className="mt-0">
                  {results.pages.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6">
                      <BilingualText text="EN: No site pages matched your search.\nID: Tidak ada halaman situs yang cocok dengan pencarian Anda." />
                    </p>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {results.pages.map((item) => (
                        <Link key={item.id} href={`/${item.key}`} className="group">
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardHeader className="p-5">
                              <Badge variant="outline" className="w-fit mb-2">
                                <BilingualText text="EN: Page\nID: Halaman" />
                              </Badge>
                              <CardTitle className="font-display text-lg group-hover:text-primary transition-colors flex items-center gap-1">
                                <BilingualText text={item.title} />
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </CardTitle>
                              <CardDescription className="line-clamp-2 mt-1 leading-relaxed">
                                <BilingualText text={`EN: Explore content on the ${item.title} page of PT Multi Daya Mitra.\nID: Jelajahi konten pada halaman ${item.title} PT Multi Daya Mitra.`} />
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
