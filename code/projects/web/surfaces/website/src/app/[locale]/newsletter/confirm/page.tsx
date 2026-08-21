import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { features, type Locale } from "@/config";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { NewsletterConfirm } from "@/user-interface/shared/components/NewsletterConfirm";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.newsletterConfirm" });
  // A one-time confirm callback — never index it (still followable for crawlers).
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: true },
  };
}

/**
 * Double opt-in confirm page. The confirmation email links here with a one-time
 * `token`; rendering never mutates — the visitor taps a button that POSTs the
 * token to `/api/newsletter/confirm`, so a link prefetcher / mail scanner can't
 * auto-confirm. Gated by `features.newsletter` (404 when off). Not in the `pages`
 * map — a callback, kept out of the sitemap / llms / SEO machinery.
 */
export default async function NewsletterConfirmPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.newsletter) notFound();

  const rawToken = (await searchParams).token;
  const token = (Array.isArray(rawToken) ? (rawToken[0] ?? "") : (rawToken ?? "")).trim();
  const t = await getTranslations("pages.newsletterConfirm");

  return (
    <DefaultLayout>
      <section className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 px-(--gutter) py-24 text-center md:py-32">
        <NewsletterConfirm
          token={token}
          labels={{
            heading: t("heading"),
            body: t("body"),
            button: t("button"),
            confirmedHeading: t("confirmedHeading"),
            confirmedBody: t("confirmedBody"),
            invalidHeading: t("invalidHeading"),
            invalidBody: t("invalidBody"),
            homeCta: t("homeCta"),
          }}
        />
      </section>
    </DefaultLayout>
  );
}
