/**
 * List blog authors for the active locale.
 *
 * @see docs/reference/projects/web/website/src/app/locale/author/page.md
 */
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages } from "@/config";
import type { Locale } from "@/config";
import { requireTaxonomyRoute } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";
import { AuthorListing } from "@indiecrafts/modules-web-blog/user-interface/author/sections/AuthorListing";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { authorsForLocaleQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { Author } from "@indiecrafts/modules-web-blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.author, locale });
}

export default async function AuthorIndexPage({ params }: Props) {
  await requireTaxonomyRoute("authors", pages.author);
  const { locale } = await params;
  setRequestLocale(locale);

  const [authors, t, nav, copy, subnav] = await Promise.all([
    sanityFetchLive<Author[]>({ query: authorsForLocaleQuery, params: { locale } }),
    getTranslations("pages.author"),
    getTranslations("nav"),
    getTaxonomyPages(locale),
    getCategoryNav(locale),
  ]);
  const c = copy.author;

  return (
    <DefaultLayout subnav={subnav}>
      <PageSchemas page={pages.author} locale={locale} />
      <AuthorListing
        authors={authors}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: nav("author") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={c?.heading ?? ""}
        subheading={c?.subheading ?? ""}
        emptyLabel={c?.empty ?? ""}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
