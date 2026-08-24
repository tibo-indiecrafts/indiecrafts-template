import { getTranslations, setRequestLocale } from "next-intl/server";

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
    <main id="main" tabIndex={-1} className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      {rows === null ? (
        <p role="alert" className="mt-6 text-destructive">
          {t("loadError")}
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">{t("count")}</th>
                <th className="py-2 pr-4 font-medium">{t("disposition")}</th>
                <th className="py-2 pr-4 font-medium">{t("directive")}</th>
                <th className="py-2 pr-4 font-medium">{t("route")}</th>
                <th className="py-2 pr-4 font-medium">{t("blockedSource")}</th>
                <th className="py-2 pr-4 font-medium">{t("surface")}</th>
                <th className="py-2 font-medium">{t("lastSeen")}</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {rows.map((row) => (
                <tr key={row.group_key} className="border-t border-border">
                  <td className="py-2 pr-4 tabular-nums">{row.count}</td>
                  <td
                    className={
                      "py-2 pr-4 " +
                      (row.disposition === "report"
                        ? "font-medium text-foreground"
                        : "text-muted-foreground")
                    }
                  >
                    {row.disposition}
                  </td>
                  <td className="py-2 pr-4">{row.directive}</td>
                  <td className="py-2 pr-4 font-mono text-xs">
                    {row.document_path}
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs">
                    {row.blocked_source}
                  </td>
                  <td className="py-2 pr-4">{row.surface}</td>
                  <td className="py-2 tabular-nums">{row.last_seen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
