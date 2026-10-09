"use client"

import { CareerOpenings } from "@/components/career-openings"
import { BilingualText } from "@/components/cms/content-language"
import { ContentList } from "@/components/cms/content-list"
import { LocalizedLink as Link } from "@/components/cms/localized-link"
import { Pagination } from "@/components/cms/pagination"
import { FilterControls, type FilterOption } from "@/components/filter-controls"
import { NewsList } from "@/components/news-list"
import type { Locale } from "@/lib/i18n"
import { container } from "@/lib/layout"
import type { CareerListingData, ContentListingData, ListingData, NewsListingData } from "@/lib/listing-data"
import type { Listing, ListingQuery } from "@/lib/listing-query"

// The filters, results and pagination of each listing page, drawn from the
// listing's data for `query` (lib/listing-data.ts): on the server for the page
// itself, in the browser when ListingView loads another query.

type BlockProps<Data> = { lang: Locale; query: ListingQuery; data: Data }

export function ListingBlock({ listing, lang, query, data }: BlockProps<ListingData> & { listing: Listing }) {
  switch (listing) {
    case "products":
      return <ProductsBlock lang={lang} query={query} data={data as ContentListingData} />
    case "services":
      return <ServicesBlock lang={lang} query={query} data={data as ContentListingData} />
    case "news":
      return <NewsBlock lang={lang} query={query} data={data as NewsListingData} />
    case "career":
      return <CareerBlock lang={lang} query={query} data={data as CareerListingData} />
  }
}

function CategoryHeading({ category, categories, inLabel, allLabel }: {
  category: string
  categories: FilterOption[]
  inLabel: string
  allLabel: string
}) {
  if (!category) return <BilingualText text={allLabel} />
  const label = categories.find((c) => c.value === category)?.label
  return (
    <>
      <BilingualText text={inLabel} /> {label ? <BilingualText text={label} /> : category}
    </>
  )
}

function ProductsBlock({ lang, query, data }: BlockProps<ContentListingData>) {
  const category = query.category || ""
  const isFiltered = Boolean(query.search || category)
  return (
    <section id="catalog" className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <span className="rounded-md bg-primary/10 px-2.5 py-1">
                <BilingualText text="EN: Interactive Catalog\nID: Katalog Interaktif" />
              </span>
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              <CategoryHeading
                category={category}
                categories={data.categories}
                inLabel="EN: Products in\nID: Produk dalam"
                allLabel="EN: Explore All Products & Solutions\nID: Jelajahi Seluruh Produk & Solusi"
              />
            </h2>
          </div>
          {isFiltered && (
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:underline self-start md:self-auto"
            >
              <BilingualText text="EN: Reset All Filters\nID: Reset Semua Filter" />
            </Link>
          )}
        </div>

        <FilterControls query={query} moduleType="products" categories={data.categories} />

        <div className="mt-8">
          <ContentList
            items={data.items}
            lang={lang}
            basePath="/products"
            empty="EN: No products matched your search or filters.\nID: Tidak ada produk yang cocok dengan pencarian atau filter Anda."
          />
        </div>

        <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} query={query} />
      </div>
    </section>
  )
}

function ServicesBlock({ lang, query, data }: BlockProps<ContentListingData>) {
  return (
    <section id="catalog" className="border-b border-border/60 bg-background">
      <div className={container("py-16")}>
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="rounded-md bg-primary/10 px-2.5 py-1">
              <BilingualText text="EN: Service Catalog\nID: Katalog Layanan" />
            </span>
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            <CategoryHeading
              category={query.category || ""}
              categories={data.categories}
              inLabel="EN: Services in\nID: Layanan dalam"
              allLabel="EN: Explore All Engineering & Maintenance Services\nID: Jelajahi Seluruh Layanan Rekayasa & Pemeliharaan"
            />
          </h2>
        </div>
        <FilterControls query={query} moduleType="services" categories={data.categories} />
        <div className="mt-8">
          <ContentList
            items={data.items}
            lang={lang}
            basePath="/services"
            empty="EN: No services matched your search or filters.\nID: Tidak ada layanan yang cocok dengan pencarian atau filter Anda."
          />
        </div>
        <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} query={query} />
      </div>
    </section>
  )
}

function NewsBlock({ query, data }: BlockProps<NewsListingData>) {
  const search = query.search || ""
  const category = query.category || ""
  const sort = query.sort || ""
  const page = query.page || "1"
  const featured = query.featured === "true" ? true : undefined
  const publishedDate = query.publishedDate || ""
  return (
    <>
      <div className={container("pt-12 bg-background animate-fade-in")}>
        <FilterControls query={query} moduleType="news" categories={data.categories} years={data.years} />
      </div>
      <NewsList
        key={`${search}-${category}-${sort}-${featured ? "1" : "0"}-${publishedDate}-${page}`}
        initialNews={data.news}
        searchParams={{ search, category, sort, featured, publishedDate }}
      />
    </>
  )
}

function CareerBlock({ query, data }: BlockProps<CareerListingData>) {
  return (
    <>
      <div className={container("pt-12 bg-secondary/40")}>
        <FilterControls
          query={query}
          moduleType="careers"
          departments={data.departments}
          locations={data.locations}
          employmentTypes={data.employmentTypes}
        />
      </div>
      <CareerOpenings jobs={data.jobs} />
      <div className={container("pb-20 bg-secondary/40")}>
        <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} query={query} />
      </div>
    </>
  )
}
