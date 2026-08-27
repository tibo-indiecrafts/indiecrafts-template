import { getTranslations, setRequestLocale } from "next-intl/server";
import { clerkClient } from "@clerk/nextjs/server";

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
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
      <form className="mt-4 flex gap-2" role="search">
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
        <p className="mt-6 text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 font-medium">{t("email")}</th>
                <th className="py-2 pr-4 font-medium">{t("role")}</th>
                <th className="py-2 pr-4 font-medium">{t("created")}</th>
                <th className="py-2 pr-4 font-medium">{t("lastSignIn")}</th>
                <th className="py-2 font-medium">{t("id")}</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.role}</td>
                  <td className="py-2 pr-4 tabular-nums">
                    {new Date(u.created).toLocaleDateString()}
                  </td>
                  <td className="py-2 pr-4 tabular-nums">
                    {u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2 font-mono text-xs">{u.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
