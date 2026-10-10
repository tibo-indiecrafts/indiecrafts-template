/**
 * List the marketing site's legal pages as external links.
 *
 * @see docs/reference/projects/web/app/src/app/locale/(app)/legal/page.md
 */
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardContent } from "@indiecrafts/packages-web-ui/web/card";
import { site, type Locale } from "@/config";
import {
  LEGAL_PAGE_KEYS,
  legalUrl,
} from "@indiecrafts/packages-shared-compliance/shared";
import { PageHeader } from "@/user-interface/layout/PageHeader";

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
    <div className="p-4 md:p-6">
      <PageHeader title={t("heading")} />
      <Card>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
