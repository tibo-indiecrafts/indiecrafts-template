import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { TagDetail } from "@/components/blog-components/TagDetail";
import { client } from "@/sanity/client";
import { sanityFetchLive } from "@/sanity/live";
import { allTagSlugsQuery, postsByTagSlugQuery, tagBySlugQuery } from "@/sanity/queries";
import type { PostListItem, Tag } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog) return [];
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
  const tag = await sanityFetchLive<Tag | null>({
    query: tagBySlugQuery,
    params: { slug, locale },
  });
  const base = await buildMetadata({ page: pages.tag, locale });
  if (!tag) return base;

  return {
    ...base,
    title: tag.title,
    description: tag.description ?? base.description,
  };
}

export default async function TagDetailPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.tag)) notFound();
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
      <PageSchemas page={pages.tag} locale={locale} />
      <TagDetail
        tag={tag}
        posts={posts}
        locale={locale}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
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
