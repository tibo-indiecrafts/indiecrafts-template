import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isPageVisible, pages } from "@/config";
import type { Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/_chrome/DefaultLayout";
import { Features01Section } from "@/components/sections-features/features-01";
import { CallToActionSection } from "@/components/sections-cta/cta-01";
import { Pricing01Section } from "@/components/sections-pricing/pricing-01";
import { Testimonials01Section } from "@/components/sections-testimonials/testimonials-01";

/**
 * Production home page. Everything route-specific lives in this folder:
 *   - `page.config.ts` — key, slug, id, SEO (pure data, imported by routing
 *      + sitemap)
 *   - `page.tsx` (this file) — generateMetadata + the React composition
 *
 * The split is required by Next.js's server/client boundary: routing.ts is
 * server-only and importing page.tsx (which transitively touches client
 * components) would mismark this page as client. page.config.ts has no
 * React deps so it crosses freely.
 *
 * Section blocks are mounted with explicit `*Key` props pointing at
 * `pages.home.blocks.<simpleName>.*` in `messages/<locale>.json`. The
 * section components themselves are picked from /components (an examples
 * library — its built-in samples reference `blocks.<name>-NN.*` for
 * Storybook only; production keys live under `pages.<route>.blocks.*`).
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.home, locale });
}

const BLOCKS = "pages.home.blocks";

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.home)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("pages.home");

  return (
    <DefaultLayout>
      <PageSchemas page={pages.home} locale={locale} />
      <h1 className="sr-only">{t("title")}</h1>

      <Features01Section
        type="features-01"
        id="home-features"
        titleKey={`${BLOCKS}.features.title`}
        bodyKey={`${BLOCKS}.features.body`}
        items={[
          {
            iconKey: "zap",
            titleKey: `${BLOCKS}.features.items.customizable.title`,
            bodyKey: `${BLOCKS}.features.items.customizable.body`,
          },
          {
            iconKey: "settings",
            titleKey: `${BLOCKS}.features.items.fullControl.title`,
            bodyKey: `${BLOCKS}.features.items.fullControl.body`,
          },
          {
            iconKey: "sparkles",
            titleKey: `${BLOCKS}.features.items.poweredByAi.title`,
            bodyKey: `${BLOCKS}.features.items.poweredByAi.body`,
          },
        ]}
      />

      <CallToActionSection
        type="cta-01"
        id="home-cta"
        titleKey={`${BLOCKS}.cta.title`}
        bodyKey={`${BLOCKS}.cta.body`}
        emailPlaceholderKey={`${BLOCKS}.cta.emailPlaceholder`}
        submitLabelKey={`${BLOCKS}.cta.submit`}
      />

      <Pricing01Section
        type="pricing-01"
        id="home-pricing"
        titleKey={`${BLOCKS}.pricing.title`}
        bodyKey={`${BLOCKS}.pricing.body`}
        tiers={[
          {
            id: "free",
            nameKey: `${BLOCKS}.pricing.tiers.free.name`,
            priceKey: `${BLOCKS}.pricing.tiers.free.price`,
            periodKey: `${BLOCKS}.pricing.tiers.free.period`,
            descriptionKey: `${BLOCKS}.pricing.tiers.free.description`,
            cta: { labelKey: `${BLOCKS}.pricing.tiers.free.cta`, href: "/" },
            featureKeys: [
              `${BLOCKS}.pricing.tiers.free.features.analytics`,
              `${BLOCKS}.pricing.tiers.free.features.storage`,
              `${BLOCKS}.pricing.tiers.free.features.support`,
            ],
          },
          {
            id: "pro",
            nameKey: `${BLOCKS}.pricing.tiers.pro.name`,
            priceKey: `${BLOCKS}.pricing.tiers.pro.price`,
            periodKey: `${BLOCKS}.pricing.tiers.pro.period`,
            descriptionKey: `${BLOCKS}.pricing.tiers.pro.description`,
            cta: { labelKey: `${BLOCKS}.pricing.tiers.pro.cta`, href: "/" },
            badgeKey: `${BLOCKS}.pricing.tiers.pro.badge`,
            featureKeys: [
              `${BLOCKS}.pricing.tiers.pro.features.everything`,
              `${BLOCKS}.pricing.tiers.pro.features.community`,
              `${BLOCKS}.pricing.tiers.pro.features.singleUser`,
              `${BLOCKS}.pricing.tiers.pro.features.templates`,
              `${BLOCKS}.pricing.tiers.pro.features.mobile`,
              `${BLOCKS}.pricing.tiers.pro.features.reports`,
              `${BLOCKS}.pricing.tiers.pro.features.updates`,
              `${BLOCKS}.pricing.tiers.pro.features.security`,
            ],
          },
          {
            id: "startup",
            nameKey: `${BLOCKS}.pricing.tiers.startup.name`,
            priceKey: `${BLOCKS}.pricing.tiers.startup.price`,
            periodKey: `${BLOCKS}.pricing.tiers.startup.period`,
            descriptionKey: `${BLOCKS}.pricing.tiers.startup.description`,
            cta: { labelKey: `${BLOCKS}.pricing.tiers.startup.cta`, href: "/" },
            featureKeys: [
              `${BLOCKS}.pricing.tiers.startup.features.everything`,
              `${BLOCKS}.pricing.tiers.startup.features.storage`,
              `${BLOCKS}.pricing.tiers.startup.features.support`,
            ],
          },
        ]}
      />

      <Testimonials01Section
        type="testimonials-01"
        id="home-testimonials"
        quotes={[
          {
            id: "lovelace",
            quoteKey: `${BLOCKS}.testimonials.quotes.lovelace.quote`,
            authorKey: `${BLOCKS}.testimonials.quotes.lovelace.author`,
            roleKey: `${BLOCKS}.testimonials.quotes.lovelace.role`,
            // Placeholder portrait from Unsplash — swap for the real client photo.
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
          },
        ]}
      />
    </DefaultLayout>
  );
}
