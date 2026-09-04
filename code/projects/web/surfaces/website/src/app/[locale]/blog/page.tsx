import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, pages, type Locale } from "@/config";
import {
  isRssEnabled,
  isSearchEnabled,
  requireBlogRoute,
} from "@indiecrafts/modules-web-blog/lib/route-gate";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { localizedPathname } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";
import { DefaultBlogFrontpage } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/DefaultBlogFrontpage";
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import {
  allPostsQuery,
  authorsForLocaleQuery,
  blogSingletonQuery,
  categoriesForLocaleQuery,
  tagsForLocaleQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import type {
  Author,
  BlogSingleton,
  Category,
  PostListItem,
  Tag,
} from "@indiecrafts/modules-web-blog/sanity/types";
import { pickFrontpage } from "./frontpage-select";

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
 * Blog frontpage — renders the editor's `blog.frontpageModules` when any
 * are composed in the Studio, else the code default (hero card grid →
 * ExploreCategories chips → ExploreTags pills → TopAuthors). See
 * `pickFrontpage`.
 */
export default async function BlogPage({ params }: Props) {
  requireBlogRoute(pages.blog);
  const { locale } = await params;
  setRequestLocale(locale);

  const [blog, posts, authors, categories, tags, t, display, subnav] = await Promise.all([
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
    getCategoryNav(locale),
  ]);

  if (blog?.seo?.unpublished) notFound();

  // The blog singleton's `frontpageModules` composes /blog when the editor
  // has stacked any sections; empty falls back to the code default.
  const frontpageModules = blog?.frontpageModules ?? [];

  return (
    <DefaultLayout subnav={subnav}>
      <PageSchemas page={pages.blog} locale={locale} />
      {pickFrontpage(frontpageModules) === "modules" ? (
        <Modules modules={frontpageModules} context={{ locale }} />
      ) : (
        <DefaultBlogFrontpage
          posts={posts}
          locale={locale}
          display={display}
          categories={categories}
          tags={tags}
          authors={authors}
          t={t}
          searchAction={localizedPathname("/blog/search", locale)}
          searchEnabled={isSearchEnabled()}
        />
      )}
    </DefaultLayout>
  );
}
