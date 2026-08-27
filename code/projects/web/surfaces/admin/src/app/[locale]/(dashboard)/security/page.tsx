import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type SecurityRow = {
  ts: string;
  event_type: string;
  severity: string;
  surface: string | null;
  user_id: string | null;
  country: string | null;
  description: string | null;
};

/** Read recent app-level incidents from the shared api (holds the token server-side).
 *  Data-minimized — no ip_hash in the projection. Returns `null` when the feed could NOT be
 *  loaded (unconfigured or the api errored) — distinct from an empty (but healthy) feed, so
 *  a broken monitor never reads as "all clear". */
async function fetchSecurity(): Promise<SecurityRow[] | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/v1/security?limit=100`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: SecurityRow[] };
    return body.data ?? [];
  } catch {
    return null;
  }
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.security");
  const rows = await fetchSecurity();
  // The edge firehose lives in Cloudflare, not here — deep-link to it. The operator sets the
  // zone-specific URL; when unset we say so rather than guess a URL (like the System screen).
  const cloudflareUrl = process.env.CLOUDFLARE_SECURITY_URL;

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent className="space-y-4">
          <p className="text-sm">
            {cloudflareUrl ? (
              <>
                <a
                  href={cloudflareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {t("edgeLink")}
                </a>{" "}
                <span className="text-muted-foreground">{t("edgeNote")}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{t("edgeNotConfigured")}</span>
            )}
          </p>
          {rows === null ? (
            <p role="alert" className="text-destructive py-10 text-center">
              {t("loadError")}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("empty")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2 pr-4 font-medium">{t("when")}</th>
                    <th className="py-2 pr-4 font-medium">{t("event")}</th>
                    <th className="py-2 pr-4 font-medium">{t("severity")}</th>
                    <th className="py-2 pr-4 font-medium">{t("surface")}</th>
                    <th className="py-2 pr-4 font-medium">{t("user")}</th>
                    <th className="py-2 pr-4 font-medium">{t("country")}</th>
                    <th className="py-2 font-medium">{t("description")}</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="py-2 pr-4 tabular-nums">{row.ts}</td>
                      <td className="py-2 pr-4">{row.event_type}</td>
                      <td
                        className={
                          "py-2 pr-4 " +
                          (row.severity === "critical" || row.severity === "high"
                            ? "font-medium text-destructive"
                            : "text-muted-foreground")
                        }
                      >
                        {row.severity}
                      </td>
                      <td className="py-2 pr-4">{row.surface ?? "—"}</td>
                      <td className="py-2 pr-4 font-mono text-xs">
                        {row.user_id ?? "—"}
                      </td>
                      <td className="py-2 pr-4">{row.country ?? "—"}</td>
                      <td className="py-2 text-muted-foreground">
                        {row.description ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
