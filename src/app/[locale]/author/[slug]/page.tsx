import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, localeCodes, pages, site } from "@/config";
import type { Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { requireBlogRoute } from "@/lib/feature-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { AuthorDetail } from "@/features/blog/components/AuthorDetail";
import { client } from "@/sanity/client";
import { sanityFetchLive } from "@/sanity/live";
import {
  allAuthorSlugsQuery,
  authorBySlugQuery,
  postsByAuthorSlugQuery,
} from "@/features/blog/sanity/queries";
import type { Author, PostListItem } from "@/features/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export async function generateStaticParams() {
  if (!features.blog) return [];
  const rows = await client.fetch<{ slug?: string }[]>(allAuthorSlugsQuery);
  // Author pages are locale-neutral — emit one per (locale, slug) pair.
  return rows.flatMap((row) =>
    row.slug ? localeCodes.map((locale) => ({ locale, slug: row.slug! })) : [],
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const path = localizedPathname(`/author/${slug}`, locale);
  const author = await sanityFetchLive<Author | null>({
    query: authorBySlugQuery,
    params: { slug },
  });
  const base = await buildMetadata({ page: pages.author, locale, pathname: path });
  if (!author) return base;

  return {
    ...base,
    title: author.name,
    description: author.bio ?? base.description,
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
    sanityFetchLive<Author | null>({ query: authorBySlugQuery, params: { slug } }),
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
