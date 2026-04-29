"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LOCALE_ABBREVIATIONS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/config/locales.config";
import { localeSwitcherNamespace } from "./config";

/**
 * Client-side language switcher. Replaces the `[locale]` prefix on the current
 * URL rather than using next-intl's typed router, which lets us switch without
 * knowing the static pathname ahead of time — important for pages with dynamic
 * segments like /blog/[slug].
 */
export function LocaleSwitcher() {
  const t = useTranslations(localeSwitcherNamespace);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const current = useLocale() as Locale;

  function switchTo(next: Locale) {
    const segments = pathname.split("/");
    // `pathname` starts with "/"; segments[0] is "". When a non-default locale
    // is active, segments[1] is the locale slug. Default locale: no prefix.
    if (params.locale && segments[1] === params.locale) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.replace(segments.join("/") || "/");
  }

  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t("label")}</span>
      <select
        value={current}
        onChange={(e) => switchTo(e.target.value as Locale)}
        className="bg-background focus-visible:ring-ring cursor-pointer appearance-none rounded-md border px-3 py-1.5 pr-8 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_ABBREVIATIONS[l]} — {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="text-muted-foreground pointer-events-none absolute right-2 size-4"
        fill="currentColor"
      >
        <path d="M5.5 7.5 10 12l4.5-4.5H5.5Z" />
      </svg>
    </label>
  );
}
