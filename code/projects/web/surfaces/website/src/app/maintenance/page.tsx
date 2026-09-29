/**
 * Render the maintenance page from Sanity system-page copy with message fallbacks.
 *
 * @see docs/reference/projects/web/website/src/app/maintenance/page.md
 */
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSystemPages } from "@/lib/system-pages";
import { DEFAULT_SITE_NAME, getSiteSettings } from "@/lib/seo/site-seo";
import { Maintenance } from "@indiecrafts/packages-web-system-pages/web";
import { maintenanceLocale } from "./locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await maintenanceLocale();
  const [sys, t] = await Promise.all([
    getSystemPages(locale),
    getTranslations({ locale, namespace: "pages.maintenance" }),
  ]);
  return {
    title: sys.maintenance?.title ?? t("title"),
    robots: { index: false, follow: false },
  };
}

/**
 * Maintenance copy: Sanity (`siteMeta.<locale>.systemPages.maintenance`) per
 * field, else the `messages/<locale>.json` fallback — so the page still renders
 * if Sanity is down.
 */
export default async function MaintenancePage() {
  const locale = await maintenanceLocale();
  const [sys, t, settings] = await Promise.all([
    getSystemPages(locale),
    getTranslations({ locale, namespace: "pages.maintenance" }),
    getSiteSettings(),
  ]);
  const m = sys.maintenance ?? {};
  return (
    <Maintenance
      statusLabel={m.status ?? t("status")}
      title={m.title ?? t("title")}
      body={m.body ?? t("body")}
      contactLabel={m.contact ?? t("contact")}
      name={settings.siteName || DEFAULT_SITE_NAME}
      email={settings.business.contactPoint?.email}
    />
  );
}
