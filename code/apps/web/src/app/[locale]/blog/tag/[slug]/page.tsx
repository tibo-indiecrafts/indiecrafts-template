import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, pages, type Locale } from "@indiecrafts/config";
import { localizedPathname } from "@/i18n/routing";
import { requireBlogRoute } from "@indiecrafts/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { TagDetail } from "@indiecrafts/blog/user-interface/tag/sections/TagDetail";
import { client } from "@indiecrafts/sanity/client";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import {
  allTagSlugsQuery,
  postsByTagSlugQuery,
  tagBySlugQuery,
} from "@indiecrafts/blog/sanity/queries";
import type { PostListItem, Tag } from "@indiecrafts/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog || !features.blogTaxonomy.tags) return [];
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
  const base = await buildMetadata({ page: pages.tag, locale, pathname: path });
  if (!tag) return base;

  return {
    ...base,
    title: tag.seo?.title ?? tag.title,
    description: tag.seo?.description ?? tag.description ?? base.description,
    robots: tag.seo?.noIndex ? { index: false, follow: false } : base.robots,
  };
}

export default async function TagDetailPage({ params }: Props) {
  requireBlogRoute(pages.tag);
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [tag, posts, t, nav] = await Promise.all([
    sanityFetchLive<Tag | null>({
      query: tagBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsByTagSlugQuery,
      params: { slug, locale },
    }),
    getTranslations("pages.tag"),
    getTranslations("nav"),
  ]);
  if (!tag) notFound();

  return (
    <DefaultLayout>
      <PageSchemas
        page={pages.tag}
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
      />
    </DefaultLayout>
  );
}
