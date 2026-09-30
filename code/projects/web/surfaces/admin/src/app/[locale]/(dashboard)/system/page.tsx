/**
 * Render the admin system-health dashboard for surfaces, workers, and databases.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/system/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardHeader,
} from "@indiecrafts/packages-web-ui/web/card";
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
import { Link } from "@/i18n/routing";
import {
  apiHealthView,
  cronHealth,
  fetchCronStatus,
  healthVariant,
} from "@/lib/monitoring";

// Surfaces expose /api/version; HTTP workers expose /health. URLs from server-only
// env (operator sets them per deployment); unset → "not configured".
const SURFACES = [
  { name: "website", url: process.env.WEBSITE_URL },
  { name: "app", url: process.env.APP_URL },
];
// HTTP workers expose /health. Only the api gets the bearer (its /health then adds D1 status);
// cron has no HTTP surface — its health comes from its run history (GET /v1/cron/status).
const HTTP_WORKERS = [
  { name: "api", url: process.env.API_URL, auth: true },
  { name: "workers", url: process.env.WORKERS_URL, auth: false },
];

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

async function fetchHealth(url?: string, auth = false) {
  if (!url) return { configured: false, ok: false, body: undefined };
  try {
    const token = auth ? process.env.APP_API_TOKEN : undefined;
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
  const tCron = await getTranslations("admin.cron");
  const cron = cronHealth(await fetchCronStatus());

  const surfaces = await Promise.all(
    SURFACES.map(async (s) => ({
      name: s.name,
      ...(await fetchVersion(s.url)),
    })),
  );
  const workerHealth = await Promise.all(
    HTTP_WORKERS.map(async (w) => ({
      name: w.name,
      ...(await fetchHealth(w.url, w.auth)),
    })),
  );
  const api = apiHealthView(workerHealth.find((w) => w.name === "api")?.body);
  const dbVariant = (s: string) =>
    s === "ok"
      ? ("outline" as const)
      : s === "error"
        ? ("destructive" as const)
        : ("secondary" as const);
  const dbs = [
    ...(api.dbs.length
      ? api.dbs.map((d) => ({
          name: `${d.key} (D1, EU)`,
          status: t(
            `dbStatus.${d.status === "ok" || d.status === "error" || d.status === "unbound" ? d.status : "unknown"}`,
          ),
          variant: dbVariant(d.status),
        }))
      : [
          {
            name: "audit · main (D1, EU)",
            status: t("unknown"),
            variant: "secondary" as const,
          },
        ]),
    {
      name: "content (Sanity)",
      status: t("external"),
      variant: "secondary" as const,
    },
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
          <CardContent className="flex flex-col gap-4">
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
                {workerHealth.map((w) => (
                  <TableRow key={w.name}>
                    <TableCell>{w.name}</TableCell>
                    <TableCell className="tabular-nums">
                      {w.name === "api" ? api.version : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {w.name === "api" ? api.commit : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariant(w)}>{badge(w)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>cron</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={healthVariant(cron)}>
                        {tCron(`health.${cron}`)}
                      </Badge>
                      <Link
                        href="/cron"
                        className="text-primary text-sm underline underline-offset-2"
                      >
                        {t("cronLink")}
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {api.bindings.length ? (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">{t("bindings")}</span>
                {api.bindings.map((b) => (
                  <Badge
                    key={b.key}
                    variant={b.bound ? "outline" : "secondary"}
                  >
                    {t(`binding.${b.key}`)} ·{" "}
                    {b.bound ? t("bound") : t("unbound")}
                  </Badge>
                ))}
              </div>
            ) : null}
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
