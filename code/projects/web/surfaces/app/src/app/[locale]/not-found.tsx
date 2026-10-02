/**
 * Render the app's localized 404 screen with the configured logo.
 *
 * @see docs/reference/projects/web/app/src/app/locale/not-found.md
 */
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NotFoundContent } from "@indiecrafts/packages-web-system-pages/web";
import { Link } from "@/i18n/routing";
import { getBrand } from "@/lib/brand";
import { BrandMark } from "@/user-interface/BrandMark";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("title"), robots: { index: false, follow: false } };
}

/** 404 (also inside the mobile shell): the Sanity logo + bundled copy. */
export default async function NotFound() {
  const [t, brand] = await Promise.all([
    getTranslations("notFound"),
    getBrand(),
  ]);
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center outline-none"
    >
      <NotFoundContent
        brand={<BrandMark brand={brand} />}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        homeLabel={t("homeLabel")}
        LinkComponent={Link}
      />
    </main>
  );
}
