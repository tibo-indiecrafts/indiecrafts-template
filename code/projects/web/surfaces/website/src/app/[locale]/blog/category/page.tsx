import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireTaxonomyRoute } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";
import { CategoryListing } from "@indiecrafts/modules-web-blog/user-interface/category/sections/CategoryListing";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { categoriesForLocaleQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { Category } from "@indiecrafts/modules-web-blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.category, locale });
}

export default async function CategoryIndexPage({ params }: Props) {
  await requireTaxonomyRoute("categories", pages.category);
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, t, nav, copy] = await Promise.all([
    sanityFetchLive<Category[]>({
      query: categoriesForLocaleQuery,
      params: { locale },
    }),
    getTranslations("pages.category"),
    getTranslations("nav"),
    getTaxonomyPages(locale),
  ]);
  // Editable in Sanity (`siteMeta.<locale>.taxonomyPages.category`), else messages.
  const c = copy.category;

  return (
    <DefaultLayout subnav={await getCategoryNav(locale)}>
      <PageSchemas page={pages.category} locale={locale} />
      <CategoryListing
        categories={categories}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: t("title") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={c?.heading ?? ""}
        subheading={c?.subheading ?? ""}
        emptyLabel={c?.empty ?? ""}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
