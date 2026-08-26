/**
 * Storybook mock for `next-intl` (+ `/server`, `/navigation`). Aliased in
 * main.ts so client components that read translations resolve to a static
 * message map — no real i18n request or provider. Only the keys the storied
 * surface components read are supplied; unknown keys echo back the key.
 */
import type { ReactNode } from "react";

type Values = Record<string, string | number>;

const MESSAGES: Record<string, Record<string, unknown>> = {
  // LocaleSwitcher reads `common.changeLanguage`.
  common: { changeLanguage: "Change language", previous: "Previous", next: "Next" },
  // AuthMenu reads `nav.signIn` (signed-out branch).
  nav: { signIn: "Sign in" },
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
 * `next-intl/navigation` stub. `@indiecrafts/packages-web-i18n` builds
 * `Link` / `useRouter` / `usePathname` via `createNavigation`; in Storybook
 * there is no Next router, so return inert hooks (a plain `<a>` for `Link`) —
 * enough to render the locale switcher, with navigation a no-op.
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
    href = "/",
  }: {
    children?: ReactNode;
    className?: string;
    href?: string;
    [key: string]: unknown;
  }) {
    return (
      <a className={className} href={typeof href === "string" ? href : "/"}>
        {children}
      </a>
    );
  }
  return { Link, redirect, usePathname, useRouter, getPathname };
}

const nextIntlMock = {
  useTranslations,
  getTranslations,
  useLocale,
  NextIntlClientProvider,
  createNavigation,
};

export default nextIntlMock;
