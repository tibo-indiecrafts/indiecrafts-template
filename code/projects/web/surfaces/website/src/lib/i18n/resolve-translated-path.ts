import type { TranslatedPathResolver } from "@indiecrafts/i18n";

/**
 * The app's content-route → translated-path resolver, injected into the shared
 * locale switcher (`@indiecrafts/i18n`) via `LocaleSwitchProvider`. Keeps the blog
 * route taxonomy + the `/api/i18n/translated-slug` endpoint in the APP, not the
 * foundation shim. Returns the target-locale path (or `/` homepage) for a content
 * detail route whose slug differs per language; `null` for anything else (→ the
 * switcher just re-prefixes the current path).
 */
export const resolveTranslatedPath: TranslatedPathResolver = async (
  pathname,
  from,
  to,
) => {
  const type = /^\/blog\/category\/[^/]+$/.test(pathname)
    ? "category"
    : /^\/blog\/tag\/[^/]+$/.test(pathname)
      ? "tag"
      : /^\/blog\/series\/[^/]+$/.test(pathname)
        ? "series"
        : /^\/author\/[^/]+$/.test(pathname)
          ? "author"
          : /^\/blog\/[^/]+$/.test(pathname) &&
              !/^\/blog\/(category|tag|series)$/.test(pathname)
            ? "post"
            : null;
  if (!type) return null; // not a content-detail route → caller re-prefixes

  const slug = pathname.split("/").pop() ?? "";
  try {
    const res = await fetch(
      `/api/i18n/translated-slug?type=${type}&slug=${encodeURIComponent(slug)}&from=${from}&to=${to}`,
    );
    const data = (await res.json()) as { path: string | null };
    return data.path ?? "/"; // no translation → the target-locale homepage
  } catch {
    return "/";
  }
};
