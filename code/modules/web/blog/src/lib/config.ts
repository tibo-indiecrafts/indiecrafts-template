/**
 * Hold the blog island's app-injected feature flags and page entry.
 *
 * @see docs/reference/modules/web/blog/src/lib/config.md
 */
import type { PageConfig } from "@indiecrafts/packages-shared-config";

/**
 * The blog island's compiled config — the feature flags + the `/blog` page entry
 * this app mounts the blog with. **The app owns these** (`@/config`); the module
 * can't import an app, so the app injects them once via `configureBlog()`.
 *
 * The blog's route-gate + settings + llms read these instead of a central
 * `features`/`pages` registry, so a second app can mount the same blog island with
 * a different feature set. Defaults below = the template's shipped set, so a single
 * app is correct even before `configureBlog` runs; the app overrides at boot.
 *
 * Stored on `globalThis`, not in a module variable: Next bundles `instrumentation.ts`
 * apart from the routes, so each loads its own copy of this file, and a module
 * variable set at boot never reached the routes (every flag stayed on). A
 * multi-runtime host (e.g. Vercel node+edge split) must still call configureBlog in
 * each runtime — `instrumentation.ts` runs per runtime.
 */
export type BlogFlags = {
  blog: boolean;
  rss: boolean;
  comments: boolean;
  search: boolean;
  series: boolean;
  taxonomy: { authors: boolean; categories: boolean; tags: boolean };
};

type BlogConfig = { flags: BlogFlags; blogPage: PageConfig };

const DEFAULTS: BlogConfig = {
  flags: {
    blog: true,
    rss: true,
    comments: true,
    search: true,
    series: true,
    taxonomy: { authors: true, categories: true, tags: true },
  },
  blogPage: { key: "/blog", id: "blog", slug: "/blog" },
};

const KEY = Symbol.for("indiecrafts.blog.config");
const store = globalThis as { [KEY]?: BlogConfig };

/** Called once by the app at boot (instrumentation.ts) with its own `@/config`. */
export function configureBlog(cfg: BlogConfig): void {
  store[KEY] = cfg;
}

/** The blog's compiled feature flags for this app. */
export const blogFlags = (): BlogFlags => (store[KEY] ?? DEFAULTS).flags;

/** The `/blog` page entry for this app (id / slug / enabled). */
export const blogPage = (): PageConfig => (store[KEY] ?? DEFAULTS).blogPage;
