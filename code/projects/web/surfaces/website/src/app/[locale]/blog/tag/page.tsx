/**
 * List blog tags for the active locale.
 *
 * @see docs/reference/projects/web/website/src/app/locale/blog/tag/page.md
 */
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireTaxonomyRoute } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";
import { TagListing } from "@indiecrafts/modules-web-blog/user-interface/tag/sections/TagListing";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { tagsForLocaleQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { Tag } from "@indiecrafts/modules-web-blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.tag, locale });
}

export default async function TagIndexPage({ params }: Props) {
  await requireTaxonomyRoute("tags", pages.tag);
  const { locale } = await params;
  setRequestLocale(locale);

  const [tags, t, nav, copy, subnav] = await Promise.all([
    sanityFetchLive<Tag[]>({ query: tagsForLocaleQuery, params: { locale } }),
    getTranslations("pages.tag"),
    getTranslations("nav"),
    getTaxonomyPages(locale),
    getCategoryNav(locale),
  ]);
  const c = copy.tag;

  return (
    <DefaultLayout subnav={subnav}>
      <PageSchemas page={pages.tag} locale={locale} />
      <TagListing
        tags={tags}
        breadcrumbs={[{ label: nav("blog"), href: "/blog" }, { label: t("title") }]}
        breadcrumbsLabel={t("breadcrumbs")}
        heading={c?.heading ?? ""}
        subheading={c?.subheading ?? ""}
        emptyLabel={c?.empty ?? ""}
        postsLabel={(count) => t("posts", { count })}
      />
    </DefaultLayout>
  );
}
