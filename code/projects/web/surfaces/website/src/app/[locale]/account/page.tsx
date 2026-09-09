import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";
import {
  buildDeleteAccountCopy,
  buildExportCopy,
} from "@indiecrafts/packages-shared-compliance/web";
import { ManagePreferencesButton } from "@indiecrafts/packages-web-compliance/consent/ManagePreferencesButton";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { features, pages, isPageVisible, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { AccountDeletePanel } from "@/user-interface/account/AccountDeletePanel";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.account, locale });
}

/**
 * Self-service account-actions route — thin shell. Renders the shared
 * `DeleteAccountSection` + `ExportSection` (from
 * `@indiecrafts/packages-shared-compliance/web`) via the `AccountDeletePanel` client
 * wrapper, with copy resolved here from `messages.account.{delete,export}.*`. Gated by
 * `features.account.delete` (`isPageVisible`) AND by Clerk being configured — no
 * account page without auth. `ExportSection` renders only when `features.account.export`
 * is also on. Posts to the shared api's authenticated `POST /v1/erasure/self` +
 * `POST /v1/export`.
 */
export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!isPageVisible(pages.account)) notFound();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) notFound();
  // Fail-safe: with no client api origin the control could only ever fail on
  // submit (a relative `/v1/erasure/self` 404s) — 404 the whole page instead.
  if (!process.env.NEXT_PUBLIC_API_URL) notFound();
  // Account actions require a signed-in user — the panel calls the authenticated
  // `/v1/erasure/self` + `/v1/export`. Signed out → home (sign in via the header menu).
  const { userId } = await auth();
  if (!userId) redirect({ href: "/", locale });

  const t = await getTranslations({ locale, namespace: "account.delete" });
  const copy = buildDeleteAccountCopy(t);

  const et = await getTranslations({ locale, namespace: "account.export" });
  const exportCopy = buildExportCopy(et);

  const ct = await getTranslations({ locale, namespace: "cookies" });

  return (
    <DefaultLayout>
      <PageSchemas page={pages.account} locale={locale} />
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-3">
            <h2 className="text-sm font-semibold">{ct("preferencesTitle")}</h2>
            <p className="text-muted-foreground text-sm">{ct("preferencesBody")}</p>
            <ManagePreferencesButton label={ct("manage")} />
          </CardContent>
        </Card>
        <AccountDeletePanel
          copy={copy}
          exportCopy={exportCopy}
          showExport={features.account.export}
        />
      </div>
    </DefaultLayout>
  );
}
