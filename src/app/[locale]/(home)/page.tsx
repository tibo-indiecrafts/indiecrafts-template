import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { features, isPageVisible, pages } from "@/config";
import type { Locale } from "@/config";
import { buildMetadata } from "@/lib/metadata";
import { PageSchemas } from "@/lib/seo/jsonld";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";
import { Features } from "@/user-interface/homepage/sections/Features";
import { Faq } from "@/user-interface/homepage/sections/Faq";
import { Cta } from "@/user-interface/homepage/sections/Cta";
import { Pricing } from "@/user-interface/homepage/sections/Pricing";
import { Testimonials } from "@/user-interface/homepage/sections/Testimonials";
import { FeaturedArticles } from "@/user-interface/homepage/sections/FeaturedArticles";
import { IconShowcase } from "@/user-interface/homepage/sections/IconShowcase";
import { client } from "@/sanity/client";
import { featuredPostsQuery } from "@/features/blog/sanity/queries";
import type { PostListItem } from "@/features/blog/sanity/types";

/**
 * Production home page. Section components live in `src/user-interface/sections/`
 * and are mounted with a single `namespace` prop pointing at
 * `pages.home.blocks.<name>` in `messages/<locale>.json`. The section reads
 * its own `title`, `body`, `items`, etc. relative to that namespace.
 *
 * To swap in a new section variant: browse the sibling library repo
 * (`indiecrafts-library`, `pnpm storybook`), copy the section file into
 * `src/user-interface/sections/`, drop its block keys into messages/, mount here.
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

  // Featured articles — only when the blog feature is on. Uses the static
  // `client` (not `sanityFetchLive`) so the home page stays prerendered.
  // `tf` is resolved unconditionally so the hooks-free render stays simple.
  const tf = await getTranslations("pages.home.blocks.featured");
  const featured: PostListItem[] = features.blog
    ? (await client.fetch(featuredPostsQuery, { locale })).slice(0, 4)
    : [];

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

      <IconShowcase id="home-icons" namespace="pages.home.blocks.icons" />

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

      {featured.length > 0 ? (
        <FeaturedArticles
          id="home-featured"
          posts={featured}
          locale={locale}
          eyebrow={tf("eyebrow")}
          title={tf("title")}
          body={tf("body")}
          viewAllLabel={tf("viewAll")}
        />
      ) : null}

      <Faq pageId="home" />
    </DefaultLayout>
  );
}
