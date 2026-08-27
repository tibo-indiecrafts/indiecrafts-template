import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { SettingsForm, type SettingRow } from "../settings-form";

/**
 * Read the operational retention/ops/TTL settings from the shared api (holds the
 * token server-side). Edits go through the `saveSetting` server action, never a
 * direct client call — the token never reaches the browser.
 */
async function fetchSettings(): Promise<SettingRow[]> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return [];
  try {
    const res = await fetch(`${url}/v1/settings`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { settings?: SettingRow[] };
    return body.settings ?? [];
  } catch {
    return [];
  }
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.settings");
  const settings = await fetchSettings();

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
