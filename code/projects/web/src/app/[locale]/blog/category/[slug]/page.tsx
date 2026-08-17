import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, site, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import {
  isTaxonomyRouteEnabled,
  requireTaxonomyRoute,
} from "@indiecrafts/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { CategoryDetail } from "@indiecrafts/blog/user-interface/category/sections/CategoryDetail";
import { client } from "@indiecrafts/sanity/client";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import {
  allCategorySlugsQuery,
  categoryBySlugQuery,
  postsByCategoryCountQuery,
  postsByCategorySlugQuery,
} from "@indiecrafts/blog/sanity/queries";
import type { Category, PostListItem } from "@indiecrafts/blog/sanity/types";
import { pageCount, pageRange, parsePage } from "@indiecrafts/blog/lib/pagination";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  if (!(await isTaxonomyRouteEnabled("categories", pages.category))) return [];
  const rows =
    await client.fetch<{ slug?: string; language?: string }[]>(allCategorySlugsQuery);
  // Categories have `language` (required + initialValue "en" in the
  // schema). Emit one route per (locale, slug); rely on the GROQ
  // `categoryBySlugQuery` to 404 mismatched locale/slug combos rather
  // than fanning out to every locale here.
  return rows.flatMap((row) =>
    row.slug && row.language ? [{ locale: row.language, slug: row.slug }] : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const path = localizedPathname(`/blog/category/${slug}`, locale);
  const category = await sanityFetchLive<Category | null>({
    query: categoryBySlugQuery,
    params: { slug, locale },
  });
  const base = await buildMetadata({ page: pages.category, locale, pathname: path });
  if (!category) return base;

  return {
    ...base,
    title: category.seo?.title ?? category.title,
    description: category.seo?.description ?? category.description ?? base.description,
    robots: category.seo?.noIndex ? { index: false, follow: false } : base.robots,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  await requireTaxonomyRoute("categories", pages.category);
  const { locale, slug } = await params;
  const page = parsePage((await searchParams).page);
  const { start, end } = pageRange(page);
  setRequestLocale(locale);

  const [category, posts, total, t, catT, nav, pagerT] = await Promise.all([
    sanityFetchLive<Category | null>({
      query: categoryBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsByCategorySlugQuery,
      params: { slug, locale, start, end },
    }),
    sanityFetchLive<number>({
      query: postsByCategoryCountQuery,
      params: { slug, locale },
    }),
    getTranslations("pages.blog.category"),
    getTranslations("pages.category"),
    getTranslations("nav"),
    getTranslations("pages.blog.pagination"),
  ]);
  if (!category) notFound();

  const breadcrumbItems = [
    { name: nav("blog"), url: `${site.url}${localizedPathname("/blog", locale)}` },
    {
      name: catT("title"),
      url: `${site.url}${localizedPathname("/blog/category", locale)}`,
    },
    {
      name: category.title ?? slug,
      url: `${site.url}${localizedPathname(`/blog/category/${slug}`, locale)}`,
    },
  ];

  return (
    <DefaultLayout>
      <PageSchemas
        page={{
          ...pages.category,
          seo: { structuredData: [buildBreadcrumbSchema(breadcrumbItems)] },
        }}
        locale={locale}
        pathname={localizedPathname(`/blog/category/${slug}`, locale)}
      />
      <CategoryDetail
        category={category}
        posts={posts}
        locale={locale}
        breadcrumbs={[
          { label: nav("blog"), href: "/blog" },
          { label: catT("title"), href: "/blog/category" },
          { label: category.title ?? slug },
        ]}
        breadcrumbsLabel={catT("breadcrumbs")}
        postsLabel={catT.raw("posts")}
        noPostsLabel={t("noPosts")}
        page={page}
        pageCount={pageCount(total)}
        basePath={`/blog/category/${slug}`}
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
