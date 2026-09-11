import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@indiecrafts/packages-web-ui/web/card";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { ShareButtons } from "@indiecrafts/packages-web-ui-components/web/layout/ShareButtons";
import { Link } from "@/i18n/routing";
import { PageHeader } from "@/user-interface/layout/PageHeader";
import { getAppWelcome } from "@/lib/welcome";

// App home. Server component; `setRequestLocale` keeps it statically rendered.
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("app");
  const tShare = await getTranslations("share");
  // Editor-owned welcome from Sanity (live, cached); falls back to the message file.
  const welcome = await getAppWelcome(locale);

  return (
    <div className="p-4 md:p-6">
      <PageHeader title={t("title")} description={welcome ?? t("subtitle")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("nav.account")}</CardTitle>
            <CardDescription>{t("home.accountDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/account">{t("nav.account")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("user.legal")}</CardTitle>
            <CardDescription>{t("home.legalDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/legal">{t("user.legal")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardContent className="flex flex-wrap items-center gap-2">
          {/* `url` omitted → ShareButtons resolves the current page URL on the client. */}
          <ShareButtons
            title={t("title")}
            labels={{
              label: tShare("label"),
              x: tShare("x"),
              linkedin: tShare("linkedin"),
              facebook: tShare("facebook"),
              copy: tShare("copy"),
              copied: tShare("copied"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
