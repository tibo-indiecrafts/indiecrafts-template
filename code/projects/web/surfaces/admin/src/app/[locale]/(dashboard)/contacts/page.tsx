/**
 * Look up a person by email — with or without an account — and turn their emails off on request.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/contacts/page.md
 */
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { requireAdminPage } from "@/lib/require-admin";
import { fetchEmailPreferences } from "@/lib/email-preferences";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { Link } from "@/i18n/routing";
import { EmailPrefsPanel } from "../email-prefs-panel";

const EMAIL = /^[^@\s/?#%\\]+@[^@\s/?#%\\]+\.[^@\s/?#%\\]+$/;

/** `?email=` looks the address up (the api audits the view). An address that belongs to an
 *  account links to that account's email sheet, where the sign-in email can change too. */
export default async function ContactsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { locale } = await params;
  await requireAdminPage(locale);
  setRequestLocale(locale);
  const t = await getTranslations("admin.contacts");
  const te = await getTranslations("admin.emails");
  const { email: raw } = await searchParams;
  const email = typeof raw === "string" ? raw.trim() : "";
  const valid = EMAIL.test(email);
  const { userId: actor } = await auth();
  const state = valid && actor ? await fetchEmailPreferences({ email }, actor) : null;
  const account = state?.subject.userId;

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={t("description")} />
      <Card>
        <CardContent className="space-y-6">
          <form className="flex gap-2" role="search">
            <Input
              type="email"
              name="email"
              defaultValue={email}
              placeholder={t("search")}
              aria-label={t("search")}
              className="flex-1"
            />
            <Button type="submit">{t("go")}</Button>
          </form>
          {!email ? (
            <p className="text-muted-foreground py-6 text-center">{t("prompt")}</p>
          ) : !valid ? (
            <p role="alert" className="text-destructive text-sm">
              {t("invalid")}
            </p>
          ) : state === null ? (
            <p role="alert" className="text-destructive text-sm">
              {te("loadError")}
            </p>
          ) : (
            <div className="space-y-4">
              {account ? (
                <Link
                  href={`/users?q=${encodeURIComponent(email)}&emails=${encodeURIComponent(account)}`}
                  className="text-primary text-sm underline underline-offset-4"
                >
                  {te("openAccount")}
                </Link>
              ) : null}
              <EmailPrefsPanel state={state} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
