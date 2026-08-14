import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireTaxonomyRoute } from "@indiecrafts/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { TagListing } from "@indiecrafts/blog/user-interface/tag/sections/TagListing";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { tagsForLocaleQuery } from "@indiecrafts/blog/sanity/queries";
import type { Tag } from "@indiecrafts/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.tag, locale });
}

export default async function TagIndexPage({ params }: Props) {
  await requireTaxonomyRoute("tags", pages.tag);
  const { locale } = await params;
  setRequestLocale(locale);

  const [tags, t, nav, copy] = await Promise.all([
    sanityFetchLive<Tag[]>({ query: tagsForLocaleQuery, params: { locale } }),
    getTranslations("pages.tag"),
    getTranslations("nav"),
    getTaxonomyPages(locale),
  ]);
  const c = copy.tag;

  return (
    <DefaultLayout>
      <PageSchemas page={pages.tag} locale={locale} />
      <TagListing
        tags={tags}
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
