"use client";

import type { Locale } from "@indiecrafts/config";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "./index";

/**
 * Shared locale switcher — swaps the URL locale (next-intl re-prefixes as-needed).
 * Blog detail slugs differ per language, so post/category/tag routes resolve their
 * counterpart via `/api/i18n/translated-slug`, falling back to the target locale's
 * home when there's no translation. Used by the app's `LocaleSwitcher` and the
 * `@indiecrafts/locale-suggest` banner so the logic lives in one place.
 */
export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname(); // locale-stripped, e.g. "/blog/my-post"
  const current = useLocale();

  return async function switchTo(next: string): Promise<void> {
    const type = /^\/blog\/category\/[^/]+$/.test(pathname)
      ? "category"
      : /^\/blog\/tag\/[^/]+$/.test(pathname)
        ? "tag"
        : /^\/blog\/[^/]+$/.test(pathname) && !/^\/blog\/(category|tag)$/.test(pathname)
          ? "post"
          : null;

    if (type) {
      const slug = pathname.split("/").pop() ?? "";
      let path = "/"; // no counterpart in the target locale → its homepage
      try {
        const res = await fetch(
          `/api/i18n/translated-slug?type=${type}&slug=${encodeURIComponent(slug)}&from=${current}&to=${next}`,
        );
        const data = (await res.json()) as { path: string | null };
        if (data.path) path = data.path;
      } catch {
        // keep the homepage fallback
      }
      router.replace(path, { locale: next as Locale });
      return;
    }

    router.replace(pathname, { locale: next as Locale });
  };
}
