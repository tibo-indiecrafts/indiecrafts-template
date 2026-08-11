import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSystemPages } from "@/lib/system-pages";
import { Maintenance } from "@/user-interface/maintenance/components/Maintenance";
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
  const [sys, t] = await Promise.all([
    getSystemPages(locale),
    getTranslations({ locale, namespace: "pages.maintenance" }),
  ]);
  const m = sys.maintenance ?? {};
  return (
    <Maintenance
      statusLabel={m.status ?? t("status")}
      title={m.title ?? t("title")}
      body={m.body ?? t("body")}
      contactLabel={m.contact ?? t("contact")}
    />
  );
}
