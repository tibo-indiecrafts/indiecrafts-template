/**
 * `@/config` — this admin app's config home. Re-exports the shared WEB config
 * primitives from `@indiecrafts/packages-shared-config` (i18n · format · env/CSP · site env ·
 * logging · the page-config contract). Add admin-owned **instance** config here
 * — feature flags, nav, theme — so it ships its own, not the shared package's.
 *
 * Rule: admin app code imports from `@/config`; packages/modules import
 * `@indiecrafts/packages-shared-config` directly. See `code/docs/shared/architecture/multi-app.md`.
 */
export * from "@indiecrafts/packages-shared-config";
