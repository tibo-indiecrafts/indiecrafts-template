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
  common: {
    previous: "Previous",
    next: "Next",
    skipToContent: "Skip to content",
    // Website LocaleSwitcher reads `common.changeLanguage`.
    changeLanguage: "Change language",
    // Website ThemeToggle.
    switchTheme: "Switch theme",
    themeLight: "Light",
    themeDark: "Dark",
  },
  // QuoteList reads t.raw("quoteStyle.primary") → [open, close] marks.
  typography: { "quoteStyle.primary": ["« ", " »"] },
  // Website Footer / MadeByCredit.
  footer: {
    rights: "All rights reserved.",
    creditPrefix: "Made with",
    previewLabel: "tap to preview the site",
    follow: "Follow",
  },
  // Website Footer's CCPA "Do Not Sell" link.
  cookies: { "doNotSell.link": "Do Not Sell or Share My Personal Information" },
  // Website Header.
  nav: { home: "Home" },
  // Website FeaturedArticles reads `pages.blog.playVideo` (a different namespace
  // string than `pages.blog.gallery` above, so a separate top-level entry).
  "pages.blog": { playVideo: "Play video" },
  // Website homepage showcases — namespace is passed as a prop per section.
  "pages.home.blocks.icons": {
    eyebrow: "Icons",
    title: "One interface, three icon sets",
    body: "Lucide for UI glyphs, Reicon for outline and filled weights, and Reicon Brands for logos in their official colors.",
    lucide: "Lucide — UI glyphs",
    reicon: "Reicon — outline + filled",
    brands: "Reicon Brands — official colors",
  },
  "pages.home.blocks.morphicons": {
    eyebrow: "Motion",
    title: "Icons that morph, not swap",
    body: "Morphicons animates the transition between any two icons — the shape flows from one shape to the next instead of cutting.",
    hint: "Tap any icon to morph it. Honors reduced-motion.",
    "icons.menu": "Menu / close",
    "icons.play": "Play / pause",
    "icons.theme": "Light / dark",
    "icons.volume": "Volume / muted",
    "icons.bell": "Notifications on / off",
    "icons.copy": "Copy / copied",
  },
  "pages.home.blocks.blocks": {
    eyebrow: "Page builder",
    title: "The same blocks, everywhere",
    body: "Marketing pages and blog posts render one shared set of components — author in Sanity, and it looks identical wherever it lands.",
  },
  // Website ContentResearchAgent.
  agent: {
    title: "AI content research",
    description:
      "Give the agent a goal — it drafts 5 article ideas for you to review. It suggests; you decide.",
    goalLabel: "Your goal",
    goalPlaceholder: "e.g. article ideas for freelance designers about AI tools",
    submit: "Generate ideas",
    submitting: "Working…",
    error: "Something went wrong. Please try again.",
    reviewNote: "Draft ideas — review before you use them.",
    empty: "No ideas returned. Try a more specific goal.",
    "field.reader": "Reader",
    "field.problem": "Problem",
    "field.intent": "Search intent",
    "field.headline": "Headline",
    "field.why": "Why",
  },
  // App ShellOverlays' LegalGate reads `legal.reaccept.*` (renders by default —
  // a fresh visitor has no stored legal-acceptance record).
  "legal.reaccept": {
    title: "Our legal documents changed",
    body: "Please review and accept the updated terms.",
    review: "Review",
    accept: "Accept",
  },
  // App ShellOverlays' UpdatePrompt copy — evaluated eagerly as JSX props even
  // when the prompt itself doesn't render (no update pending in Storybook).
  version: {
    message: "A new version is available.",
    reload: "Reload",
    dismiss: "Dismiss",
  },
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

/** Server API — `next-intl/server`'s async locale reader. */
export async function getLocale() {
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
    href,
  }: {
    children?: ReactNode;
    className?: string;
    href?: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} className={className}>
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
  getLocale,
  NextIntlClientProvider,
  createNavigation,
};
