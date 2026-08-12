import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages } from "@indiecrafts/config";
import type { Locale } from "@indiecrafts/config";
import { requireBlogRoute } from "@indiecrafts/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AuthorListing } from "@indiecrafts/blog/user-interface/author/sections/AuthorListing";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { authorsForLocaleQuery } from "@indiecrafts/blog/sanity/queries";
import type { Author } from "@indiecrafts/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.author, locale });
}

export default async function AuthorIndexPage({ params }: Props) {
  requireBlogRoute(pages.author);
  const { locale } = await params;
  setRequestLocale(locale);

  const [authors, t, nav, copy] = await Promise.all([
    sanityFetchLive<Author[]>({ query: authorsForLocaleQuery, params: { locale } }),
    getTranslations("pages.author"),
    getTranslations("nav"),
    getTaxonomyPages(locale),
  ]);
  const c = copy.author;

  return (
    <DefaultLayout>
      <PageSchemas page={pages.author} locale={locale} />
      <AuthorListing
        authors={authors}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: nav("author") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={c?.heading ?? t("heading")}
        subheading={c?.subheading ?? t("subheading")}
        emptyLabel={c?.empty ?? t("empty")}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
