import type { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/packages-shared-config";
import { BlogSearchForm } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogSearchForm";
import { BlogHero } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/BlogHero";
import { ExploreCategories } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/ExploreCategories";
import { ExploreTags } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/ExploreTags";
import { TopAuthors } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/TopAuthors";
import { BlogListing } from "@indiecrafts/modules-web-blog/user-interface/blog/sections/BlogListing";
import type {
  Author,
  BlogDisplay,
  Category,
  PostListItem,
  Tag,
} from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * The code-default `/blog` frontpage — hero card grid → search → explore
 * categories/tags → top authors. Renders when the editor hasn't composed
 * `blog.frontpageModules` (see `pickFrontpage`). Extracted verbatim from the
 * route so behavior is unchanged; the route now just picks between this and
 * the editor's modules.
 */
export function DefaultBlogFrontpage({
  posts,
  locale,
  display,
  categories,
  tags,
  authors,
  t,
  searchAction,
  searchEnabled,
}: {
  posts: PostListItem[];
  locale: Locale;
  display: BlogDisplay;
  categories: Category[];
  tags: Tag[];
  authors: Author[];
  t: Awaited<ReturnType<typeof getTranslations>>;
  searchAction: string;
  searchEnabled: boolean;
}) {
  return posts.length === 0 ? (
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

      {searchEnabled && (
        <div className="mx-auto max-w-6xl px-(--gutter) py-10">
          <BlogSearchForm
            action={searchAction}
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
  );
}
