import { getTranslations } from "next-intl/server";
import type { Locale } from "@indiecrafts/config";
import type { CookieRow } from "../consent/consent-signals";
import { getCookieConsent } from "../sanity/cookies";
import { ManagePreferencesButton } from "../consent/ManagePreferencesButton";

/**
 * The cookie declaration table, rendered on the cookie-policy page from the Sanity
 * `cookieConsent.cookies` inventory, grouped by consent category. Cards (not a
 * horizontal-scroll table) so it reflows cleanly on mobile (per DESIGN.md).
 */
export async function CookieDeclaration({ locale }: { locale: Locale }) {
  const [{ categories, cookies }, t] = await Promise.all([
    getCookieConsent(locale),
    getTranslations("cookies"),
  ]);
  if (cookies.length === 0) return null;

  // Category order first, then any cookies whose category isn't declared.
  const orderedKeys = [
    ...categories.map((c) => c.key),
    ...cookies
      .map((c) => c.category)
      .filter((k) => !categories.some((c) => c.key === k)),
  ];
  const titleFor = (key: string) =>
    categories.find((c) => c.key === key)?.title ?? key;
  const seen = new Set<string>();

  return (
    <section aria-labelledby="cookie-declaration" className="mt-12">
      <h2
        id="cookie-declaration"
        className="text-xl font-semibold tracking-tight"
      >
        {t("declarationTitle")}
      </h2>

      {orderedKeys.map((key) => {
        if (seen.has(key)) return null;
        seen.add(key);
        const rows = cookies.filter((c) => c.category === key);
        if (rows.length === 0) return null;
        return (
          <div key={key} className="mt-6">
            <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              {titleFor(key)}
            </h3>
            <ul className="mt-3 space-y-2">
              {rows.map((row) => (
                <CookieCard
                  key={row.name}
                  row={row}
                  party={t(`party.${row.party ?? "first"}`)}
                />
              ))}
            </ul>
          </div>
        );
      })}

      <div className="mt-8">
        <ManagePreferencesButton label={t("manage")} />
      </div>
    </section>
  );
}

function CookieCard({ row, party }: { row: CookieRow; party: string }) {
  const meta = [row.provider, row.duration, party].filter(Boolean).join(" · ");
  return (
    <li className="ring-border/60 rounded-lg p-3 text-sm ring-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <code className="font-medium">{row.name}</code>
        <span className="text-muted-foreground text-xs">{meta}</span>
      </div>
      {row.purpose ? (
        <p className="text-muted-foreground mt-1">{row.purpose}</p>
      ) : null}
    </li>
  );
}
