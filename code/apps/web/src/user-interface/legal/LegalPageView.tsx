import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isPageVisible, type Locale, type PageConfig } from "@/config";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import { legalPageQuery } from "@/sanity/legal-queries";
import { LegalBody, type LegalBodyValue } from "./components/LegalBody";
import { CookieDeclaration } from "./components/CookieDeclaration";

type LegalDoc = {
  title?: string;
  lastUpdated?: string;
  body?: LegalBodyValue;
};

/**
 * Shared view for every legal page. The thin route (`page.tsx`) passes its
 * `PageConfig` + `pageKey`; this fetches the editable body from Sanity
 * (`legalPage` doc) and renders it. SEO/metadata is handled by the route's
 * `generateMetadata` (from `siteMeta.pageSeo`), not here.
 */
export async function LegalPageView({
  page,
  pageKey,
  locale,
}: {
  page: PageConfig;
  pageKey: string;
  locale: Locale;
}) {
  if (!isPageVisible(page)) notFound();
  setRequestLocale(locale);

  const [doc, t] = await Promise.all([
    sanityFetchLive<LegalDoc | null>({
      query: legalPageQuery,
      params: { pageKey, locale },
    }),
    getTranslations("legal"),
  ]);

  const updated = doc?.lastUpdated
    ? new Date(doc.lastUpdated).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <DefaultLayout>
      <PageSchemas page={page} locale={locale} />
      <article className="mx-auto max-w-2xl px-(--gutter) py-16 md:py-24">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {doc?.title ?? page.id}
          </h1>
          {updated ? (
            <p className="text-muted-foreground mt-3 text-sm">
              {t("lastUpdated", { date: updated })}
            </p>
          ) : null}
        </header>
        {Array.isArray(doc?.body) && doc.body.length > 0 ? (
          <LegalBody value={doc.body} />
        ) : (
          <p className="text-muted-foreground">{t("empty")}</p>
        )}
        {/* Cookie-policy page: append the live cookie declaration from Sanity. */}
        {pageKey === "cookies" ? <CookieDeclaration locale={locale} /> : null}
      </article>
    </DefaultLayout>
  );
}
