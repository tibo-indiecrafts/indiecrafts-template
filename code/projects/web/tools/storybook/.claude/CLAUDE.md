# `@indiecrafts/web-tools-storybook` — the component gallery (Storybook)

Auto-loads under `code/projects/web/tools/storybook/**`. The **design-system gallery** — a browse-only
Storybook that documents the shared UI bricks — `ui` · `ui-components` · `ui-tokens` · `system-pages` ·
`ui-icons` + the `announcement` / `locale-suggest` / `compliance` web UI — in one sidebar tree. A workspace
member that **consumes** the bricks; it ships no product code — the static gallery deploys to Cloudflare
Pages as a design-system reference (see Run / Platform below).

**Stack:** Storybook (`@storybook/nextjs-vite`) · Vite · Tailwind v4 (`@tailwindcss/vite`) · addons
`a11y` · `docs` · `themes` · `vitest`. **Platform:** a static build (`storybook build`) served by a **Cloudflare Worker** (Workers Static
Assets — no `main`, just `[assets]`; a registry `worker-cf` peer of api/cron/…) via
`pnpm deploy:web:storybook:<env>` → `storybook:build` then the shared `deploy/worker.mjs`
(`wrangler deploy`) → `<prefix>-<env>-web-tools-storybook` (`*.workers.dev`, or the `storybook.<root>`
route from `domains.mjs` once set). The gallery is still browse-only; the app never imports it.

## Run

```bash
pnpm --filter @indiecrafts/web-tools-storybook storybook        # dev gallery on :6006
pnpm --filter @indiecrafts/web-tools-storybook storybook:build  # static → storybook-static/
pnpm --filter @indiecrafts/web-tools-storybook test:stories     # every story as a component + a11y test, Light + Dark (Vitest, headless Chromium)
pnpm --filter @indiecrafts/web-tools-storybook test:stories:website  # the website surface's own stories, Light + Dark
```

`test:stories` is the visual/interaction gate (the repo's "visual = colocated stories" rule); it **blocks**
in the CI `browser-stories` job. It is not in the default `verify` — it needs a browser,
so it lives in its own Playwright-provisioned job, not the browserless `verify`.

## Rules

- **Browse-only — the decoupling is the design.** The app **copies** a component from here then adapts it
  to template conventions; it **never** imports this package or depends on it at runtime (root `CLAUDE.md`
  NEVER). Stories reference the real bricks so the gallery stays honest.
- **Stories live in `stories/`** (and beside each brick). Add a story when a brick gains a variant worth
  documenting; keep the a11y addon green.
- **The website surface composes in** (`.storybook-website/` + `vitest.website.config.ts`): its stories
  sit beside the website's own components (`src/**/*.stories.tsx`, excluded from the website `tsc`).
  Async server components (`DefaultLayout`) and live-Sanity views (Studio) get no story.
- **Next-coupled bricks are mocked** for the gallery (`.storybook/next-intl-mock.tsx`, `shiki-mock.ts`) —
  the gallery is Vite, not Next; mock the Next/CMS edges, don't pull them in. The intl mock reads the
  website's real `messages/{en,fr}.json` (Locale toolbar) — never copy strings into it.
- **a11y is enforced, in both themes** — `a11y.test: "error"` + the addon annotations in each vitest setup
  (without them axe never runs). Waive a rule only for upstream markup a story can't reach: disable that one
  rule on that story with an `@debt ACCESSIBILITY` comment.
- Log gallery/story/config changes in this app's `CHANGELOG.md` (home altitude); roll up to root at release.

Human-facing reference → [`code/docs/projects/web/tools/storybook.md`](../../../../../docs/projects/web/tools/storybook.md).
