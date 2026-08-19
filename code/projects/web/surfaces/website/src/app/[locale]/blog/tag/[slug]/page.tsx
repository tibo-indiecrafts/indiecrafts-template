import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, site, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import {
  isTaxonomyRouteEnabled,
  requireTaxonomyRoute,
} from "@indiecrafts/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { translationAlternates } from "@/lib/seo/translations";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { TagDetail } from "@indiecrafts/blog/user-interface/tag/sections/TagDetail";
import { client } from "@indiecrafts/sanity/client";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import {
  allTagSlugsQuery,
  postsByTagCountQuery,
  postsByTagSlugQuery,
  tagBySlugQuery,
} from "@indiecrafts/blog/sanity/queries";
import type { PostListItem, Tag } from "@indiecrafts/blog/sanity/types";
import { pageCount, pageRange, parsePage } from "@indiecrafts/blog/lib/pagination";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  if (!(await isTaxonomyRouteEnabled("tags", pages.tag))) return [];
  const rows =
    await client.fetch<{ slug?: string; language?: string }[]>(allTagSlugsQuery);
  // Tags have `language` (required + initialValue "en"). Emit one route
  // per (locale, slug); the GROQ filter 404s mismatched combos.
  return rows.flatMap((row) =>
    row.slug && row.language ? [{ locale: row.language, slug: row.slug }] : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const path = localizedPathname(`/blog/tag/${slug}`, locale);
  const tag = await sanityFetchLive<Tag | null>({
    query: tagBySlugQuery,
    params: { slug, locale },
  });
  const translations = await translationAlternates("tag", slug, locale);
  const base = await buildMetadata({
    page: pages.tag,
    locale,
    pathname: path,
    translations,
  });
  if (!tag) return base;

  return {
    ...base,
    title: tag.seo?.title ?? tag.title,
    description: tag.seo?.description ?? tag.description ?? base.description,
    robots: tag.seo?.noIndex ? { index: false, follow: false } : base.robots,
  };
}

export default async function TagDetailPage({ params, searchParams }: Props) {
  await requireTaxonomyRoute("tags", pages.tag);
  const { locale, slug } = await params;
  const page = parsePage((await searchParams).page);
  const { start, end } = pageRange(page);
  setRequestLocale(locale);

  const [tag, posts, total, t, nav, pagerT] = await Promise.all([
    sanityFetchLive<Tag | null>({
      query: tagBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsByTagSlugQuery,
      params: { slug, locale, start, end },
    }),
    sanityFetchLive<number>({ query: postsByTagCountQuery, params: { slug, locale } }),
    getTranslations("pages.tag"),
    getTranslations("nav"),
    getTranslations("pages.blog.pagination"),
  ]);
  if (!tag) notFound();

  const breadcrumbItems = [
    { name: nav("blog"), url: `${site.url}${localizedPathname("/blog", locale)}` },
    { name: t("title"), url: `${site.url}${localizedPathname("/blog/tag", locale)}` },
    {
      name: tag.title ?? slug,
      url: `${site.url}${localizedPathname(`/blog/tag/${slug}`, locale)}`,
    },
  ];

  return (
    <DefaultLayout>
      <PageSchemas
        page={{
          ...pages.tag,
          seo: { structuredData: [buildBreadcrumbSchema(breadcrumbItems)] },
        }}
        locale={locale}
        pathname={localizedPathname(`/blog/tag/${slug}`, locale)}
      />
      <TagDetail
        tag={tag}
        posts={posts}
        locale={locale}
        breadcrumbs={[
          { label: nav("blog"), href: "/blog" },
          { label: t("title"), href: "/blog/tag" },
          { label: tag.title ?? slug },
        ]}
        breadcrumbsLabel={t("breadcrumbs")}
        postsLabel={t.raw("posts")}
        noPostsLabel={t("noPosts")}
        page={page}
        pageCount={pageCount(total)}
        basePath={`/blog/tag/${slug}`}
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
