/**
 * Render the admin GDPR data-request review page.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-requests/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { DataRequestsTable, type DataRequestRow } from "../data-requests-table";

/**
 * Read recent GDPR data-subject requests from the shared api (holds the token
 * server-side). Read-only — no status write-back yet. Until that lands, flip a
 * request's status by hand:
 *   wrangler d1 execute indiecrafts-<env>-shared-api --command \
 *     "UPDATE data_requests SET status='done' WHERE id=?"
 */
async function fetchDataRequests(): Promise<DataRequestRow[]> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return [];
  try {
    const res = await fetch(`${url}/v1/data-requests?limit=100`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: DataRequestRow[] };
    return body.data ?? [];
  } catch {
    return [];
  }
}

export default async function DataRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dataRequests");
  const rows = await fetchDataRequests();

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("empty")}</p>
          ) : (
            <DataRequestsTable rows={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
