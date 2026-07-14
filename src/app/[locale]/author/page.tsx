import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages } from "@/config";
import type { Locale } from "@/config";
import { requireBlogRoute } from "@/lib/feature-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { AuthorListing } from "@/components/blog-components/AuthorListing";
import { sanityFetchLive } from "@/sanity/live";
import { authorsForLocaleQuery } from "@/sanity/queries";
import type { Author } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.author, locale });
}

export default async function AuthorIndexPage({ params }: Props) {
  requireBlogRoute(pages.author);
  const { locale } = await params;
  setRequestLocale(locale);

  const [authors, t, nav] = await Promise.all([
    sanityFetchLive<Author[]>({ query: authorsForLocaleQuery, params: { locale } }),
    getTranslations("pages.author"),
    getTranslations("nav"),
  ]);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.author} locale={locale} />
      <AuthorListing
        authors={authors}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: nav("author") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={t("heading")}
        subheading={t("subheading")}
        emptyLabel={t("empty")}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
