import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, pages, type Locale } from "@/config";
import {
  isRssEnabled,
  isSearchEnabled,
  requireBlogRoute,
} from "@indiecrafts/blog/lib/route-gate";
import { getBlogSettings } from "@indiecrafts/blog/lib/settings";
import { BlogSearchForm } from "@indiecrafts/blog/user-interface/shared/components/BlogSearchForm";
import { localizedPathname } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { BlogHero } from "@indiecrafts/blog/user-interface/blog/sections/BlogHero";
import { ExploreCategories } from "@indiecrafts/blog/user-interface/blog/sections/ExploreCategories";
import { ExploreTags } from "@indiecrafts/blog/user-interface/blog/sections/ExploreTags";
import { TopAuthors } from "@indiecrafts/blog/user-interface/blog/sections/TopAuthors";
import { BlogListing } from "@indiecrafts/blog/user-interface/blog/sections/BlogListing";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import {
  allPostsQuery,
  authorsForLocaleQuery,
  blogSingletonQuery,
  categoriesForLocaleQuery,
  tagsForLocaleQuery,
} from "@indiecrafts/blog/sanity/queries";
import type {
  Author,
  BlogSingleton,
  Category,
  PostListItem,
  Tag,
} from "@indiecrafts/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const base = await buildMetadata({ page: pages.blog, locale });
  const blog = await sanityFetchLive<BlogSingleton | null>({
    query: blogSingletonQuery,
    params: {},
  });
  // Advertise the feed from the index — the conventional discovery point.
  // Only when the RSS feature is on, so the tag never points at a 404.
  return {
    ...base,
    robots: blog?.seo?.noIndex ? { index: false, follow: false } : base.robots,
    alternates: {
      ...base.alternates,
      types: {
        ...(base.alternates?.types ?? {}),
        ...(isRssEnabled()
          ? {
              "application/rss+xml": localizedPathname(`/blog/rss.xml`, locale),
              "application/atom+xml": localizedPathname(`/blog/atom.xml`, locale),
            }
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

  const [blog, posts, authors, categories, tags, t, display] = await Promise.all([
    sanityFetchLive<BlogSingleton | null>({ query: blogSingletonQuery, params: {} }),
    sanityFetchLive<PostListItem[]>({ query: allPostsQuery, params: { locale } }),
    features.blogTaxonomy.authors
      ? sanityFetchLive<Author[]>({ query: authorsForLocaleQuery, params: { locale } })
      : Promise.resolve<Author[]>([]),
    features.blogTaxonomy.categories
      ? sanityFetchLive<Category[]>({
          query: categoriesForLocaleQuery,
          params: { locale },
        })
      : Promise.resolve<Category[]>([]),
    features.blogTaxonomy.tags
      ? sanityFetchLive<Tag[]>({ query: tagsForLocaleQuery, params: { locale } })
      : Promise.resolve<Tag[]>([]),
    getTranslations("pages.blog"),
    getBlogSettings(),
  ]);

  if (blog?.seo?.unpublished) notFound();

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
          {/* Editor toggle: the "à la une" mosaic, else a simple titled grid.
              The mosaic's cards are h2/h3, so it needs an sr-only page h1;
              BlogListing already renders its own visible h1. */}
          {display.frontpage.featuredHero ? (
            <>
              <h1 className="sr-only">{t("title")}</h1>
              <BlogHero posts={posts} locale={locale} label={t("heroLabel")} />
            </>
          ) : (
            <BlogListing
              posts={posts}
              locale={locale}
              heading={t("heading")}
              subheading={t("subheading")}
              noPostsLabel={t("noPosts")}
              cols={3}
            />
          )}

          {isSearchEnabled() && (
            <div className="mx-auto max-w-6xl px-(--gutter) py-10">
              <BlogSearchForm
                action={localizedPathname("/blog/search", locale)}
                labels={{
                  label: t("search.label"),
                  placeholder: t("search.placeholder"),
                  submit: t("search.submit"),
                }}
              />
            </div>
          )}

          {display.taxonomy.categories && (
            <ExploreCategories
              categories={categories}
              posts={posts}
              locale={locale}
              heading={t("categories.heading")}
              subheading={t("categories.subheading")}
              viewAllLabel={t("categories.viewAll")}
              allHref="/blog/category"
            />
          )}

          {display.taxonomy.tags && (
            <ExploreTags
              tags={tags}
              heading={t("tags.heading")}
              subheading={t("tags.subheading")}
              viewAllLabel={t("tags.viewAll")}
            />
          )}

          {display.taxonomy.authors && (
            <TopAuthors
              authors={authors}
              heading={t("authors.heading")}
              subheading={t("authors.subheading")}
              viewAllLabel={t("authors.viewAll")}
            />
          )}
        </>
      )}
    </DefaultLayout>
  );
}
