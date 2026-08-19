import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@indiecrafts/config";
import { sanityFetchLive } from "@indiecrafts/sanity/live";
import { legalPageQuery } from "../sanity/queries";
import { LegalBody, type LegalBodyValue } from "./LegalBody";
import { CookieDeclaration } from "./CookieDeclaration";

type LegalDoc = {
  title?: string;
  lastUpdated?: string;
  body?: LegalBodyValue;
};

/**
 * The rendered body of one legal page — the editable Sanity `legalPage` doc for
 * `pageKey` + `locale`. App-agnostic: the route shell wraps it in `DefaultLayout`,
 * gates it on `features.legal.*`, and emits the page JSON-LD + SEO metadata (from
 * the `legalPage` doc's own `.seo`). The cookie page also gets the live cookie table.
 */
export async function LegalPageContent({
  pageKey,
  locale,
}: {
  pageKey: string;
  locale: Locale;
}) {
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
    <article className="mx-auto max-w-2xl px-(--gutter) py-16 md:py-24">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {doc?.title ?? pageKey}
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
  );
}
