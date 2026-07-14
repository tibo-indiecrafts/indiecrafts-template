import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireBlogRoute } from "@/features/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { CategoryListing } from "@/features/blog/components/CategoryListing";
import { sanityFetchLive } from "@/sanity/live";
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
