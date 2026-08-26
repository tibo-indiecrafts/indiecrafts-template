import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { ExploreCategories } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/ExploreCategories";
import { ExploreTags } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/ExploreTags";
import { TopAuthors } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/TopAuthors";
import type {
  Author,
  BlogExploreModule as BlogExploreModuleType,
  Category,
  PostListItem,
  Tag,
} from "@indiecrafts/modules-web-blog/sanity/types";
import {
  allPostsQuery,
  authorsForLocaleQuery,
  categoriesForLocaleQuery,
  tagsForLocaleQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";

/**
 * Frontpage "Explore" block — a thin wrapper picking one of the code-default
 * explorers (`ExploreCategories` / `ExploreTags` / `TopAuthors`) by `m.variant`.
 * Renders nothing when the variant's taxonomy is off (code flag or editor
 * toggle, via `getBlogSettings`) — the wrapped section itself renders nothing
 * when its fetched list is empty.
 */
export async function BlogExplore({
  module: m,
  locale,
}: {
  module: BlogExploreModuleType;
  locale: Locale;
}) {
  const [t, display] = await Promise.all([
    getTranslations({ locale, namespace: "pages.blog" }),
    getBlogSettings(),
  ]);

  if (!display.taxonomy[m.variant]) return null;

  if (m.variant === "categories") {
    const [categories, posts] = await Promise.all([
      sanityFetchLive<Category[]>({
        query: categoriesForLocaleQuery,
        params: { locale },
      }),
      sanityFetchLive<PostListItem[]>({
        query: allPostsQuery,
        params: { locale },
      }),
    ]);
    return (
      <ExploreCategories
        categories={categories}
        posts={posts}
        locale={locale}
        heading={m.heading ?? t("categories.heading")}
        subheading={m.subheading ?? t("categories.subheading")}
        viewAllLabel={m.viewAll ?? t("categories.viewAll")}
        allHref="/blog/category"
      />
    );
  }

  if (m.variant === "tags") {
    const tags = await sanityFetchLive<Tag[]>({
      query: tagsForLocaleQuery,
      params: { locale },
    });
    return (
      <ExploreTags
        tags={tags}
        heading={m.heading ?? t("tags.heading")}
        subheading={m.subheading ?? t("tags.subheading")}
        viewAllLabel={m.viewAll ?? t("tags.viewAll")}
      />
    );
  }

  const authors = await sanityFetchLive<Author[]>({
    query: authorsForLocaleQuery,
    params: { locale },
  });
  return (
    <TopAuthors
      authors={authors}
      heading={m.heading ?? t("authors.heading")}
      subheading={m.subheading ?? t("authors.subheading")}
      viewAllLabel={m.viewAll ?? t("authors.viewAll")}
    />
  );
}
