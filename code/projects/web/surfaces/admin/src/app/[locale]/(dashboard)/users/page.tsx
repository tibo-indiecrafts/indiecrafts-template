/**
 * Browse and search Clerk users with their marketing-email consent.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/users/page.md
 */
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { requireAdminPage } from "@/lib/require-admin";
import { auth } from "@clerk/nextjs/server";
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
import { fetchConsentHistory } from "@/lib/consent-history";
import { fetchMarketingConsent, fetchUsers } from "@/lib/users";
import { Link } from "@/i18n/routing";
import { ConsentSheet } from "../consent-sheet";
import { EmailPrefsSheet } from "../email-prefs-sheet";
import { fetchEmailPreferences } from "@/lib/email-preferences";

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; consent?: string; emails?: string }>;
}) {
  const { locale } = await params;
  await requireAdminPage(locale);
  setRequestLocale(locale);
  const { q, consent: consentFor, emails: emailsFor } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const t = await getTranslations("admin.users");
  const tc = await getTranslations("admin.consent");
  const te = await getTranslations("admin.emails");
  const format = await getFormatter();
  const day = (ms: number) =>
    format.dateTime(new Date(ms), { dateStyle: "medium" });
  const users = await fetchUsers(query);
  const consent = await fetchMarketingConsent(users.map((u) => u.id));
  // `?consent=<userId>` opens that user's consent sheet; the read is audited.
  const listHref = query ? `/users?q=${encodeURIComponent(query)}` : "/users";
  const consentHref = (id: string) =>
    `${listHref}${query ? "&" : "?"}consent=${encodeURIComponent(id)}`;
  // `?emails=<userId>` opens that user's email sheet; the read is audited by the api.
  const emailsHref = (id: string) =>
    `${listHref}${query ? "&" : "?"}emails=${encodeURIComponent(id)}`;
  const { userId: actor } = await auth();
  const sheetUser =
    typeof consentFor === "string"
      ? users.find((u) => u.id === consentFor)
      : undefined;
  const history =
    sheetUser && actor ? await fetchConsentHistory(sheetUser.id, actor) : null;
  const emailsUser =
    typeof emailsFor === "string"
      ? users.find((u) => u.id === emailsFor)
      : undefined;
  const emailState =
    emailsUser && actor
      ? await fetchEmailPreferences({ userId: emailsUser.id }, actor)
      : null;
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
            <p className="text-muted-foreground py-10 text-center">
              {t("empty")}
            </p>
          ) : (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      t("email"),
                      t("role"),
                      t("emails"),
                      t("created"),
                      t("lastSignIn"),
                      t("id"),
                      tc("column"),
                      te("column"),
                    ].map((head) => (
                      <TableHead key={head}>{head}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{emailsLabel(consent[u.id])}</TableCell>
                      <TableCell className="tabular-nums">
                        {day(u.created)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {u.lastSignIn ? day(u.lastSignIn) : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {u.id}
                      </TableCell>
                      <TableCell>
                        <RowLink
                          href={consentHref(u.id)}
                          label={tc("open")}
                          aria={`${tc("column")} — ${u.email}`}
                        />
                      </TableCell>
                      <TableCell>
                        <RowLink
                          href={emailsHref(u.id)}
                          label={te("open")}
                          aria={`${te("column")} — ${u.email}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {sheetUser ? (
        <ConsentSheet
          email={sheetUser.email}
          history={history}
          closeHref={listHref}
        />
      ) : null}
      {emailsUser ? (
        <EmailPrefsSheet
          userId={emailsUser.id}
          email={emailsUser.email}
          state={emailState}
          closeHref={listHref}
        />
      ) : null}
    </div>
  );
}

/** A row's link that opens one of its side sheets. */
function RowLink({
  href,
  label,
  aria,
}: {
  href: string;
  label: string;
  aria: string;
}) {
  return (
    <Link
      href={href}
      className="text-primary underline underline-offset-4"
      aria-label={aria}
    >
      {label}
    </Link>
  );
}
