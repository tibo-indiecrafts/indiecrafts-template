/**
 * Render the contact landing page shell.
 *
 * @see docs/reference/projects/web/website/src/app/locale/contact/page.md
 */
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { features, pages, type Locale } from "@/config";
import { getContactSettings } from "@indiecrafts/modules-web-contact/lib/settings";
import { ContactLanding } from "@indiecrafts/modules-web-contact/user-interface/ContactLanding";
import { buildMetadata } from "@/lib/metadata";
import { DefaultLayout } from "@/user-interface/shared/layout/DefaultLayout";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildMetadata({ page: pages.contact, locale });
}

/**
 * Contact landing route — thin shell. The gate + chrome + SEO live here; the
 * view (copy resolved from Sanity `contactSettings`) lives in the module. Gated
 * by `features.contact` + the editor `enabled` toggle (both 404 when off). SEO
 * copy is Sanity-only, on the `contactSettings` singleton's `.seo`.
 */
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!features.contact) notFound();

  const settings = await getContactSettings();
  if (settings?.enabled === false) notFound();

  return (
    <DefaultLayout>
      <ContactLanding locale={locale} />
    </DefaultLayout>
  );
}
