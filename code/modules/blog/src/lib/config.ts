import type { PageConfig } from "@indiecrafts/config";

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
 * ponytail: module-scoped config, one server runtime (dev + Cloudflare Workers,
 * the deploy target). A multi-runtime host (e.g. Vercel node+edge split) must call
 * configureBlog in each runtime — do it in `instrumentation.ts` (runs per runtime).
 */
export type BlogFlags = {
  blog: boolean;
  rss: boolean;
  comments: boolean;
  search: boolean;
  series: boolean;
  taxonomy: { authors: boolean; categories: boolean; tags: boolean };
};

let flagsRef: BlogFlags = {
  blog: true,
  rss: true,
  comments: true,
  search: true,
  series: true,
  taxonomy: { authors: true, categories: true, tags: true },
};

let blogPageRef: PageConfig = { key: "/blog", id: "blog", slug: "/blog" };

/** Called once by the app at boot (instrumentation.ts) with its own `@/config`. */
export function configureBlog(cfg: { flags: BlogFlags; blogPage: PageConfig }): void {
  flagsRef = cfg.flags;
  blogPageRef = cfg.blogPage;
}

/** The blog's compiled feature flags for this app. */
export const blogFlags = (): BlogFlags => flagsRef;

/** The `/blog` page entry for this app (id / slug / enabled). */
export const blogPage = (): PageConfig => blogPageRef;
