/**
 * Renders the contact landing page from the contactSettings singleton.
 *
 * @see docs/reference/modules/web/contact/src/user-interface/ContactLanding.md
 */
import {
  defaultLocale,
  type Locale,
} from "@indiecrafts/packages-shared-config";
import { ContactForm } from "@indiecrafts/packages-web-ui-components/web/form/ContactForm";
import { getContactSettings } from "../lib/settings";

type LocaleString = Record<string, string | undefined> | null | undefined;
const pick = (value: LocaleString, locale: string) =>
  value?.[locale] ?? value?.[defaultLocale] ?? undefined;

/**
 * Contact landing view — the module owns the page's content: copy resolved from
 * the `contactSettings` singleton per locale, rendered as the same `ContactForm`
 * the block uses. The app route wraps this in the site chrome (`DefaultLayout`) and
 * owns the feature gate + SEO. No app imports (module → package only).
 */
export async function ContactLanding({ locale }: { locale: Locale }) {
  const settings = await getContactSettings();
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden px-(--gutter) py-20 md:py-28">
      <div
        aria-hidden="true"
        className="bg-brand/10 pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />
      <ContactForm
        heading={pick(settings?.heading, locale)}
        body={pick(settings?.description, locale)}
        namePlaceholder={pick(settings?.nameLabel, locale)}
        subjectPlaceholder={pick(settings?.subjectLabel, locale)}
        messagePlaceholder={pick(settings?.messageLabel, locale)}
        buttonLabel={pick(settings?.buttonLabel, locale)}
        consentText={pick(settings?.consentLabel, locale)}
        successMessage={pick(settings?.successMessage, locale)}
        variant="card"
        headingAs="h1"
      />
    </section>
  );
}
