/**
 * Feature flags — three tiers:
 *   - Global: app-wide toggles (analytics, cookie banner, etc.)
 *   - Modules: group-wide toggles that gate whole subsystems (blog, shop…)
 *   - Per-page: set via `enabled` on each PageConfig and per section
 *
 * A page can be hidden site-wide by `enabled: false` on its PageConfig, OR
 * by its module flag being false. Route files check both and call `notFound()`.
 */

export const features = {
  analytics: false,
  newsletter: false,
  cookieBanner: false,
  /** Enables the /llms.txt route. */
  llmsTxt: true,
  /** Shows the locale switcher in the header. */
  localeSwitcher: true,

  /**
   * Modules — toggle entire feature groups. Pages belonging to a disabled
   * module return 404 regardless of their own `enabled` flag.
   * Tag a page with its module by setting `moduleKey: "<key>"` in its PageConfig.
   */
  modules: {
    blog: false,
    shop: false,
    search: false,
    comments: false,
  },
} as const;

export type GlobalFeatureFlag = Exclude<keyof typeof features, "modules">;
export type ModuleKey = keyof typeof features.modules;

export function isFeatureEnabled(flag: GlobalFeatureFlag): boolean {
  return features[flag] as boolean;
}

export function isModuleEnabled(key: ModuleKey): boolean {
  return features.modules[key];
}

/**
 * Combined gate used by page route files and the sitemap.
 *
 * - `enabled: false` → 404.
 * - `moduleKey: "blog"` (singular) OR `moduleKeys: ["blog", "comments"]`
 *   (array) → the page is hidden when ANY listed module flag is off. Both
 *   fields can be set; they union together.
 */
export function isPageVisible<
  T extends {
    enabled?: boolean;
    moduleKey?: ModuleKey;
    moduleKeys?: readonly ModuleKey[];
  },
>(input: T): boolean {
  if (input.enabled === false) return false;
  const needed: ModuleKey[] = [];
  if (input.moduleKey) needed.push(input.moduleKey);
  if (input.moduleKeys) needed.push(...input.moduleKeys);
  for (const k of needed) {
    if (!isModuleEnabled(k)) return false;
  }
  return true;
}

/**
 * Boot-time sanity check — warns on obviously-broken combinations so typos
 * surface at `pnpm dev` instead of silently returning 404.
 */
export function validateFeatureFlags(): string[] {
  const warnings: string[] = [];
  if (features.cookieBanner && !features.analytics) {
    warnings.push(
      "features.cookieBanner is ON but features.analytics is OFF — no cookies to gate.",
    );
  }
  return warnings;
}
