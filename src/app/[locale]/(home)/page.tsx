import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isPageVisible, pages } from "@/config";
import type { Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/app/layout/DefaultLayout";
import { Features } from "@/components/sections/Features";
import { Cta } from "@/components/sections/Cta";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";

/**
 * Production home page. Section components live in `src/components/sections/`
 * and are mounted with a single `namespace` prop pointing at
 * `pages.home.blocks.<name>` in `messages/<locale>.json`. The section reads
 * its own `title`, `body`, `items`, etc. relative to that namespace.
 *
 * To swap in a new section variant: browse the sibling library repo
 * (`indiecrafts-library`, `pnpm storybook`), copy the section file into
 * `src/components/sections/`, drop its block keys into messages/, mount here.
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.home, locale });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isPageVisible(pages.home)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("pages.home");

  return (
    <DefaultLayout>
      <PageSchemas page={pages.home} locale={locale} />
      <h1 className="sr-only">{t("title")}</h1>

      <Features
        type="features"
        id="home-features"
        namespace="pages.home.blocks.features"
        items={[
          { id: "customizable", iconKey: "zap" },
          { id: "fullControl", iconKey: "settings" },
          { id: "poweredByAi", iconKey: "sparkles" },
        ]}
      />

      <Cta type="cta" id="home-cta" namespace="pages.home.blocks.cta" />

      <Pricing
        type="pricing"
        id="home-pricing"
        namespace="pages.home.blocks.pricing"
        tiers={[
          {
            id: "free",
            cta: { href: "/" },
            featureIds: ["analytics", "storage", "support"],
          },
          {
            id: "pro",
            cta: { href: "/" },
            highlighted: true,
            featureIds: [
              "everything",
              "community",
              "singleUser",
              "templates",
              "mobile",
              "reports",
              "updates",
              "security",
            ],
          },
          {
            id: "startup",
            cta: { href: "/" },
            featureIds: ["everything", "storage", "support"],
          },
        ]}
      />

      <Testimonials
        type="testimonials"
        id="home-testimonials"
        namespace="pages.home.blocks.testimonials"
        quotes={[
          {
            id: "lovelace",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
          },
        ]}
      />
    </DefaultLayout>
  );
}
