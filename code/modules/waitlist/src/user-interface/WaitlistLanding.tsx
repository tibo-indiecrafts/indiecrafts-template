import { defaultLocale, type Locale } from "@indiecrafts/config";
import { WaitlistForm } from "@indiecrafts/ui-components/web/form/WaitlistForm";
import { getWaitlistSettings } from "../lib/settings";

type LocaleString = Record<string, string | undefined> | null | undefined;
const pick = (value: LocaleString, locale: string) =>
  value?.[locale] ?? value?.[defaultLocale] ?? undefined;

/**
 * Waitlist landing view — the module owns the page's content: copy resolved from
 * the `waitlistSettings` singleton per locale, rendered as the same `WaitlistForm`
 * the block uses. The app route wraps this in the site chrome (`DefaultLayout`) and
 * owns the feature gate + SEO. No app imports (module → package only).
 */
export async function WaitlistLanding({ locale }: { locale: Locale }) {
  const settings = await getWaitlistSettings();
  return (
    <section className="relative grid min-h-[70vh] place-items-center overflow-hidden px-(--gutter) py-20 md:py-28">
      <div
        aria-hidden="true"
        className="bg-brand/10 pointer-events-none absolute top-1/3 left-1/2 -z-10 size-[42rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      />
      <WaitlistForm
        heading={pick(settings?.heading, locale)}
        body={pick(settings?.description, locale)}
        namePlaceholder={pick(settings?.nameLabel, locale)}
        buttonLabel={pick(settings?.buttonLabel, locale)}
        consentText={pick(settings?.consentLabel, locale)}
        successMessage={pick(settings?.successMessage, locale)}
        variant="card"
      />
    </section>
  );
}
