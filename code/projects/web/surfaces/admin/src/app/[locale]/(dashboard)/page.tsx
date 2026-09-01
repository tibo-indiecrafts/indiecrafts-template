import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@indiecrafts/packages-web-ui/web/card";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { NAV } from "@/user-interface/lib/nav";
import { AdminRoleForm } from "./admin-role-form";

// Nav keys with a cheap row-count on the shared api, keyed to their `{ data: [...] }`
// list endpoint (mirrors sessions/page.tsx's fetchSessions). Keys without an entry
// here (users — Clerk, not this api; backups/system/settings — no plain row list)
// render "—" instead of fetching.
const COUNT_PATHS: Record<string, string> = {
  sessions: "/v1/sessions?limit=100",
  dataRequests: "/v1/data-requests?limit=100",
  csp: "/v1/csp-reports?limit=100",
  security: "/v1/security?limit=100",
};

/** Best-effort row count from a `{ data: [...] }` list endpoint. `null` on any
 *  failure (unconfigured, non-2xx, network error) — rendered as a muted "—". */
async function fetchCount(path: string): Promise<number | null> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}${path}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: unknown[] };
    return body.data?.length ?? null;
  } catch {
    return null;
  }
}

export default async function AdminHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const items = NAV.flatMap((g) => g.items).filter((item) => item.key !== "overview");
  const counts = Object.fromEntries(
    await Promise.all(
      Object.entries(COUNT_PATHS).map(
        async ([key, path]) => [key, await fetchCount(path)] as const,
      ),
    ),
  );

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("welcome")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.key} href={item.href}>
            <Card className="hover:bg-accent/50 h-full transition-colors">
              <CardHeader>
                <CardTitle className="text-muted-foreground flex items-center justify-between gap-2 text-sm font-medium">
                  {t(`nav.${item.key}`)}
                  <item.icon aria-hidden="true" className="size-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold tabular-nums">
                  {counts[item.key] ?? "—"}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {typeof counts[item.key] === "number"
                    ? t("overview.recent")
                    : counts[item.key] === undefined
                      ? t("overview.untracked")
                      : t("overview.unavailable")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent>
          <AdminRoleForm />
        </CardContent>
      </Card>
    </div>
  );
}
