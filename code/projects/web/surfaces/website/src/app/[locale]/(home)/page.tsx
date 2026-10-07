/**
 * Render the production home page from editor-composed blocks and featured posts.
 *
 * @see docs/reference/projects/web/website/src/app/locale/(home)/page.md
 */
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { features, isPageVisible, pages } from "@/config";
import type { Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { getHomePage } from "@/lib/home";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { FeaturedArticles } from "@/user-interface/homepage/sections/FeaturedArticles";
import { renderBlock } from "@indiecrafts/packages-web-ui-components/web/registry";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { featuredPostsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Production home page. The editorial sections are an editor-composed
 * page-builder: the home `page` (the `page` with `isHome` on, read by
 * `getHomePage`), painted by the shared `renderBlock` registry — the same
 * blocks every page uses. One page model everywhere. Add / reorder / hide
 * sections from Studio → Accueil, no code change.
 *
 * The dynamic `FeaturedArticles` (live blog posts) stays in code: it follows the
 * blog, not the page builder.
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.home, locale });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.home)) notFound();
  setRequestLocale(locale);

  // One round trip: the editor-composed body (ordered page-builder blocks), the
  // featured posts (only with the blog on; `sanityFetchLive` so `<SanityLive>`
  // refreshes the strip when a post changes) and their labels.
  const [{ pageModules }, featuredPosts, tf] = await Promise.all([
    getHomePage(locale),
    features.blog
      ? sanityFetchLive<PostListItem[]>({ query: featuredPostsQuery, params: { locale } })
      : [],
    getTranslations("pages.home.blocks.featured"),
  ]);
  const featured = featuredPosts.slice(0, 4);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.home} locale={locale} />

      {pageModules.map((block) => (
        <div key={block._key}>{renderBlock(block, portableComponents)}</div>
      ))}

      {featured.length > 0 ? (
        <FeaturedArticles
          id="home-featured"
          posts={featured}
          locale={locale}
          eyebrow={tf("eyebrow")}
          title={tf("title")}
          body={tf("body")}
          viewAllLabel={tf("viewAll")}
        />
      ) : null}
    </DefaultLayout>
  );
}
