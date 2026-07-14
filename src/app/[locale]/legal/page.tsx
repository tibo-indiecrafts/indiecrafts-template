import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { features, isPageVisible, pages, type Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/layout/DefaultLayout";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.legal, locale });
}

/**
 * Legal page — privacy + cookies + terms. Gated by `features.legalPage`.
 * Content comes from `messages.<locale>.pages.legal.*`. Add or remove
 * sections by adjusting both the JSON keys and the `SECTIONS` list below.
 */
const SECTIONS = ["privacy", "cookies", "terms", "contact"] as const;

export default async function LegalPage({ params }: Props) {
  if (!features.legalPage || !isPageVisible(pages.legal)) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.legal");

  return (
    <DefaultLayout>
      <PageSchemas page={pages.legal} locale={locale} />
      <article className="mx-auto max-w-2xl px-(--gutter) py-16 md:py-24">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">{t("lastUpdated")}</p>
        </header>

        {SECTIONS.map((id) => (
          <section key={id} className="mb-10 last:mb-0">
            <h2 className="mb-3 text-xl font-semibold md:text-2xl">
              {t(`sections.${id}.heading`)}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(`sections.${id}.body`)}
            </p>
          </section>
        ))}
      </article>
    </DefaultLayout>
  );
}
