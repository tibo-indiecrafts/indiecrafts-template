import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, site } from "@/config";
import type { Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import {
  isTaxonomyRouteEnabled,
  requireTaxonomyRoute,
} from "@indiecrafts/modules-web-blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { translationAlternates } from "@/lib/seo/translations";
import { PageSchemas } from "@/lib/seo/jsonld";
import { buildBreadcrumbSchema } from "@/lib/seo/jsonld-factories";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AuthorDetail } from "@indiecrafts/modules-web-blog/user-interface/author/sections/AuthorDetail";
import { client } from "@indiecrafts/packages-web-sanity/client";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import {
  allAuthorSlugsQuery,
  authorBySlugQuery,
  postsByAuthorCountQuery,
  postsByAuthorSlugQuery,
} from "@indiecrafts/modules-web-blog/sanity/queries";
import type { Author, PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";
import {
  pageCount,
  pageRange,
  parsePage,
} from "@indiecrafts/modules-web-blog/lib/pagination";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  if (!(await isTaxonomyRouteEnabled("authors", pages.author))) return [];
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
  const translations = await translationAlternates("author", slug, locale);
  const base = await buildMetadata({
    page: pages.author,
    locale,
    pathname: path,
    translations,
  });
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

export default async function AuthorDetailPage({ params, searchParams }: Props) {
  await requireTaxonomyRoute("authors", pages.author);
  const { locale, slug } = await params;
  const page = parsePage((await searchParams).page);
  const { start, end } = pageRange(page);
  setRequestLocale(locale);

  const [author, posts, total, t, nav, pagerT] = await Promise.all([
    sanityFetchLive<Author | null>({
      query: authorBySlugQuery,
      params: { slug, locale },
    }),
    sanityFetchLive<PostListItem[]>({
      query: postsByAuthorSlugQuery,
      params: { slug, locale, start, end },
    }),
    sanityFetchLive<number>({ query: postsByAuthorCountQuery, params: { slug, locale } }),
    getTranslations("pages.author"),
    getTranslations("nav"),
    getTranslations("pages.blog.pagination"),
  ]);
  if (!author) notFound();

  const path = localizedPathname(`/author/${slug}`, locale);
  const breadcrumbItems = [
    { name: nav("blog"), url: `${site.url}${localizedPathname("/blog", locale)}` },
    { name: nav("author"), url: `${site.url}${localizedPathname("/author", locale)}` },
    { name: author.name ?? slug, url: `${site.url}${path}` },
  ];

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
              buildBreadcrumbSchema(breadcrumbItems),
            ],
          },
        }}
        locale={locale}
        pathname={path}
      />
      <AuthorDetail
        author={author}
        posts={posts}
        total={total}
        locale={locale}
        breadcrumbs={[
          { label: nav("blog"), href: "/blog" },
          { label: nav("author"), href: "/author" },
          { label: author.name ?? slug },
        ]}
        breadcrumbsLabel={t("breadcrumbs")}
        postsLabel={t.raw("posts")}
        noPostsLabel={t("noPosts")}
        socialLabels={{
          x: t("social.x"),
          linkedin: t("social.linkedin"),
          github: t("social.github"),
          instagram: t("social.instagram"),
          mastodon: t("social.mastodon"),
          website: t("social.website"),
        }}
        page={page}
        pageCount={pageCount(total)}
        basePath={`/author/${slug}`}
        pagerLabels={{
          label: pagerT("label"),
          previous: pagerT("previous"),
          next: pagerT("next"),
          status: pagerT("status"),
        }}
      />
    </DefaultLayout>
  );
}
