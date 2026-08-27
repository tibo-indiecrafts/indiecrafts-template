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

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("description")} />
      <Card>
        <CardContent>
          <form className="flex gap-2" role="search">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t("search")}
              aria-label={t("search")}
              className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-foreground"
            />
            <button className="h-10 rounded-md bg-primary px-4 text-primary-foreground">
              {t("go")}
            </button>
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
