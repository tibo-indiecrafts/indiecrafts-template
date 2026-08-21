import { setRequestLocale, getTranslations } from "next-intl/server";
import { site, type Locale } from "@/config";
import {
  LEGAL_PAGE_KEYS,
  legalUrl,
} from "@indiecrafts/packages-shared-compliance/shared";

// Legal link-out — the canonical legal pages live on the marketing website; this lists
// them and opens each there (`legalUrl(site.websiteUrl, …)`, cross-origin). No content
// re-hosting: a plain `<a>` (not the typed `Link`) because the target is another origin.
export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-6 p-8">
      <h1 className="text-foreground text-2xl font-semibold">{t("heading")}</h1>
      <ul className="flex flex-col gap-2">
        {LEGAL_PAGE_KEYS.map((key) => (
          <li key={key}>
            <a
              href={legalUrl(site.websiteUrl, key, locale as Locale)}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              {t(key)}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
