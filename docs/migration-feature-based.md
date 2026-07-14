# Migration plan — feature-based re-organization

A phased, history-preserving, **alias-driven** migration from the current
type-based layout to a feature-based one. Every phase is independently
committable and verifiable (`pnpm verify:quick`), so you can stop or roll back
at any point.

> **Do this on a clean branch with no other work in flight.** It rewrites
> imports across ~40 files; concurrent edits guarantee conflicts.

---

## 1. Goal & target structure

```
src/
├── app/                    # ROUTES ONLY — thin page.tsx importing from features/*, components/*
│   ├── [locale]/  api/  studio/  maintenance/  robots.txt/  …
│   └── globals.css         # stays here (imported via ../globals.css)
│
├── features/               # ← NEW: self-contained domain features
│   └── blog/
│       ├── components/      # all of today's blog-components/*
│       │   └── modules/     # the page-builder renderers
│       ├── sanity/          # schema/ + queries.ts + types.ts + portable-to-markdown.ts + structure.ts
│       ├── lib/             # route-gate.ts (was lib/feature-gate.ts)
│       └── index.ts         # barrel = the feature's PUBLIC api
│
├── components/             # SHARED, cross-feature UI only
│   ├── ui/                  # renamed from ui-primitives (shadcn primitives)
│   ├── layout/             # moved from app/layout (Header, Footer, ThemeToggle…)
│   ├── sections/           # marketing blocks (Features, Pricing, IconShowcase…)
│   ├── pages/              # Error, NotFound, Maintenance composites
│   ├── svgs/               # ← the 238 brand/illustration SVG *components* (out of ui-primitives)
│   └── BrandIcon.tsx
│
├── config/  hooks/  i18n/  types/     # shared, unchanged
├── lib/                    # SHARED only (see classification below)
├── sanity/                 # CORE infra only: client, live, env, token, image, Studio
└── assets/                 # ← NEW: build-IMPORTED files only (currently just fonts/)

public/                     # UNCHANGED — URL-served static files (favicons, /brand/*.png, logo.svg, robots)
```

### `public/` vs `src/assets/` vs `components/svgs/`

Three distinct buckets — don't conflate them:

- **`public/`** — files referenced by a **URL string** and served verbatim:
  favicons, `/brand/og-*.png`, `logo.svg`, anything in `<img src="/…">` or
  `next/image` with a `/` path. **Keep exactly as-is.**
- **`src/assets/`** — files **`import`ed into code** and processed by the
  bundler. Today that's only the **fonts** (`next/font/local` imports the
  `.woff2`). Never put URL-served images here; never put fonts in `public/`
  (that bypasses `next/font` hashing + preload).
- **`src/components/svgs/`** — the 238 `*.tsx` are **React components**
  (`export const X = (props) => <svg>`), not assets. They stay in `components/`.

No `tsconfig` change needed: `@/*` already maps to `src/*`, so `@/features/blog`
and `@/assets/*` resolve for free.

---

## 2. Classification — shared vs. feature

**Rule:** used by ≥2 features or site-wide → **shared**; used only by the blog →
**`features/blog`**.

| Current path                                                         | Destination                       | Why                                               |
| -------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------- |
| `components/blog-components/**`                                      | `features/blog/components/**`     | blog-only views + page-builder                    |
| `sanity/schema/**`                                                   | `features/blog/sanity/schema/**`  | the content model                                 |
| `sanity/queries.ts` · `types.ts`                                     | `features/blog/sanity/`           | blog GROQ + types                                 |
| `sanity/portable-to-markdown.ts` · `structure.ts`                    | `features/blog/sanity/`           | blog md + Studio desk                             |
| `lib/feature-gate.ts`                                                | `features/blog/lib/route-gate.ts` | blog route gating                                 |
| `components/ui-primitives/**`                                        | `components/ui/**`                | shared shadcn (aligns w/ shadcn default)          |
| `app/layout/**`                                                      | `components/layout/**`            | shared chrome                                     |
| `components/ui-primitives/svgs/**`                                   | `components/svgs/**`              | they're React components, not assets              |
| `fonts/**` (the `.woff2`)                                            | `assets/fonts/`                   | build-imported by `next/font/local`               |
| `public/**`                                                          | **stays** `public/`               | URL-served static files — never move to `assets/` |
| `sanity/{client,live,env,token,image,Studio}`                        | **stay** `sanity/`                | shared Sanity infra                               |
| `lib/{metadata,theme,fonts,logger,slugify,utils,faq}` · `lib/seo/**` | **stay** `lib/`                   | site-wide                                         |

**Judgment calls (decide before you start):**

- `lib/video-embed.ts` — only the blog uses it today, but it's a generic URL
  parser. **Recommend: keep in `lib/`** (reusable util). Move to
  `features/blog/lib/` if you prefer strict "used-by = owned-by".
- `lib/faq.ts` + `components/sections/Faq.tsx` — FAQ is **per-page**, not
  blog-specific. **Keep shared.**
- `lib/seo/page-markdown.ts` — powers `/llms.txt` for **all** pages. **Keep
  shared**, even though the blog also uses it.
- `sanity/structure.ts` — Studio desk is blog-content-centric → moved with the
  feature. (Alternative: keep as Studio infra in `sanity/`.)

---

## 3. Prep (Phase 0)

```bash
git switch -c refactor/feature-based
git status            # MUST be clean
pnpm verify:quick     # green baseline
```

Codemod tooling — pick one:

- **sed** (simple, shown below): every internal import uses the `@/` alias, so a
  path move is a literal string swap. Safe because the alias segment is unique.
- **ast-grep / ts-morph** (safer for edge cases): `pnpm dlx @ast-grep/cli`.

After **every** phase: `pnpm verify:quick` → commit. `pnpm tsc` is the safety
net — a missed import is a compile error, never a silent runtime break.

---

## 4. Phases (ordered low-risk → high-risk)

Each phase = `git mv` (preserves history) + one alias find/replace + verify + commit.

### Phase 1 — split assets from svg components (isolated)

`public/` is untouched. Fonts → `assets/` (imported); svg _components_ →
`components/svgs/` (they're code).

```bash
mkdir -p src/components/svgs src/assets/fonts
git mv src/components/ui-primitives/svgs/* src/components/svgs/
git mv src/fonts/* src/assets/fonts/
```

Fix the two known referrers:

- `src/lib/fonts.ts` → `../assets/fonts/Satoshi-Variable.woff2` (was `../fonts/…`)
- any `@/components/ui-primitives/svgs/…` importers:

```bash
grep -rl "ui-primitives/svgs" src | xargs sed -i '' 's#@/components/ui-primitives/svgs#@/components/svgs#g'
```

`pnpm verify:quick && git commit -am "refactor: fonts → src/assets, svg components → components/svgs"`

### Phase 2 — rename `ui-primitives` → `ui` (20 importers)

```bash
git mv src/components/ui-primitives src/components/ui
grep -rl "ui-primitives" src | xargs sed -i '' 's#@/components/ui-primitives#@/components/ui#g'
```

**Then update `components.json`** (else future `shadcn add` writes to the old path):

```jsonc
"ui": "@/components/ui"   // was "@/components/ui-primitives"
```

`pnpm verify:quick && git commit -am "refactor: ui-primitives → ui (+ components.json)"`

### Phase 3 — chrome → `components/layout` (16 importers)

```bash
git mv src/app/layout src/components/layout
grep -rl "@/app/layout" src | xargs sed -i '' 's#@/app/layout#@/components/layout#g'
```

Verify each moved chrome file's own relative imports still resolve (they use
`@/…`, so they do). `pnpm verify:quick && commit`.

### Phase 4 — blog components → `features/blog/components` (11 importers)

```bash
mkdir -p src/features/blog/components
git mv src/components/blog-components/* src/features/blog/components/
grep -rl "blog-components" src | xargs sed -i '' 's#@/components/blog-components#@/features/blog/components#g'
```

Intra-folder imports (`./BlogCard`, `./modules/…`) move together untouched.
`pnpm verify:quick && commit`.

### Phase 5 — blog Sanity → `features/blog/sanity`

```bash
mkdir -p src/features/blog/sanity
git mv src/sanity/schema src/features/blog/sanity/schema
git mv src/sanity/queries.ts src/sanity/types.ts \
       src/sanity/portable-to-markdown.ts src/sanity/structure.ts \
       src/features/blog/sanity/
# update importers
grep -rl "@/sanity/queries\|@/sanity/types\|@/sanity/portable-to-markdown\|@/sanity/structure" src \
  | xargs sed -i '' -e 's#@/sanity/queries#@/features/blog/sanity/queries#g' \
                    -e 's#@/sanity/types#@/features/blog/sanity/types#g' \
                    -e 's#@/sanity/portable-to-markdown#@/features/blog/sanity/portable-to-markdown#g' \
                    -e 's#@/sanity/structure#@/features/blog/sanity/structure#g'
```

**Update the two root-level Sanity entrypoints** (they use `./src/…`, not `@/`):

- `sanity.config.ts`: `./src/sanity/schema` → `./src/features/blog/sanity/schema`;
  `./src/sanity/structure` → `./src/features/blog/sanity/structure`
- Confirm `schema/index.ts` internal relative imports still resolve (they move together).

`pnpm verify:quick && commit`.

### Phase 6 — blog lib

```bash
mkdir -p src/features/blog/lib
git mv src/lib/feature-gate.ts src/features/blog/lib/route-gate.ts
grep -rl "@/lib/feature-gate" src | xargs sed -i '' 's#@/lib/feature-gate#@/features/blog/lib/route-gate#g'
```

`pnpm verify:quick && commit`.

### Phase 7 — barrel + docs

Create `src/features/blog/index.ts` re-exporting the feature's **public** surface
(what `app/` routes consume), so routes import `@/features/blog` not deep paths:

```ts
export { requireBlogRoute, isBlogRouteEnabled, isRssEnabled } from "./lib/route-gate";
export { DefaultPostLayout } from "./components/DefaultPostLayout";
export { Modules } from "./components/modules/ModuleRenderer";
// …the handful of entrypoints routes actually use
```

Optionally codemod route imports to the barrel. Then update **`CLAUDE.md`**
(the whole "Architecture" tree + the blog/module paths) and any `/docs` that name
old paths (`blog-architecture.md`, `sanity-setup.md`).

`pnpm verify` (full: + contrast + build) → commit → PR.

---

## 5. Gotchas checklist

- [ ] `components.json` `ui` alias updated (Phase 2) — future `shadcn add` depends on it.
- [ ] `sanity.config.ts` + any `./src/sanity/*` root imports repointed (Phase 5).
- [ ] `next.config.ts` `optimizePackageImports` — **unaffected** (package names, not paths).
- [ ] `globals.css` stays in `src/app/` — layouts import it via `../globals.css`; don't move it.
- [ ] macOS `sed` needs `-i ''`; GNU sed uses `-i`. Adjust the recipes.
- [ ] Server/client boundaries are path-independent — no `"use client"` changes needed.
- [ ] Run `pnpm tsc` after each phase; a stray import is a compile error, not a silent break.
- [ ] `git mv` (not `mv`) throughout, to keep blame/history.

## 6. Rollback

Each phase is one commit. `git revert <sha>` or `git reset --hard HEAD~1` backs out
a single phase cleanly. Because verification runs per phase, you never stack a
broken state.

## 7. Effort estimate

~40 files re-imported across 7 commits. With the sed recipes: **~1–2 focused
hours** including verification. The risky steps are 5 (Sanity, root config
coupling) and 7 (barrel + CLAUDE.md prose) — budget most of the review time there.
