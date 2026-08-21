import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { features, localePrefix, site, type Locale, type PageConfig } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { translationAlternates } from "@/lib/seo/translations";
import { buildWebPageSchema } from "@/lib/seo/jsonld-core";
import { JsonLdScript } from "@/lib/seo/jsonld";
import { getPage, getAllPageParams } from "@/lib/page";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { renderBlock } from "@indiecrafts/packages-web-ui-components/web/registry";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";
import type { BlockModule } from "@indiecrafts/packages-web-ui-components/shared/types";

/**
 * Generic editor-driven pages — the `/[locale]/<slug>` catch-all. Resolves a
 * `page` document (`@indiecrafts/packages-web-page-builder`) by slug + locale and paints its
 * `sections[]` through the shared `renderBlock` registry. A required catch-all
 * (`[...slug]`, not `[[...slug]]`) so it never shadows the `(home)` index; the 11
 * static route folders resolve first, this is the fallback (unknown path → 404).
 */
type Props = { params: Promise<{ locale: Locale; slug: string[] }> };

export async function generateStaticParams() {
  const params = await getAllPageParams();
  return params.map((p) => ({ locale: p.locale, slug: p.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const path = `${localePrefix(locale)}/${slug.join("/")}`;
  // A dynamic route self-canonicalizes (hreflang collapses to this locale) — pass
  // `pathname`. A synthetic PageConfig carries structural defaults (og type,
  // twitter, robots); the page's own `seo` overrides the copy.
  const syntheticPage = { key: path, id: "page", slug: path } as PageConfig;
  const pageSlug = slug.join("/");
  const [page, translations] = await Promise.all([
    getPage(pageSlug, locale),
    translationAlternates("page", pageSlug, locale),
  ]);
  const base = await buildMetadata({
    page: syntheticPage,
    locale,
    pathname: path,
    translations,
  });
  if (!page) return base;

  const title = page.seo?.title || page.title || undefined;
  const description = page.seo?.description || undefined;
  const ogImage = page.seo?.image?.asset?.url;
  const noindex = page.seo?.noIndex || page.seo?.hideFromDiscovery;
  return {
    ...base,
    title,
    description,
    robots: noindex ? { index: false, follow: false } : base.robots,
    openGraph: {
      ...base.openGraph,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : base.openGraph?.images,
    },
  };
}

export default async function BuilderPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = await getPage(slug.join("/"), locale);
  if (!page) notFound();

  const sections = (page.sections ?? []) as BlockModule[];

  // WebPage JSON-LD — built from the page's own SEO (not the static `pageSeo` map),
  // gated on the structured-data feature + the page's noindex.
  const noindex = page.seo?.noIndex || page.seo?.hideFromDiscovery;
  const webPage =
    features.structuredData && !noindex
      ? buildWebPageSchema({
          id: `page-${slug.join("/")}`,
          url: `${site.url}${localePrefix(locale)}/${slug.join("/")}`,
          locale,
          title: page.seo?.title || page.title || "",
          description: page.seo?.description || undefined,
          image: page.seo?.image?.asset?.url || undefined,
        })
      : null;

  return (
    <DefaultLayout>
      {webPage ? <JsonLdScript data={webPage} /> : null}
      {sections.map((block) => (
        <div key={block._key}>{renderBlock(block, portableComponents)}</div>
      ))}
    </DefaultLayout>
  );
}
