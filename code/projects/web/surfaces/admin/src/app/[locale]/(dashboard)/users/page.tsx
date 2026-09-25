/**
 * Browse and search Clerk users with their marketing-email consent.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/users/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { clerkClient } from "@clerk/nextjs/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@indiecrafts/packages-web-ui/web/table";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { PageHeader } from "@/user-interface/layout/PageHeader";

type UserRow = {
  id: string;
  email: string;
  role: string;
  created: number;
  lastSignIn: number | null;
};

/** Browse/search Clerk users (the admin app holds the secret). Read-only. */
async function fetchUsers(query: string): Promise<UserRow[]> {
  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserList({
      limit: 50,
      query: query || undefined,
      orderBy: "-created_at",
    });
    return data.map((u) => ({
      id: u.id,
      email:
        u.primaryEmailAddress?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        "—",
      role: typeof u.publicMetadata?.role === "string" ? u.publicMetadata.role : "—",
      created: u.createdAt,
      lastSignIn: u.lastSignInAt,
    }));
  } catch {
    return [];
  }
}

/** The marketing-email opt-in per user id, from the api (bearer-gated). Fail-open: on any
 *  error every id resolves to null ("not asked"), so the list never breaks. */
async function fetchMarketingConsent(
  userIds: string[],
): Promise<Record<string, number | null>> {
  const url = process.env.API_URL;
  const token = process.env.APP_API_TOKEN;
  if (!url || !token || userIds.length === 0) return {};
  try {
    const res = await fetch(`${url}/v1/profiles/consent`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ userIds }),
      cache: "no-store",
    });
    if (!res.ok) return {};
    return (await res.json()) as Record<string, number | null>;
  } catch {
    return {};
  }
}

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const t = await getTranslations("admin.users");
  const users = await fetchUsers(query);
  const consent = await fetchMarketingConsent(users.map((u) => u.id));
  const emailsLabel = (v: number | null | undefined) =>
    v === 1 ? t("emailsYes") : v === 0 ? t("emailsNo") : t("emailsUnknown");

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("description")} />
      <Card>
        <CardContent>
          <form className="flex gap-2" role="search">
            <Input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t("search")}
              aria-label={t("search")}
              className="flex-1"
            />
            <Button type="submit">{t("go")}</Button>
          </form>
          {users.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("empty")}</p>
          ) : (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("email")}</TableHead>
                    <TableHead>{t("role")}</TableHead>
                    <TableHead>{t("emails")}</TableHead>
                    <TableHead>{t("created")}</TableHead>
                    <TableHead>{t("lastSignIn")}</TableHead>
                    <TableHead>{t("id")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{emailsLabel(consent[u.id])}</TableCell>
                      <TableCell className="tabular-nums">
                        {new Date(u.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {u.lastSignIn
                          ? new Date(u.lastSignIn).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{u.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
