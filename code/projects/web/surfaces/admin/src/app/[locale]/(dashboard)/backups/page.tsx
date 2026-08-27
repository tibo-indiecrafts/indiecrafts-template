import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { BackupsTable, type BackupsStatus } from "../backups-table";

const EMPTY: BackupsStatus = {
  bucket: null,
  retentionDays: 0,
  preMigrationSnapshots: false,
  runs: [],
};

/**
 * Read bucket/retention/pre-migration-flag + recent backup runs from the shared api
 * (holds the token server-side). Read-only — display only, no control here.
 */
async function fetchBackupsStatus(): Promise<BackupsStatus> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return EMPTY;
  try {
    const res = await fetch(`${url}/v1/backups/status`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return EMPTY;
    return (await res.json()) as BackupsStatus;
  } catch {
    return EMPTY;
  }
}

export default async function BackupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.backups");
  const status = await fetchBackupsStatus();

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent>
          <BackupsTable status={status} />
        </CardContent>
      </Card>
    </div>
  );
}
