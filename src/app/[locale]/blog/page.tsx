import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { isRssEnabled, requireBlogRoute } from "@/features/blog/lib/route-gate";
import { localizedPathname } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { BlogHero } from "@/features/blog/components/BlogHero";
import { ExploreCategories } from "@/features/blog/components/ExploreCategories";
import { ExploreTags } from "@/features/blog/components/ExploreTags";
import { TopAuthors } from "@/features/blog/components/TopAuthors";
import { BlogListing } from "@/features/blog/components/BlogListing";
import { sanityFetchLive } from "@/sanity/live";
import {
  allPostsQuery,
  authorsForLocaleQuery,
  categoriesForLocaleQuery,
  tagsForLocaleQuery,
} from "@/features/blog/sanity/queries";
import type { Author, Category, PostListItem, Tag } from "@/features/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await buildMetadata({ page: pages.blog, locale });
  // Advertise the feed from the index — the conventional discovery point.
  // Only when the RSS feature is on, so the tag never points at a 404.
  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: {
        ...(base.alternates?.types ?? {}),
        ...(isRssEnabled()
          ? { "application/rss+xml": localizedPathname(`/blog/rss.xml`, locale) }
          : {}),
      },
    },
  };
}

/**
 * Blog frontpage — always the default layout: hero card grid →
 * ExploreCategories chips → ExploreTags pills → TopAuthors. There is no
 * editor-driven module override for this route (by design — chrome
 * stays uniform across deployments).
 */
export default async function BlogPage({ params }: Props) {
  requireBlogRoute(pages.blog);
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, authors, categories, tags, t] = await Promise.all([
    sanityFetchLive<PostListItem[]>({ query: allPostsQuery, params: { locale } }),
    sanityFetchLive<Author[]>({ query: authorsForLocaleQuery, params: { locale } }),
    sanityFetchLive<Category[]>({
      query: categoriesForLocaleQuery,
      params: { locale },
    }),
    sanityFetchLive<Tag[]>({ query: tagsForLocaleQuery, params: { locale } }),
    getTranslations("pages.blog"),
  ]);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.blog} locale={locale} />
      {posts.length === 0 ? (
        <BlogListing
          posts={posts}
          locale={locale}
          heading={t("heading")}
          subheading={t("subheading")}
          noPostsLabel={t("noPosts")}
          cols={3}
        />
      ) : (
        <>
          <h1 className="sr-only">{t("title")}</h1>
          <BlogHero posts={posts} locale={locale} label={t("heroLabel")} />

          <ExploreCategories
            categories={categories}
            posts={posts}
            locale={locale}
            heading={t("categories.heading")}
            subheading={t("categories.subheading")}
            viewAllLabel={t("categories.viewAll")}
            allHref="/blog/category"
          />

          <ExploreTags
            tags={tags}
            heading={t("tags.heading")}
            subheading={t("tags.subheading")}
            viewAllLabel={t("tags.viewAll")}
          />

          <TopAuthors
            authors={authors}
            heading={t("authors.heading")}
            subheading={t("authors.subheading")}
            viewAllLabel={t("authors.viewAll")}
          />
        </>
      )}
    </DefaultLayout>
  );
}
