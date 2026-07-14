import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireBlogRoute } from "@/lib/feature-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/components/layout/DefaultLayout";
import { TagListing } from "@/features/blog/components/TagListing";
import { sanityFetchLive } from "@/sanity/live";
import { tagsForLocaleQuery } from "@/sanity/queries";
import type { Tag } from "@/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.tag, locale });
}

export default async function TagIndexPage({ params }: Props) {
  requireBlogRoute(pages.tag);
  const { locale } = await params;
  setRequestLocale(locale);

  const [tags, t, nav] = await Promise.all([
    sanityFetchLive<Tag[]>({ query: tagsForLocaleQuery, params: { locale } }),
    getTranslations("pages.tag"),
    getTranslations("nav"),
  ]);

  return (
    <DefaultLayout>
      <PageSchemas page={pages.tag} locale={locale} />
      <TagListing
        tags={tags}
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
