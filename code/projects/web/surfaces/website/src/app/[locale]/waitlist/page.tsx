import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { features, pages, type Locale } from "@/config";
import { getWaitlistSettings } from "@indiecrafts/waitlist/lib/settings";
import { WaitlistLanding } from "@indiecrafts/waitlist/user-interface/WaitlistLanding";
import { buildMetadata } from "@/lib/metadata";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.waitlist, locale });
}

/**
 * Waitlist landing route — thin shell. The gate + chrome + SEO live here; the
 * view (copy resolved from Sanity `waitlistSettings`) lives in the module. Gated
 * by `features.waitlist` + the editor `enabled` toggle (both 404 when off). SEO
 * copy is Sanity-only, on the `waitlistSettings` singleton's `.seo`.
 */
export default async function WaitlistPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.waitlist) notFound();

  const settings = await getWaitlistSettings();
  if (settings?.enabled === false) notFound();

  return (
    <DefaultLayout>
      <WaitlistLanding locale={locale} />
    </DefaultLayout>
  );
}
