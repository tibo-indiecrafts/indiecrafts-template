import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, site, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { isSeriesEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { translationAlternates } from "@/lib/seo/translations";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { SeriesDetail } from "@indiecrafts/modules-web-blog/user-interface/series/sections/SeriesDetail";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import {
  allSeriesSlugsQuery,
  postsBySeriesCountQuery,
  postsBySeriesSlugQuery,
  seriesBySlugQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import type { PostListItem, Series } from "@indiecrafts/modules-web-blog/sanity/types";
import {
  pageCount,
  pageRange,
  parsePage,
} from "@indiecrafts/modules-web-blog/lib/pagination";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  if (!isSeriesEnabled()) return [];
  const rows =
    await client.fetch<{ slug?: string; language?: string }[]>(allSeriesSlugsQuery);
  return rows.flatMap((row) =>
    row.slug && row.language ? [{ locale: row.language, slug: row.slug }] : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const path = localizedPathname(`/blog/series/${slug}`, locale);
  const series = await sanityFetchLive<Series | null>({
    query: seriesBySlugQuery,
    params: { slug, locale },
  });
  const translations = await translationAlternates("series", slug, locale);
  const base = await buildMetadata({
    page: pages.blog,
    locale,
    pathname: path,
    translations,
  });
  if (!series) return base;
  return {
    ...base,
    title: series.seo?.title ?? series.title,
    description: series.seo?.description ?? series.description ?? base.description,
    robots: series.seo?.noIndex ? { index: false, follow: false } : base.robots,
  };
}

export default async function SeriesDetailPage({ params, searchParams }: Props) {
  if (!isSeriesEnabled()) notFound();
  const { locale, slug } = await params;
  const page = parsePage((await searchParams).page);
  const { start, end } = pageRange(page);
  setRequestLocale(locale);

  const [series, posts, total, t, nav, pagerT] = await Promise.all([
    sanityFetchLive<Series | null>({
      query: seriesBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsBySeriesSlugQuery,
      params: { slug, locale, start, end },
    }),
    sanityFetchLive<number>({ query: postsBySeriesCountQuery, params: { slug, locale } }),
    getTranslations("pages.blog.series"),
    getTranslations("nav"),
    getTranslations("pages.blog.pagination"),
  ]);
  if (!series) notFound();

  const path = localizedPathname(`/blog/series/${slug}`, locale);
  const breadcrumbItems = [
    { name: nav("blog"), url: `${site.url}${localizedPathname("/blog", locale)}` },
    { name: series.title ?? slug, url: `${site.url}${path}` },
  ];

  return (
    <DefaultLayout>
      <PageSchemas
        page={{
          ...pages.blog,
          seo: { structuredData: [buildBreadcrumbSchema(breadcrumbItems)] },
        }}
        locale={locale}
        pathname={path}
      />
      <SeriesDetail
        series={series}
        posts={posts}
        total={total}
        locale={locale}
        breadcrumbs={[
          { label: nav("blog"), href: "/blog" },
          { label: series.title ?? slug },
        ]}
        breadcrumbsLabel={t("breadcrumb")}
        partsLabel={t.raw("parts")}
        noPostsLabel={t("noPosts")}
        page={page}
        pageCount={pageCount(total)}
        basePath={`/blog/series/${slug}`}
        pagerLabels={{
          label: pagerT("label"),
          previous: pagerT("previous"),
          next: pagerT("next"),
          status: pagerT("status"),
        }}
      />
    </DefaultLayout>
  );
}
