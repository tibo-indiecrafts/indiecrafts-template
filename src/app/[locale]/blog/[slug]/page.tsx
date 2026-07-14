import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { features, pages, site, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { isRssEnabled, requireBlogRoute } from "@/lib/feature-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildArticleSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { DefaultPostLayout } from "@/components/blog-components/DefaultPostLayout";
import { Modules } from "@/components/blog-components/modules/ModuleRenderer";
import { client } from "@/sanity/client";
import { sanityFetchLive } from "@/sanity/live";
import {
  allPostSlugsQuery,
  blogSingletonQuery,
  postBySlugQuery,
  relatedPostsQuery,
} from "@/sanity/queries";
import type { BlogSingleton, Post, PostListItem, PostSlug } from "@/sanity/types";

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
  const post = await sanityFetchLive<Post | null>({
    query: postBySlugQuery,
    params: { slug, locale },
  });
  const base = await buildMetadata({ page: pages.blog, locale, pathname: path });
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
          ? { "application/rss+xml": localizedPathname(`/blog/rss.xml`, locale) }
          : {}),
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  requireBlogRoute(pages.blog);
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, blog] = await Promise.all([
    sanityFetchLive<Post | null>({ query: postBySlugQuery, params: { slug, locale } }),
    sanityFetchLive<BlogSingleton | null>({
      query: blogSingletonQuery,
      params: { locale },
    }),
  ]);
  if (!post) notFound();

  const title = post.metadata?.title ?? post.title ?? "";
  const description = post.metadata?.description;
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
      ? (post.categories ?? [])
          .filter((c): c is NonNullable<typeof c> => c != null)
          .map((c) => c._id)
          .filter(Boolean)
      : [];
  const related =
    modules.length === 0
      ? await sanityFetchLive<PostListItem[]>({
          query: relatedPostsQuery,
          params: { locale, id: post._id, categoryIds },
        })
      : [];

  const path = localizedPathname(`/blog/${slug}`, locale);

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
                datePublished: post.publishedAt ?? new Date().toISOString(),
                authorName: post.author?.name,
                image,
                url: `${site.url}${path}`,
              }),
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
    </DefaultLayout>
  );
}
