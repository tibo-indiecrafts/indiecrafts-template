import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@indiecrafts/packages-web-ui/web/card";
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

// Surfaces expose /api/version; HTTP workers expose /health. URLs from server-only
// env (operator sets them per deployment); unset → "not configured".
const SURFACES = [
  { name: "website", url: process.env.WEBSITE_URL },
  { name: "app", url: process.env.APP_URL },
];
const HTTP_WORKERS = [
  { name: "api", url: process.env.API_URL },
  { name: "agent", url: process.env.AGENT_URL },
];
// cron + workers-jobs have no public HTTP surface (scheduled / queue).
const NON_HTTP_WORKERS = ["cron", "workers"];

async function fetchVersion(url?: string) {
  if (!url) return { configured: false, ok: false } as const;
  try {
    const res = await fetch(`${url}/api/version`, { cache: "no-store" });
    if (!res.ok) return { configured: true, ok: false } as const;
    const b = (await res.json()) as { version?: string; commit?: string };
    return { configured: true, ok: true, ...b } as const;
  } catch {
    return { configured: true, ok: false } as const;
  }
}

async function fetchHealth(url?: string) {
  if (!url) return { configured: false, ok: false, body: undefined };
  try {
    const token = process.env.APP_API_TOKEN;
    const res = await fetch(`${url}/health`, {
      cache: "no-store",
      headers: token ? { authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return { configured: true, ok: false, body: undefined };
    return {
      configured: true,
      ok: true,
      body: (await res.json()) as Record<string, unknown>,
    };
  } catch {
    return { configured: true, ok: false, body: undefined };
  }
}

export default async function SystemPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.system");

  const surfaces = await Promise.all(
    SURFACES.map(async (s) => ({ name: s.name, ...(await fetchVersion(s.url)) })),
  );
  const workerHealth = await Promise.all(
    HTTP_WORKERS.map(async (w) => ({ name: w.name, ...(await fetchHealth(w.url)) })),
  );
  const apiHealth = workerHealth.find((w) => w.name === "api")?.body;
  const dbs = [
    {
      name: "data (D1, EU)",
      status: String(apiHealth?.db ?? t("unknown")),
      variant: apiHealth?.db ? ("outline" as const) : ("secondary" as const),
    },
    { name: "content (Sanity)", status: t("external"), variant: "secondary" as const },
  ];

  const badge = (row: { configured: boolean; ok: boolean }) =>
    !row.configured ? t("notConfigured") : row.ok ? t("live") : t("down");
  const badgeVariant = (row: { configured: boolean; ok: boolean }) =>
    !row.configured
      ? ("secondary" as const)
      : row.ok
        ? ("outline" as const)
        : ("destructive" as const);

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("description")} />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <h2 className="leading-none font-semibold">{t("surfaces")}</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("version")}</TableHead>
                  <TableHead>{t("commit")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surfaces.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell className="tabular-nums">
                      {"version" in s ? (s.version ?? "—") : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {"commit" in s ? (s.commit ?? "—") : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant(s)}>{badge(s)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="leading-none font-semibold">{t("workers")}</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workerHealth.map((w) => (
                  <TableRow key={w.name}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant(w)}>{badge(w)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {NON_HTTP_WORKERS.map((name) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{t("noEndpoint")}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="leading-none font-semibold">{t("databases")}</h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbs.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>
                      <Badge variant={d.variant}>{d.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
