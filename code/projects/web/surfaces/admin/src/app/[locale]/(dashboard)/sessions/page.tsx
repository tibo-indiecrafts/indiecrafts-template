/**
 * Render the admin sign-in activity page.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/sessions/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { SessionsTable, type SessionRow } from "../sessions-table";

/** Read recent sign-ins from the shared api (holds the token server-side). No IP. */
async function fetchSessions(): Promise<SessionRow[]> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return [];
  try {
    const res = await fetch(`${url}/v1/sessions?limit=100`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { data?: SessionRow[] };
    return body.data ?? [];
  } catch {
    return [];
  }
}

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.sessions");
  const rows = await fetchSessions();

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <Card>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("empty")}</p>
          ) : (
            <SessionsTable rows={rows} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
