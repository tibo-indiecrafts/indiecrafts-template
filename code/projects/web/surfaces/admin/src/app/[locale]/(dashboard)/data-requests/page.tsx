/**
 * Render the admin GDPR data-request review page.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-requests/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { fetchDataRequest, fetchDataRequests } from "@/lib/monitoring";
import { DataRequestSheet } from "../data-request-sheet";
import { DataRequestsTable } from "../data-requests-table";

/**
 * GDPR data-subject requests, newest first, read from the shared api (the token stays
 * server-side). `?id=<n>` opens that request's side sheet — its history and the moves
 * (start, done, reject), with the closing reply prefilled in the REQUESTER's language.
 */
/** The two closing replies for a request, rendered in the requester's language (en / fr) —
 *  whatever the admin's own UI locale. */
async function replies(detail: { id: number; request_type: string; locale: string | null }) {
  const locale = detail.locale?.startsWith("fr") ? "fr" : "en";
  const r = await getTranslations({ locale, namespace: "admin.dataRequests" });
  const key = `types.${detail.request_type}`;
  const right = r.has(key) ? r(key) : detail.request_type;
  return {
    done: r("replies.done", { id: detail.id, right }),
    rejected: r("replies.rejected", { id: detail.id, right }),
  };
}

export default async function DataRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.dataRequests");
  const [rows, { id }] = await Promise.all([fetchDataRequests(), searchParams]);
  const detail = id ? await fetchDataRequest(Number(id)) : null;

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
      {detail ? (
        // Keyed by id + status so a move re-renders the sheet with fresh actions.
        <DataRequestSheet
          key={`${detail.id}-${detail.status}`}
          request={detail}
          prefill={await replies(detail)}
        />
      ) : null}
    </div>
  );
}
