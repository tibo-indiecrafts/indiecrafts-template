import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, pages, site } from "@indiecrafts/config";
import type { Locale } from "@indiecrafts/config";
import { localizedPathname } from "@/i18n/routing";
import { requireBlogRoute } from "@indiecrafts/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AuthorDetail } from "@indiecrafts/blog/user-interface/author/sections/AuthorDetail";
import { client } from "@indiecrafts/sanity/client";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import {
  allAuthorSlugsQuery,
  authorBySlugQuery,
  postsByAuthorSlugQuery,
} from "@indiecrafts/blog/sanity/queries";
import type { Author, PostListItem } from "@indiecrafts/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog || !features.blogTaxonomy.authors) return [];
  const rows =
    await client.fetch<{ slug?: string; language?: string }[]>(allAuthorSlugsQuery);
  // Authors are translated — each doc belongs to one locale, so emit the
  // (locale, slug) pair for its own language only.
  return rows.flatMap((row) =>
    row.slug && row.language ? [{ locale: row.language, slug: row.slug }] : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const path = localizedPathname(`/author/${slug}`, locale);
  const author = await sanityFetchLive<Author | null>({
    query: authorBySlugQuery,
    params: { slug, locale },
  });
  const base = await buildMetadata({ page: pages.author, locale, pathname: path });
  if (!author) return base;

  return {
    ...base,
    title: author.seo?.title ?? author.name,
    description: author.seo?.description ?? author.bio ?? base.description,
    robots: author.seo?.noIndex ? { index: false, follow: false } : base.robots,
    openGraph: {
      ...base.openGraph,
      type: "profile",
      title: author.name,
      description: author.bio,
      images: author.image?.asset?.url
        ? [{ url: author.image.asset.url }]
        : base.openGraph?.images,
    },
  };
}

export default async function AuthorDetailPage({ params }: Props) {
  requireBlogRoute(pages.author);
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [author, posts, t, nav] = await Promise.all([
    sanityFetchLive<Author | null>({
      query: authorBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsByAuthorSlugQuery,
      params: { slug, locale },
    }),
    getTranslations("pages.author"),
    getTranslations("nav"),
  ]);
  if (!author) notFound();

  const path = localizedPathname(`/author/${slug}`, locale);

  return (
    <DefaultLayout>
      <PageSchemas
        page={{
          ...pages.author,
          seo: {
            structuredData: [
              {
                "@type": "Person",
                name: author.name,
                description: author.bio,
                image: author.image?.asset?.url,
                jobTitle: author.position,
                url: `${site.url}${path}`,
              },
            ],
          },
        }}
        locale={locale}
        pathname={path}
      />
      <AuthorDetail
        author={author}
        posts={posts}
        locale={locale}
        breadcrumbs={[
          { label: nav("blog"), href: "/blog" },
          { label: nav("author"), href: "/author" },
          { label: author.name ?? slug },
        ]}
        breadcrumbsLabel={t("breadcrumbs")}
        postsLabel={t.raw("posts")}
        noPostsLabel={t("noPosts")}
      />
    </DefaultLayout>
  );
}
