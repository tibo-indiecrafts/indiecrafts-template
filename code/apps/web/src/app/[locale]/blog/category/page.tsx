import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireBlogRoute } from "@/features/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { CategoryListing } from "@/features/blog/user-interface/category/sections/CategoryListing";
import { sanityFetchLive } from "@/sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { categoriesForLocaleQuery } from "@/features/blog/sanity/queries";
import type { Category } from "@/features/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.category, locale });
}

export default async function CategoryIndexPage({ params }: Props) {
  requireBlogRoute(pages.category);
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
    <DefaultLayout>
      <PageSchemas page={pages.category} locale={locale} />
      <CategoryListing
        categories={categories}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: t("title") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={c?.heading ?? t("heading")}
        subheading={c?.subheading ?? t("subheading")}
        emptyLabel={c?.empty ?? t("empty")}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
