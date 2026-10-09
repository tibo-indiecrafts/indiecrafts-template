/**
 * Storybook mock for `next-intl` + `next-intl/server`. Aliased in main.ts so
 * renderers that read translations resolve against the website's real
 * `messages/<locale>.json` — no i18n request or provider needed. The Locale
 * toolbar (preview.tsx) calls `setLocale`, so every story renders in en or fr.
 */
import type { ComponentProps, ReactNode } from "react";
import en from "../../../surfaces/website/messages/en.json";
import fr from "../../../surfaces/website/messages/fr.json";

type Values = Record<string, string | number>;

const MESSAGES = { en, fr } as Record<string, unknown>;
export const LOCALES = Object.keys(MESSAGES);

let locale = "en";
/** Set by the Locale toolbar decorator before each render. */
export function setLocale(next: string) {
  locale = next in MESSAGES ? next : "en";
}

const lookup = (obj: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], obj);

const interpolate = (input: string, values?: Values) =>
  values
    ? input.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`))
    : input;

type Translator = ((key: string, values?: Values) => string) & {
  raw: (key: string) => unknown;
};

function makeTranslator(namespace?: string): Translator {
  const dict = namespace ? lookup(MESSAGES[locale], namespace) : MESSAGES[locale];
  const t = ((key: string, values?: Values) => {
    const val = lookup(dict, key);
    if (typeof val === "string") return interpolate(val, values);
    // Like next-intl in dev: a missing key is loud, and renders its full path.
    const id = namespace ? `${namespace}.${key}` : key;
    console.error(`[next-intl mock] missing message "${id}" in ${locale}.json`);
    return id;
  }) as Translator;
  t.raw = (key: string) => lookup(dict, key);
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
  return locale;
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
  // Keeps `href` (a typed-route object → its `pathname`) and the anchor attributes, so
  // the `<a>` stays a real link (role, focus) for the story's `play` and axe.
  function Link({
    children,
    href,
    locale: _locale,
    prefetch: _prefetch,
    ...rest
  }: Omit<ComponentProps<"a">, "href"> & {
    href?: string | { pathname?: string };
    locale?: string;
    prefetch?: boolean;
  }) {
    return (
      <a href={typeof href === "string" ? href : href?.pathname} {...rest}>
        {children}
      </a>
    );
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
