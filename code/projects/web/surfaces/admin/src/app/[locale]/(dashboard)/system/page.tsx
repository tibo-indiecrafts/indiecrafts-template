import { getTranslations, setRequestLocale } from "next-intl/server";

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
    { name: "data (D1, EU)", status: String(apiHealth?.db ?? t("unknown")) },
    { name: "content (Sanity)", status: t("external") },
  ];

  const badge = (row: { configured: boolean; ok: boolean }) =>
    !row.configured ? t("notConfigured") : row.ok ? t("live") : t("down");

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>

      <section aria-labelledby="surfaces-h">
        <h2 id="surfaces-h" className="text-lg font-medium text-foreground">
          {t("surfaces")}
        </h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">{t("name")}</th>
              <th className="py-2 pr-4 font-medium">{t("version")}</th>
              <th className="py-2 pr-4 font-medium">{t("commit")}</th>
              <th className="py-2 font-medium">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {surfaces.map((s) => (
              <tr key={s.name} className="border-t border-border">
                <td className="py-2 pr-4">{s.name}</td>
                <td className="py-2 pr-4 tabular-nums">
                  {"version" in s ? (s.version ?? "—") : "—"}
                </td>
                <td className="py-2 pr-4 font-mono text-xs">
                  {"commit" in s ? (s.commit ?? "—") : "—"}
                </td>
                <td className="py-2">{badge(s)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="workers-h">
        <h2 id="workers-h" className="text-lg font-medium text-foreground">
          {t("workers")}
        </h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">{t("name")}</th>
              <th className="py-2 font-medium">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {workerHealth.map((w) => (
              <tr key={w.name} className="border-t border-border">
                <td className="py-2 pr-4">{w.name}</td>
                <td className="py-2">{badge(w)}</td>
              </tr>
            ))}
            {NON_HTTP_WORKERS.map((name) => (
              <tr key={name} className="border-t border-border">
                <td className="py-2 pr-4">{name}</td>
                <td className="py-2 text-muted-foreground">{t("noEndpoint")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="dbs-h">
        <h2 id="dbs-h" className="text-lg font-medium text-foreground">
          {t("databases")}
        </h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">{t("name")}</th>
              <th className="py-2 font-medium">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {dbs.map((d) => (
              <tr key={d.name} className="border-t border-border">
                <td className="py-2 pr-4">{d.name}</td>
                <td className="py-2">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
