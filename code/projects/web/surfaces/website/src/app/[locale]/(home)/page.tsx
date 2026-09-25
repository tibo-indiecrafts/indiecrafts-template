/**
 * Render the production home page from editor-composed blocks and template showcases.
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
import { IconShowcase } from "@/user-interface/homepage/sections/IconShowcase";
import { MorphiconsShowcase } from "@/user-interface/homepage/sections/MorphiconsShowcase";
import { BlocksShowcase } from "@/user-interface/homepage/sections/BlocksShowcase";
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
 * The dynamic `FeaturedArticles` (live blog posts) and the template's icon /
 * motion / blocks showcases stay in code — they demo template capabilities and
 * a real client removes them.
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

  // The editor-composed page body — an ordered list of page-builder blocks.
  const { pageModules } = await getHomePage(locale);

  // Featured articles — only when the blog feature is on. `sanityFetchLive` so
  // the home page live-updates via `<SanityLive>` when a post changes (opts the
  // page into dynamic rendering — the deliberate trade for freshness).
  // `tf` is resolved unconditionally so the hooks-free render stays simple.
  const tf = await getTranslations("pages.home.blocks.featured");
  const featured: PostListItem[] = features.blog
    ? (
        await sanityFetchLive<PostListItem[]>({
          query: featuredPostsQuery,
          params: { locale },
        })
      ).slice(0, 4)
    : [];

  return (
    <DefaultLayout>
      <PageSchemas page={pages.home} locale={locale} />

      {pageModules.map((block) => (
        <div key={block._key}>{renderBlock(block, portableComponents)}</div>
      ))}

      {/* Template showcases — code, not CMS (their content is code). */}
      <IconShowcase id="home-icons" namespace="pages.home.blocks.icons" />
      <MorphiconsShowcase id="home-morphicons" namespace="pages.home.blocks.morphicons" />
      <BlocksShowcase id="home-blocks" namespace="pages.home.blocks.blocks" />

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
