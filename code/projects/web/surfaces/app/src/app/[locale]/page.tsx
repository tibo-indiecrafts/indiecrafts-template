import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

// App home. Server component; `setRequestLocale` keeps it statically rendered. Build
// real pages from `@indiecrafts/packages-web-ui` primitives; strings live in messages/.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("app");

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-foreground text-4xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      <Link href="/legal" className="text-primary text-sm underline underline-offset-4">
        {t("legalLink")}
      </Link>
    </main>
  );
}
