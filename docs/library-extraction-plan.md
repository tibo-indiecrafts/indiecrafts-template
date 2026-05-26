# Plan: extract `/components` + Storybook into a sibling library repo

**Goal:** split this monorepo-ish layout into two clean projects — a small standalone Next.js **app** and a sibling **Storybook library** for browsing examples. **Zero runtime coupling** between them.

## 1. Consumption model — decision

| Model                             | What it is                                                                          | Verdict                                                                                                               |
| --------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **A. Full extraction, no link**   | /app contains its own copies of the ~14 components it uses. Library is browse-only. | ✅ **Recommended.** Matches existing "copy from /components" workflow. Zero cross-repo runtime coupling.              |
| **B. pnpm `link:` / `file:` dep** | Library installed as a local package, live-linked.                                  | ❌ Library has Tailwind classes, `@/` paths, "use client" boundaries — bundling as consumable package is non-trivial. |
| **C. pnpm workspace / monorepo**  | Both repos move into a shared parent with `apps/*` + `packages/*`.                  | ❌ Contradicts "two separate repos at `../Code/`".                                                                    |

**Going with A.** /app and library are TWO unrelated projects. To use a component in production: open Storybook, find the section, copy the file into /app, adjust imports if needed.

## 2. Current state (what's where today)

```
src/
├── app/                              ← /app — stays
├── config/                           ← /app — stays
├── i18n/
│   ├── routing.ts                    ← /app — stays
│   └── request.ts                    ← /app — stays
├── lib/
│   ├── metadata.ts                   ← /app — stays
│   ├── logger.ts                     ← /app — stays
│   ├── seo/{jsonld,jsonld-factories,page-markdown}.{ts,tsx}  ← /app — stays
│   └── utils.ts (cn helper)          ← /app — stays
├── types/messages.ts                 ← /app — stays
├── components/
│   ├── ui-primitives/                ← LIBRARY (but /app needs ~4 of these)
│   ├── ui-effects/                   ← LIBRARY
│   ├── ui-illustrations/             ← LIBRARY
│   ├── ui-molecules/                 ← LIBRARY
│   ├── layouts/_shared/              ← LIBRARY (but /app's _chrome needs 5 atoms)
│   ├── layouts/{default,dashboard,prose,sidebar,full-bleed}-layout/  ← LIBRARY
│   ├── sections-*/                   ← LIBRARY (but /app needs ~6 of them)
│   ├── pages-*/                      ← LIBRARY
│   ├── _lib/{scoped-t,typography}.ts ← LIBRARY
│   ├── _hooks/*                      ← LIBRARY
│   └── _types/*                      ← LIBRARY
└── proxy.ts                          ← /app — stays

.storybook/{main.ts,preview.tsx}      ← LIBRARY
tests/unit/typography.test.ts         ← LIBRARY (tests typography.ts which moves)
components.json                       ← split: each repo gets its own
```

## 3. /app's actual dependencies on /components (audited)

These are the **only** files /app imports from /components today. Everything else (~500 files) is unused by production:

**ui-primitives (shadcn):** `button`, `input`, `label`, `textarea`

**Chrome atoms (used by /app/\_chrome/):**

- `layouts/_shared/logo/Logo.tsx`
- `layouts/_shared/locale-switcher/LocaleSwitcher.tsx`
- `layouts/_shared/theme-toggle/ThemeToggle.tsx`
- `layouts/_shared/theme-provider/ThemeProvider.tsx`

**Section components:**

- `sections-features/features-01/`
- `sections-cta/cta-01/`
- `sections-pricing/pricing-01/`
- `sections-testimonials/testimonials-01/`
- `sections-newsletter/newsletter-01/`
- `sections-contact/contact-netlify-01/`

**Total: ~14 components.**

## 4. Proposed end state

### Library repo: `../Code/indiecrafts-library/`

```
indiecrafts-library/
├── .storybook/
│   ├── main.ts
│   └── preview.tsx              # reads own messages + globs own /components/**/en.json
├── public/                       # static assets stories reference
├── messages/
│   ├── en.json                   # sample chrome + page copy for stories
│   └── fr.json
├── src/
│   ├── components/               # EVERYTHING from src/components/ today
│   │   ├── _hooks/
│   │   ├── _lib/
│   │   ├── _types/
│   │   ├── ui-primitives/
│   │   ├── ui-effects/
│   │   ├── ui-illustrations/
│   │   ├── ui-molecules/
│   │   ├── layouts/
│   │   ├── sections-*/
│   │   └── pages-*/
│   ├── i18n/
│   │   └── routing.ts            # STUB: Link = forwardRef plain <a>, getPathname = (h)=>h
│   ├── lib/
│   │   └── utils.ts              # cn helper (copy)
│   ├── config/
│   │   └── index.ts              # STUB: sample site/theme/locales/pages for stories
│   └── types/
│       └── messages.ts           # STUB: export type MessageKey = string
├── tests/unit/typography.test.ts
├── components.json               # shadcn config (own paths)
├── package.json                  # storybook + react + tailwind + needed runtime deps
├── tsconfig.json                 # @/ paths to ./src
├── eslint.config.mjs             # relaxed rules (placeholder anchors etc.)
├── tailwind globals.css          # @theme tokens (copy of /app's at extract time)
└── README.md
```

### App repo (this one, post-extract)

```
src/
├── app/                          # unchanged
├── config/                       # unchanged
├── i18n/                         # unchanged (real routing, not the stub)
├── lib/                          # unchanged (utils.ts stays)
├── types/messages.ts             # unchanged (real derived MessageKey)
├── components/                   # SHRUNK to ~14 files
│   ├── ui/                       # shadcn primitives /app uses
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── chrome/                   # atoms /app/_chrome composes
│   │   ├── Logo.tsx
│   │   ├── LocaleSwitcher.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeProvider.tsx
│   └── sections/                 # flattened section components
│       ├── Features.tsx
│       ├── Cta.tsx
│       ├── Pricing.tsx
│       ├── Testimonials.tsx
│       ├── Newsletter.tsx
│       └── ContactNetlify.tsx
└── proxy.ts
```

**Removed from /app:** Storybook (no `pnpm storybook`, no `.storybook/`, no `*.stories.tsx`), eslint relaxations for /components, vitest config, test files.

## 5. Concrete steps (in order)

### Library side

1. `mkdir ../Code/indiecrafts-library && cd ../Code/indiecrafts-library`. `git init`.
2. Initialize `package.json` with runtime deps: `react`, `react-dom`, `next`, `tailwindcss`, all components' deps (`motion`, `three`, `framer-motion`, `lucide-react`, `cobe`, `dotted-map`, `react-tweet`, `next-intl`, etc.). Dev deps: `storybook`, `@storybook/nextjs-vite`, `vitest`, `@testing-library/*`, etc.
3. Copy `tsconfig.json` from /app, point `@/` at `./src`.
4. Copy `eslint.config.mjs` from /app — keep the `/components/**` relaxations as the default.
5. Copy Tailwind setup (PostCSS plugin, `globals.css` with `@theme inline` tokens).
6. Move (`cp -r` to library, then `git rm` from /app):
   - `src/components/` → library `src/components/`
   - `.storybook/` → library `.storybook/`
   - `tests/unit/typography.test.ts` → library `tests/unit/typography.test.ts`
7. **Stub i18n routing in library** at `src/i18n/routing.ts`:

   ```ts
   import { forwardRef, type AnchorHTMLAttributes } from "react";

   export const Link = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
     function Link(props, ref) { return <a ref={ref} {...props} />; },
   );
   export const getPathname = (a: { href: string }) => a.href;
   export const useRouter = () => ({ push: () => {}, replace: () => {} });
   export const usePathname = () => "/";
   export const redirect = () => {};
   ```

8. **Stub MessageKey type** at `src/types/messages.ts`:

   ```ts
   export type MessageKey = string;
   ```

9. **Stub config** at `src/config/index.ts`: re-export sample `site`, `theme`, `locales`, `pages` shapes matching the production schema so stories render.
10. Adjust `.storybook/preview.tsx` to read the library's own `messages/{en,fr}.json` and glob its own `src/components/**/en.json`.
11. `pnpm install && pnpm storybook` should boot. Manual spot-check each category.
12. Library `README.md`: "browse components here, copy into your app when you want to use one".

### App side

13. **Copy the 14 components /app needs** before deleting `src/components/`:
    - `cp src/components/ui-primitives/{button,input,label,textarea}.tsx → src/components/ui/`
    - For each section component, flatten:
      - `sections-features/features-01/{Features.tsx,schema.ts,config.ts,index.ts}` → `components/sections/Features.tsx` (inline schema/config into one file)
      - Repeat for cta, pricing, testimonials, newsletter, contact-netlify
    - For chrome atoms: `layouts/_shared/{logo,locale-switcher,theme-toggle,theme-provider}/` → `components/chrome/`
14. Verify block i18n keys already exist in `messages/<locale>.json` under `pages.<id>.blocks.*`.
15. Mass-update import paths in /app:
    - `@/components/ui-primitives/button` → `@/components/ui/button`
    - `@/components/layouts/_shared/logo` → `@/components/chrome/Logo`
    - `@/components/sections-features/features-01` → `@/components/sections/Features`
    - …etc.
16. `git rm -r src/components/` (parts that weren't copied).
17. `git rm -r .storybook/`.
18. Remove from `package.json`: `@storybook/*`, `@chromatic-com/storybook`, `eslint-plugin-storybook`, `vitest`, `@vitest/*`, `happy-dom`, `@testing-library/*`. Remove `storybook` + `build-storybook` + `test*` scripts.
19. Trim `eslint.config.mjs`: drop `/components/**` rule relaxations, drop `eslint-plugin-storybook` flat config.
20. Trim `components.json`: keep only registries /app actually uses for shadcn add (or drop all custom registries).
21. Run `pnpm install` to refresh lockfile.
22. `pnpm verify:quick` — fix any broken imports.
23. End-to-end smoke: every route 200.

### Docs side (both repos)

24. **Update /app `README.md`:**
    - Drop the "browse the /components examples library" sentence from the intro and the `pnpm storybook` line from the Commands block.
    - Replace the "Adding a section" workflow section with a pointer to the library repo: "Browse `../indiecrafts-library` (or wherever you cloned it), copy the section file into `src/components/sections/`, wire it up — see `(home)/page.tsx` for the pattern."
    - Drop the "Project structure" mention of `/components` examples library; the new tree is much smaller.
    - Keep all SEO / LLMs / forms / cookie-banner / deployment sections — they stay relevant.

25. **Update /app `CLAUDE.md`:**
    - Drop the entire "Folder conventions" table (ui-primitives, ui-effects, sections-\* — none of those folders exist in /app anymore).
    - Trim the Architecture block — remove the `src/components/` example-library tree, replace with the slim production-only tree (`components/ui/`, `components/chrome/`, `components/sections/`).
    - Drop the "Adding a section to a route" 3-step section — replace with a one-liner pointer to the library repo + README.
    - Drop these NEVERs from the Critical rules: "NEVER edit `src/components/ui-primitives/**`" and "NEVER edit flat files in `src/components/ui-effects/*.tsx`" — they don't apply after extract.
    - Keep all i18n / SEO / theming / accessibility sections.

26. **Library repo `README.md`** (new, in `../Code/indiecrafts-library/`):
    - Top: "Storybook component library for indiecrafts.dev sites. Not a runtime dependency — browse here, copy into your app when you want a component."
    - Commands: `pnpm install`, `pnpm storybook`, `pnpm build-storybook`.
    - Folder map mirroring the current `/components` layout (`ui-primitives/`, `ui-effects/`, `sections-*/`, `pages-*/`, `layouts/`, `_lib/`, `_hooks/`).
    - "How to use a component" workflow: pick → copy file → adjust imports → add i18n keys → mount.
    - Note the stubbed `@/i18n/routing`, `@/types/messages`, `@/config` — explain why and what to swap with when copying into a real app.

27. **Library `CLAUDE.md`** (new):
    - Working principles (copy from /app, library-flavored).
    - Component shape conventions (5-file pattern: `<Name>.tsx`, `<Name>.stories.tsx`, `schema.ts`, `config.ts`, `en.json`, `index.ts`).
    - i18n approach (each component ships its own `en.json` for Storybook isolation; preview.tsx globs them).
    - "Strict NEVERs" focused on the library: never break Storybook isolation, never import from `@/app/*`, never assume the host app's route shape.

## 6. Risks and tricky bits

| Risk                                                                                             | Mitigation                                                                                                                                 |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Library has hundreds of `@/i18n/routing` imports expecting next-intl Link                        | The stub handles it — plain `<a>` works for Storybook. Stories don't actually navigate.                                                    |
| Library components type `*Key` props as `MessageKey`                                             | Library's `MessageKey = string`. All call sites accept it. Loses narrow typing but no runtime change.                                      |
| Library has many `@/config` imports for `site`, `theme`, `locales`                               | Library ships its own sample `src/config/index.ts` with the same shape. Stories use the sample values.                                     |
| Some /components stories import sibling components (e.g. PageLanding01 mounts Features01Section) | All sibling imports stay within the library — no change needed.                                                                            |
| Tailwind classes referencing CSS vars (`bg-background`, `text-foreground`)                       | Library has its own `globals.css` with the same `@theme inline` tokens. Both repos can drift; that's a feature for client-specific themes. |
| `pnpm new:page` script in /app                                                                   | Verify it doesn't reference /components paths. If yes, update or delete.                                                                   |
| `next.config.ts` `remotePatterns` for `images.unsplash.com` etc.                                 | Stays in /app — needed for production images.                                                                                              |
| `cobe.d.ts` / `lodash.throttle.d.ts`                                                             | Move with library (already in `src/components/_types/`).                                                                                   |
| ESLint `globalIgnores` for `src/components/_hooks/**`                                            | Drops out of /app's eslint config — no longer needed.                                                                                      |
| `tests/unit/typography.test.ts`                                                                  | Moves with library. /app has no remaining unit tests.                                                                                      |
| Vitest config in /app                                                                            | Drops out — /app has no tests after extract.                                                                                               |

### Things to verify before declaring done

- `pnpm install && pnpm dev` in /app — home page 200, /fr 200, sitemap.xml 200, llms.txt 200, JSON-LD per locale correct
- `pnpm install && pnpm storybook` in library — every story renders without console errors
- `pnpm build` in both — production builds succeed
- /app's bundle size shrinks meaningfully (removing ~500 components + storybook deps)

## 7. Effort estimate

| Phase                                                                                    | Time                   |
| ---------------------------------------------------------------------------------------- | ---------------------- |
| Library repo skeleton (init, tsconfig, package.json, eslint, tailwind, storybook config) | 60-90 min              |
| Move files /app → library + initial `pnpm install`                                       | 30 min                 |
| Fix library: i18n/routing stub, MessageKey stub, config stub, Tailwind tokens            | 60 min                 |
| Verify Storybook boots + every story renders (manual spot-check)                         | 30-45 min              |
| Copy ~14 components into /app (flatten naming if desired)                                | 45 min                 |
| Mass-update /app imports + verify block i18n keys                                        | 30 min                 |
| Delete /components, .storybook, deps from /app + verify                                  | 30 min                 |
| Update /app README + CLAUDE.md (drop /components sections, trim folder tables)           | 30 min                 |
| Write library README + CLAUDE.md (workflow, conventions, stub explanations)              | 30 min                 |
| End-to-end smoke + bundle size check                                                     | 30 min                 |
| **Total**                                                                                | **~6-8 hours focused** |

## 8. Open questions

1. **Library repo name?** `indiecrafts-library`, `indiecrafts-ui`, `indiecrafts-storybook`, `indiecrafts-blocks`. First is most accurate.

2. **Component naming in /app post-extract.** Two options:
   - **Flat shadcn convention:** `components/ui/button.tsx`, `components/sections/Features.tsx`, `components/chrome/Logo.tsx` (recommended)
   - **Keep current paths:** `components/ui-primitives/button.tsx`, `components/sections-features/features-01/Features.tsx`

3. **`pnpm test`** — drop entirely from /app, or scaffold basic vitest for /app's own future tests?

4. **shadcn `components.json`** in /app — keep (so future `pnpm dlx shadcn add` works), or drop?

5. **Future shared updates between repos** — when the library improves a component, what's the workflow?
   - Manual re-copy (matches stated direction)
   - Per-component changelog in library, devs copy on demand
   - Private registry someday (out of scope)

6. **Should the library include `/app/_chrome/` chrome as a story?** Right now /app/\_chrome/ has DefaultLayout + Header + Footer + SkipLink + CookieBanner. Could ALSO live as Storybook stories in the library. Or leave them /app-only.

## 9. Execution recommendation

If you want me to execute, the safe order is:

1. Set up the library repo first (skeleton)
2. **Copy** files (don't move yet) — both repos coexist temporarily
3. Verify library boots
4. Verify /app boots after copying the 14 components in
5. Only then `git rm` from /app

Do it as one focused session — not piecemeal — so the two repos stay coherent during the cut.
