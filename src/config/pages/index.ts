/**
 * Page registry barrel — wraps the auto-generated route table with a few
 * stable helpers. The generated file (`registry.generated.ts`) lists every
 * `page.config.ts` discovered under `src/app/[locale]/` and pre-computes
 * the next-intl PATHNAMES table with per-locale slugs preserved.
 *
 * Adding a route is now: drop a `page.config.ts`, run `pnpm gen:routes`.
 * No manual edits to this file or `routes.types.ts`.
 */

import type { PageConfig } from "./types";
import {
  PAGES,
  PATHNAMES,
  homePage,
  aboutPage,
  dashboardPage,
  forgotPasswordPage,
  loginPage,
  signupPage,
} from "./registry.generated";

export { PAGES, PATHNAMES };
export { homePage, aboutPage, dashboardPage, forgotPasswordPage, loginPage, signupPage };

export const pages: readonly PageConfig[] = PAGES;

export type PageKey = (typeof PAGES)[number]["key"];

export function getPageByKey<K extends PageKey>(key: K): PageConfig {
  const page = pages.find((p) => p.key === key);
  if (!page) {
    throw new Error(`[pages] No page registered for key "${key}"`);
  }
  return page;
}
