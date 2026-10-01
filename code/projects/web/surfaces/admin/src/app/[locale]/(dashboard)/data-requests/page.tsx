/**
 * Render the admin GDPR data-request review page.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-requests/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { fetchDataRequests } from "@/lib/monitoring";
import { DataRequestsTable } from "../data-requests-table";

/**
 * GDPR data-subject requests, newest first, read from the shared api (the token stays
 * server-side). Read-only — no status write-back yet. Until that lands, flip a
 * request's status by hand:
 *   wrangler d1 execute indiecrafts-<env>-db-main --remote --env <env> --command \
 *     "UPDATE data_requests SET status='done' WHERE id=?"
 */
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
          {rows === null ? (
            <p role="alert" className="text-destructive py-10 text-center">
              {t("loadError")}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("empty")}</p>
          ) : (
            <DataRequestsTable rows={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
