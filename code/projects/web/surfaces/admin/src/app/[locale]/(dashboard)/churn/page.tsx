/**
 * Fetch and display churn aggregates from the shared api.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/churn/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requireAdminPage } from "@/lib/require-admin";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";
import { CHURN_REASON_CODES } from "@indiecrafts/packages-shared-compliance/shared";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type ChurnData = {
  total: number;
  byDay: { date: string; count: number }[];
  byReason: { reason: string; count: number }[];
  recentFeedback: {
    deleted_at: string;
    reason: string | null;
    feedback: string | null;
    competitor: string | null;
  }[];
};

/** Read the churn aggregate from the shared api (holds the token server-side).
 *  Returns `null` when it could NOT be loaded (unconfigured or the api errored). */
async function fetchChurn(): Promise<ChurnData | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/v1/churn`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ChurnData;
  } catch {
    return null;
  }
}

export default async function ChurnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireAdminPage(locale);
  setRequestLocale(locale);
  const t = await getTranslations("admin.churn");
  const data = await fetchChurn();

  const reasonLabel = (reason: string | null) =>
    t(
      `reasons.${reason && (CHURN_REASON_CODES as readonly string[]).includes(reason) ? reason : "unknown"}`,
    );

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} />
      {data === null ? (
        <Card>
          <CardContent>
            <p role="alert" className="text-destructive py-10 text-center">
              {t("unavailable")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-sm font-medium">{t("total")}</p>
              <p className="text-2xl font-semibold tabular-nums">{data.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("reason")}</TableHead>
                    <TableHead>{t("count")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byReason.map((row) => (
                    <TableRow key={row.reason}>
                      <TableCell>{reasonLabel(row.reason)}</TableCell>
                      <TableCell className="tabular-nums">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("count")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byDay.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell className="tabular-nums">{row.date}</TableCell>
                      <TableCell className="tabular-nums">{row.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("reason")}</TableHead>
                    <TableHead>{t("feedback")}</TableHead>
                    <TableHead>{t("competitor")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentFeedback.map((row, i) => (
                    <TableRow key={`${row.deleted_at}-${i}`}>
                      <TableCell className="tabular-nums">{row.deleted_at}</TableCell>
                      <TableCell>{reasonLabel(row.reason)}</TableCell>
                      <TableCell>{row.feedback ?? "—"}</TableCell>
                      <TableCell>{row.competitor ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
