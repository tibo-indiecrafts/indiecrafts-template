import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { BlogListing } from "@/components/blog-components/BlogListing";
import { sanityFetchLive } from "@/sanity/live";
import { allPostsQuery } from "@/sanity/queries";
import type { PostListItem } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.blogTwoCol, locale });
}

export default async function BlogTwoColPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.blogTwoCol)) notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  const [posts, t] = await Promise.all([
    sanityFetchLive<PostListItem[]>({ query: allPostsQuery, params: { locale } }),
    getTranslations("pages.blogTwoCol"),
  ]);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.blogTwoCol} locale={locale} />
      <BlogListing
        posts={posts}
        locale={locale}
        heading={t("heading")}
        subheading={t("subheading")}
        noPostsLabel={t("noPosts")}
        cols={2}
      />
    </DefaultLayout>
  );
}
