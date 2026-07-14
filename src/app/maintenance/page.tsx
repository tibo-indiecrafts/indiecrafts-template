import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Maintenance } from "@/user-interface/maintenance/components/Maintenance";
import { maintenanceLocale } from "./locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await maintenanceLocale();
  const t = await getTranslations({ locale, namespace: "pages.maintenance" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function MaintenancePage() {
  const locale = await maintenanceLocale();
  const t = await getTranslations({ locale, namespace: "pages.maintenance" });
  return (
    <Maintenance
      statusLabel={t("status")}
      title={t("title")}
      body={t("body")}
      contactLabel={t("contact")}
    />
  );
}
