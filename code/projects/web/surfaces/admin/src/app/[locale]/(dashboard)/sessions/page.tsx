import { getTranslations, setRequestLocale } from "next-intl/server";
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
    <main id="main" tabIndex={-1} className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      {rows.length === 0 ? (
        <p className="mt-6 text-muted-foreground">{t("empty")}</p>
      ) : (
        <SessionsTable rows={rows} />
      )}
    </main>
  );
}
