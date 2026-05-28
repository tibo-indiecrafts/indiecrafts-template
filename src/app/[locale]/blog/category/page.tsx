import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { CategoryListing } from "@/components/blog-components/CategoryListing";
import { sanityFetchLive } from "@/sanity/live";
import { categoriesForLocaleQuery } from "@/sanity/queries";
import type { Category } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.category, locale });
}

export default async function CategoryIndexPage({ params }: Props) {
  if (!features.blog || !isPageVisible(pages.category)) notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, t, nav] = await Promise.all([
    sanityFetchLive<Category[]>({
      query: categoriesForLocaleQuery,
      params: { locale },
    }),
    getTranslations("pages.category"),
    getTranslations("nav"),
  ]);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.category} locale={locale} />
      <CategoryListing
        categories={categories}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: t("title") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={t("heading")}
        subheading={t("subheading")}
        emptyLabel={t("empty")}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
