/**
 * Render a single blog post with its layout, related posts and comments.
 *
 * @see docs/reference/projects/web/website/src/app/locale/blog/slug/page.md
 */
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, pages, site, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import {
  isRssEnabled,
  requireBlogRoute,
} from "@indiecrafts/modules-web-blog/lib/route-gate";
import { getBlogSettings } from "@indiecrafts/modules-web-blog/lib/settings";
import { buildMetadata } from "@/lib/metadata";
import { redirectToTranslation, translationAlternates } from "@/lib/seo/translations";
import { articleOpenGraph } from "@/lib/seo/article-og";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { getSiteSettings } from "@/lib/seo/site-seo";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";
import { DefaultPostLayout } from "@indiecrafts/modules-web-blog/user-interface/post/layout/DefaultPostLayout";
import { Modules } from "@indiecrafts/modules-web-blog/user-interface/renderers/ModuleRenderer";
import { postSidebar } from "@indiecrafts/modules-web-blog/user-interface/post/layout/post-sidebar";
import { getSidebarSettings, pageSidebar } from "@/lib/sidebar";
import { Comments } from "@indiecrafts/modules-web-blog/user-interface/post/sections/Comments";
import { PostViewBeacon } from "@indiecrafts/modules-web-blog/user-interface/post/components/PostViewBeacon";
import { isCommentsEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import {
  allPostSlugsQuery,
  blogSingletonQuery,
  postBySlugQuery,
  relatedPostsQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import type {
  BlogRelatedModule,
  BlogSingleton,
  Post,
  PostListItem,
  PostSlug,
} from "@indiecrafts/modules-web-blog/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog) return [];
  // `sanityFetchLive` reads `draftMode()` which isn't allowed inside
  // `generateStaticParams` (build time, no request). Use the unauthed
  // client directly — `noIndex` filtering happens in the query anyway.
  const slugs = await client.fetch<PostSlug[]>(allPostSlugsQuery);
  // Each post belongs to one locale (post.language); pair its slug with
  // that locale only so the FR post doesn't statically render at /en
  // and vice versa.
  return slugs.flatMap((row) =>
    row.slug && row.language ? [{ locale: row.language, slug: row.slug }] : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const path = localizedPathname(`/blog/${slug}`, locale);
  const [post, translations] = await Promise.all([
    sanityFetchLive<Post | null>({
      query: postBySlugQuery,
      params: { slug, locale },
    }),
    translationAlternates("post", slug, locale),
  ]);
  const base = await buildMetadata({
    page: pages.blog,
    locale,
    pathname: path,
    translations,
  });
  if (!post) return base;

  const title = post.metadata?.title ?? post.title;
  const description = post.metadata?.description;
  const ogImage = post.metadata?.image?.asset?.url;

  return {
    ...base,
    title,
    description,
    robots: post.metadata?.noIndex ? { index: false, follow: false } : base.robots,
    openGraph: {
      ...base.openGraph,
      // A post is an article, not a website — `articleOpenGraph` sets `type:
      // "article"` + the article:* tags from the post's own fields. The JSON-LD
      // already emits an `Article`, so OG and structured data agree.
      ...articleOpenGraph(post),
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images,
    },
    alternates: {
      ...base.alternates,
      types: {
        ...(base.alternates?.types ?? {}),
        "text/markdown": localizedPathname(`/blog/${slug}/md`, locale),
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

export default async function BlogPostPage({ params }: Props) {
  requireBlogRoute(pages.blog);
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, blog, display, nav, settings, subnav, sidebarSettings] = await Promise.all(
    [
      sanityFetchLive<Post | null>({ query: postBySlugQuery, params: { slug, locale } }),
      sanityFetchLive<BlogSingleton | null>({
        query: blogSingletonQuery,
        params: { locale },
      }),
      getBlogSettings(),
      getTranslations("nav"),
      getSiteSettings(),
      getCategoryNav(locale),
      getSidebarSettings(locale, "post"),
    ],
  );
  if (!post) return redirectToTranslation("post", slug, locale as Locale);

  const title = post.metadata?.title ?? post.title ?? "";
  // Display teaser — prefer the editorial excerpt, fall back to the SEO description.
  const description = post.excerpt ?? post.metadata?.description;
  const image = post.metadata?.image?.asset?.url;
  // The blog singleton's `postModules` composes every article's chrome
  // (breadcrumbs / body slot / related). Empty array → DefaultPostLayout.
  const modules = blog?.postModules ?? [];

  // The sidebar cards: the post's own choice, else Site web → Barre latérale (« Articles »).
  const cards = pageSidebar("post", sidebarSettings, post.sidebar);
  const relatedCard = cards.find(
    (m): m is BlogRelatedModule => m._type === "module.blog-related",
  );

  // Related posts, fetched once: the default layout's "Keep reading" grid (3) and the
  // sidebar's related card (its own limit). Filter null entries before mapping — GROQ
  // returns null for refs the client can't resolve (deleted / private categories).
  const relatedLimit = Math.max(
    modules.length === 0 ? 3 : 0,
    relatedCard ? (relatedCard.limit ?? 4) : 0,
  );
  const categoryIds = (post.categories ?? []).flatMap((c) => (c?._id ? [c._id] : []));
  const related = relatedLimit
    ? await sanityFetchLive<PostListItem[]>({
        query: relatedPostsQuery,
        params: { locale, id: post._id, categoryIds, limit: relatedLimit },
      })
    : [];
  const sidebar = postSidebar(cards, post, locale, related);

  const path = localizedPathname(`/blog/${slug}`, locale);
  // Evaluate once (not inline in JSX): a bare `new Date()` reached from the
  // render tree yields a different value per evaluation. Falls back to now
  // only for a post with no publish date.
  const datePublished = post.publishedAt ?? new Date().toISOString();

  // Breadcrumb trail for JSON-LD: Blog → (category) → post. The category
  // crumb is included only when categories are enabled, so the schema never
  // links to a 404'd taxonomy route.
  const categoryCrumb = post.categories?.[0];
  const breadcrumbItems = [
    { name: nav("blog"), url: `${site.url}${localizedPathname("/blog", locale)}` },
    ...(display.taxonomy.categories && categoryCrumb?.slug
      ? [
          {
            name: categoryCrumb.title ?? "",
            url: `${site.url}${localizedPathname(`/blog/category/${categoryCrumb.slug}`, locale)}`,
          },
        ]
      : []),
    { name: title, url: `${site.url}${path}` },
  ];

  return (
    <DefaultLayout subnav={subnav}>
      <PageSchemas
        page={{
          ...pages.blog,
          seo: {
            structuredData: [
              buildArticleSchema({
                headline: title,
                description,
                datePublished,
                dateModified: post.updatedAt,
                authorNames: post.authors?.map((a) => a.name).filter(Boolean) as string[],
                image,
                url: `${site.url}${path}`,
              }),
              buildBreadcrumbSchema(breadcrumbItems),
            ],
          },
        }}
        locale={locale}
        pathname={path}
      />
      {modules.length > 0 ? (
        <Modules modules={modules} context={{ locale, post, postSidebar: sidebar }} />
      ) : (
        <DefaultPostLayout
          post={post}
          locale={locale}
          image={image}
          title={title}
          description={description}
          related={related.slice(0, 3)}
          aside={sidebar.aside}
          mobileToc={sidebar.mobileToc}
          share={settings.share}
        />
      )}
      {/* One anonymous view for the Trending block (no cookie, nothing stored). */}
      <PostViewBeacon postId={post._id} locale={locale} />
      {/* Streamed: the article flushes first, the thread (its own read) follows. */}
      {isCommentsEnabled() ? (
        <Suspense fallback={null}>
          <Comments postId={post._id} locale={locale} copy={blog?.comments} />
        </Suspense>
      ) : null}
    </DefaultLayout>
  );
}
