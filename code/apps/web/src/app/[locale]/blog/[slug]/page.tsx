import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, pages, site, type Locale } from "@indiecrafts/config";
import { localizedPathname } from "@/i18n/routing";
import { isRssEnabled, requireBlogRoute } from "@indiecrafts/blog/lib/route-gate";
import { getBlogSettings } from "@indiecrafts/blog/lib/settings";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { DefaultPostLayout } from "@indiecrafts/blog/user-interface/post/layout/DefaultPostLayout";
import { Modules } from "@indiecrafts/blog/user-interface/renderers/ModuleRenderer";
import { Comments } from "@indiecrafts/blog/user-interface/post/sections/Comments";
import { isCommentsEnabled } from "@indiecrafts/blog/lib/route-gate";
import { client } from "@indiecrafts/sanity/client";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import {
  allPostSlugsQuery,
  blogSingletonQuery,
  postBySlugQuery,
  relatedPostsQuery,
} from "@indiecrafts/blog/sanity/queries";
import type {
  BlogSingleton,
  Post,
  PostListItem,
  PostSlug,
} from "@indiecrafts/blog/sanity/types";

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
  const [post, base] = await Promise.all([
    sanityFetchLive<Post | null>({
      query: postBySlugQuery,
      params: { slug, locale },
    }),
    buildMetadata({ page: pages.blog, locale, pathname: path }),
  ]);
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

  const [post, blog, display, nav] = await Promise.all([
    sanityFetchLive<Post | null>({ query: postBySlugQuery, params: { slug, locale } }),
    sanityFetchLive<BlogSingleton | null>({
      query: blogSingletonQuery,
      params: { locale },
    }),
    getBlogSettings(),
    getTranslations("nav"),
  ]);
  if (!post) notFound();

  const title = post.metadata?.title ?? post.title ?? "";
  // Display teaser — prefer the editorial excerpt, fall back to the SEO description.
  const description = post.excerpt ?? post.metadata?.description;
  const image = post.metadata?.image?.asset?.url;
  // The blog singleton's `postModules` composes every article's chrome
  // (breadcrumbs / body slot / related). Empty array → DefaultPostLayout.
  const modules = blog?.postModules ?? [];

  // Related posts — only fetched for the default layout. Module-driven
  // layouts can drop their own `module.blog-post-list` instead.
  // Filter null entries before mapping — GROQ returns null for refs the
  // client can't resolve (deleted / private categories).
  const categoryIds =
    modules.length === 0
      ? (post.categories ?? []).flatMap((c) => (c?._id ? [c._id] : []))
      : [];
  const related =
    modules.length === 0
      ? await sanityFetchLive<PostListItem[]>({
          query: relatedPostsQuery,
          params: { locale, id: post._id, categoryIds },
        })
      : [];

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
    <DefaultLayout>
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
        <Modules modules={modules} context={{ locale, post }} />
      ) : (
        <DefaultPostLayout
          post={post}
          locale={locale}
          image={image}
          title={title}
          description={description}
          related={related}
        />
      )}
      {isCommentsEnabled() ? (
        <Comments postId={post._id} locale={locale} copy={blog?.comments} />
      ) : null}
    </DefaultLayout>
  );
}
