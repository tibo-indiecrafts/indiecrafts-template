/**
 * Render the admin CSP-violations dashboard from the shared api feed.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/csp/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type CspRow = {
  group_key: string;
  count: number;
  disposition: string;
  directive: string;
  document_path: string;
  blocked_source: string;
  surface: string;
  last_seen: string;
  sample_source_file: string | null;
  sample_line: number | null;
  sample_snippet: string | null;
};

/** Read aggregated CSP violation groups from the shared api (holds the token server-side).
 *  Returns `null` when the feed could NOT be loaded (unconfigured or the api errored) —
 *  distinct from an empty (but healthy) feed, so a broken read never reads as "no violations". */
async function fetchCspReports(): Promise<CspRow[] | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/v1/csp-reports?limit=100`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: CspRow[] };
    return body.data ?? [];
  } catch {
    return null;
  }
}

export default async function CspPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.csp");
  const rows = await fetchCspReports();

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("count")}</TableHead>
                  <TableHead>{t("disposition")}</TableHead>
                  <TableHead>{t("directive")}</TableHead>
                  <TableHead>{t("route")}</TableHead>
                  <TableHead>{t("blockedSource")}</TableHead>
                  <TableHead>{t("surface")}</TableHead>
                  <TableHead>{t("lastSeen")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.group_key}>
                    <TableCell className="tabular-nums">{row.count}</TableCell>
                    <TableCell>
                      <Badge variant={row.disposition === "report" ? "outline" : "secondary"}>
                        {row.disposition}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.directive}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.document_path}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {row.blocked_source}
                    </TableCell>
                    <TableCell>{row.surface}</TableCell>
                    <TableCell className="tabular-nums">{row.last_seen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
