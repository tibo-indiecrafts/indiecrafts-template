/**
 * Search blog posts for a query and render the results.
 *
 * @see docs/reference/projects/web/website/src/app/locale/blog/search/page.md
 */
import { setRequestLocale, getTranslations } from "next-intl/server";
import { pages, type Locale } from "@/config";
import { localizedPathname } from "@/i18n/routing";
import { isSearchEnabled } from "@indiecrafts/modules-web-blog/lib/route-gate";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { getCategoryNav } from "@indiecrafts/modules-web-blog/lib/category-nav";
import { BlogCard } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogCard";
import { BlogSearchForm } from "@indiecrafts/modules-web-blog/user-interface/shared/components/BlogSearchForm";
import { Breadcrumbs } from "@indiecrafts/modules-web-blog/user-interface/shared/components/Breadcrumbs";
import { sanityFetchLive } from "@indiecrafts/packages-web-sanity/live";
import { searchPostsQuery } from "@indiecrafts/modules-web-blog/sanity/queries";
import type { PostListItem } from "@indiecrafts/modules-web-blog/sanity/types";

/** Results shown for a query — no pagination (see `searchPostsQuery` ceiling). */
const SEARCH_LIMIT = 30;

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const [base, t] = await Promise.all([
    buildMetadata({
      page: pages.blog,
      locale,
      pathname: localizedPathname("/blog/search", locale),
    }),
    getTranslations({ locale, namespace: "pages.blog.search" }),
  ]);
  // A search results page has no lasting content — keep it out of the index
  // (still followable so crawlers reach the linked posts).
  return { ...base, title: t("title"), robots: { index: false, follow: true } };
}

export default async function BlogSearchPage({ params, searchParams }: Props) {
  if (!isSearchEnabled()) notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  const rawQ = (await searchParams).q;
  const q = (Array.isArray(rawQ) ? (rawQ[0] ?? "") : (rawQ ?? "")).trim();

  const [t, nav, subnav] = await Promise.all([
    getTranslations("pages.blog.search"),
    getTranslations("nav"),
    getCategoryNav(locale),
  ]);

  const results = q
    ? await sanityFetchLive<PostListItem[]>({
        query: searchPostsQuery,
        // Prefix match on the phrase; params are bound, so no query injection.
        params: { locale, q: `${q}*`, limit: SEARCH_LIMIT },
      })
    : [];

  return (
    <DefaultLayout subnav={subnav}>
      <section
        aria-labelledby="blog-search-title"
        className="pt-6 pb-12 md:pt-8 md:pb-16"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-(--gutter) md:gap-10">
          <Breadcrumbs
            items={[{ label: nav("blog"), href: "/blog" }, { label: t("breadcrumb") }]}
            label={t("breadcrumb")}
          />

          <header className="flex flex-col items-center gap-6 text-center">
            <h1 id="blog-search-title" className="text-3xl font-semibold md:text-4xl">
              {t("title")}
            </h1>
            <BlogSearchForm
              action={localizedPathname("/blog/search", locale)}
              defaultValue={q}
              labels={{
                label: t("label"),
                placeholder: t("placeholder"),
                submit: t("submit"),
              }}
            />
          </header>

          {q === "" ? (
            <p className="text-muted-foreground text-center">{t("prompt")}</p>
          ) : results.length === 0 ? (
            <p className="text-muted-foreground text-center">
              {t("noResults", { query: q })}
            </p>
          ) : (
            <>
              <p aria-live="polite" className="text-muted-foreground text-sm">
                {t("resultsFor", { count: results.length, query: q })}
              </p>
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((post) => (
                  <li key={post._id}>
                    <BlogCard post={post} locale={locale} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
