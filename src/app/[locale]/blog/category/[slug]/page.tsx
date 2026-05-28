import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { CategoryDetail } from "@/components/blog-components/CategoryDetail";
import { client } from "@/sanity/client";
import { sanityFetchLive } from "@/sanity/live";
import {
  allCategorySlugsQuery,
  categoryBySlugQuery,
  postsByCategorySlugQuery,
} from "@/sanity/queries";
import type { Category, PostListItem } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog) return [];
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
  const category = await sanityFetchLive<Category | null>({
    query: categoryBySlugQuery,
    params: { slug, locale },
  });
  const base = await buildMetadata({ page: pages.category, locale });
  if (!category) return base;

  return {
    ...base,
    title: category.title,
    description: category.description ?? base.description,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.category)) notFound();
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [category, posts, t, catT, nav] = await Promise.all([
    sanityFetchLive<Category | null>({
      query: categoryBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsByCategorySlugQuery,
      params: { slug, locale },
    }),
    getTranslations("pages.blog.category"),
    getTranslations("pages.category"),
    getTranslations("nav"),
  ]);
  if (!category) notFound();

  return (
    <DefaultLayout>
      <PageSchemas page={pages.category} locale={locale} />
      <CategoryDetail
        category={category}
        posts={posts}
        locale={locale}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("blog"), href: "/blog" },
          { label: catT("title"), href: "/blog/category" },
          { label: category.title ?? slug },
        ]}
        breadcrumbsLabel={catT("breadcrumbs")}
        postsLabel={catT.raw("posts")}
        noPostsLabel={t("noPosts")}
      />
    </DefaultLayout>
  );
}
