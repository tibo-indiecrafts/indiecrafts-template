import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { requireBlogRoute } from "@/features/blog/lib/route-gate";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { TagListing } from "@/features/blog/user-interface/tag/sections/TagListing";
import { sanityFetchLive } from "@/sanity/live";
import { getTaxonomyPages } from "@/lib/system-pages";
import { tagsForLocaleQuery } from "@/features/blog/sanity/queries";
import type { Tag } from "@/features/blog/sanity/types";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.tag, locale });
}

export default async function TagIndexPage({ params }: Props) {
  requireBlogRoute(pages.tag);
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
        heading={c?.heading ?? t("heading")}
        subheading={c?.subheading ?? t("subheading")}
        emptyLabel={c?.empty ?? t("empty")}
        postsLabel={t.raw("posts")}
      />
    </DefaultLayout>
  );
}
