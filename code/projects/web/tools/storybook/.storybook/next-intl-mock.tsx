/**
 * Storybook mock for `next-intl` + `next-intl/server`. Aliased in main.ts so
 * renderers that read translations resolve to a static message map — no real
 * i18n request or provider needed. Only the keys the design-system renderers
 * actually read are supplied (from the Explore map).
 */
import type { ReactNode } from "react";

type Values = Record<string, string | number>;

const MESSAGES: Record<string, Record<string, unknown>> = {
  "pages.blog.gallery": {
    regionLabel: "Image gallery",
    imageLabel: "Image {n} of {total}",
    open: "Enlarge image {n} of {total}",
    goToImage: "Go to image {n}",
    close: "Close",
    playVideo: "Play video",
  },
  common: { previous: "Previous", next: "Next" },
  // QuoteList reads t.raw("quoteStyle.primary") → [open, close] marks.
  typography: { "quoteStyle.primary": ["« ", " »"] },
};

const interpolate = (input: string, values?: Values) =>
  values
    ? input.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`))
    : input;

type Translator = ((key: string, values?: Values) => string) & {
  raw: (key: string) => unknown;
};

function makeTranslator(namespace?: string): Translator {
  const dict = (namespace && MESSAGES[namespace]) || {};
  const t = ((key: string, values?: Values) => {
    const val = dict[key];
    return typeof val === "string" ? interpolate(val, values) : key;
  }) as Translator;
  t.raw = (key: string) => dict[key];
  return t;
}

/** Client hook. */
export function useTranslations(namespace?: string): Translator {
  return makeTranslator(namespace);
}

/** Server API — accepts `"ns"` or `{ locale, namespace }`. */
export async function getTranslations(
  arg?: string | { locale?: string; namespace?: string },
): Promise<Translator> {
  const namespace = typeof arg === "string" ? arg : arg?.namespace;
  return makeTranslator(namespace);
}

export function useLocale() {
  return "en";
}

export function NextIntlClientProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * `next-intl/navigation` stub. `@indiecrafts/packages-web-i18n` builds `Link` / `useRouter` /
 * `usePathname` via `createNavigation`; in Storybook there is no Next router, so
 * return inert hooks (a plain `<a>` for `Link`) — enough to render the components
 * that call `useLocaleSwitch` (e.g. `LocaleSuggest`), with navigation a no-op.
 */
export function createNavigation() {
  const useRouter = () => ({
    push: () => {},
    replace: () => {},
    refresh: () => {},
    back: () => {},
    forward: () => {},
    prefetch: () => {},
  });
  const usePathname = () => "/";
  const getPathname = () => "/";
  const redirect = () => {};
  function Link({
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
    [key: string]: unknown;
  }) {
    return <a className={className}>{children}</a>;
  }
  return { Link, redirect, usePathname, useRouter, getPathname };
}

export default {
  useTranslations,
  getTranslations,
  useLocale,
  NextIntlClientProvider,
  createNavigation,
};
