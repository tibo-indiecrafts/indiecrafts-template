# @indiecrafts/web-tools-storybook — the component gallery (Storybook)

Auto-loads under `code/projects/web/tools/storybook/**`. The **design-system gallery** — a browse-only
Storybook that documents the shared UI bricks across **all three renderers**: web (`ui` · `ui-components` ·
`ui-tokens` + `announcement` / `locale-suggest`), the **native** design system (`ui-native` ·
`system-pages/native` · `ui-icons/native`) rendered in the browser via the `react-native` →
`react-native-web` alias, and the cross-platform `system-pages` / `ui-icons` web renderers. A workspace
member that **consumes** the bricks; it ships nothing to production.

**Stack:** Storybook (`@storybook/nextjs-vite`) · Vite · Tailwind v4 (`@tailwindcss/vite`) · addons
`a11y` · `docs` · `themes` · `vitest`. **Platform:** a static build (`storybook build`), not deployed with
the Cloudflare apps.

## Run

```bash
pnpm --filter @indiecrafts/web-tools-storybook storybook        # dev gallery on :6006
pnpm --filter @indiecrafts/web-tools-storybook storybook:build  # static → storybook-static/
pnpm --filter @indiecrafts/web-tools-storybook test:stories     # every story as a component + a11y test (Vitest, headless Chromium)
```

`test:stories` is the visual/interaction gate (the repo's "visual = colocated stories" rule); it **blocks**
in the CI `browser-stories` job (web **and** native stories, the latter via the `react-native` →
`react-native-web` alias in `.storybook/main.ts`). It is not in the default `verify` — it needs a browser,
so it lives in its own Playwright-provisioned job, not the browserless `verify`.

## Rules

- **Browse-only — the decoupling is the design.** The app **copies** a component from here then adapts it
  to template conventions; it **never** imports this package or depends on it at runtime (root `CLAUDE.md`
  NEVER). Stories reference the real bricks so the gallery stays honest.
- **Stories live in `stories/`.** Add a story when a brick gains a variant worth documenting; keep the
  a11y addon green.
- **Next-coupled bricks are mocked** for the gallery (`.storybook/next-intl-mock.tsx`, `shiki-mock.ts`) —
  the gallery is Vite, not Next; mock the Next/CMS edges, don't pull them in.
- Log gallery/story/config changes in this app's `CHANGELOG.md` (home altitude); roll up to root at release.

Human-facing reference → [`code/docs/packages/storybook.md`](../../../../../docs/packages/storybook.md).
