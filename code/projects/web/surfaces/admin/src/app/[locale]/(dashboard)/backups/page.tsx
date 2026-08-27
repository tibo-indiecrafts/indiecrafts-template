import { getTranslations, setRequestLocale } from "next-intl/server";
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
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      <BackupsTable status={status} />
    </div>
  );
}
