import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/config";
import { NotFoundContent } from "@indiecrafts/packages-shared-system-pages/web";
import { Link } from "@/i18n/routing";
import { getSystemPages } from "@/lib/system-pages";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

// Belt-and-suspenders: the 404 HTTP status already deindexes this, but state it.
export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * 404 copy: Sanity (`siteMeta.<locale>.systemPages.notFound`) per field, else the
 * `messages/<locale>.json` fallback — so the page still renders if Sanity is down.
 */
export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const [sys, t] = await Promise.all([
    getSystemPages(locale),
    getTranslations({ locale, namespace: "pages.notFound" }),
  ]);
  const nf = sys.notFound ?? {};
  return (
    <DefaultLayout>
      <NotFoundContent
        eyebrow={nf.eyebrow ?? t("eyebrow")}
        title={nf.title ?? t("title")}
        description={nf.description ?? t("description")}
        homeLabel={nf.homeLabel ?? t("homeLabel")}
        LinkComponent={Link}
      />
    </DefaultLayout>
  );
}
