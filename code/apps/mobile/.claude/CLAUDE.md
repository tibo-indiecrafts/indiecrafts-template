# @indiecrafts/mobile — native app (Expo / React Native)

Auto-loads under `code/apps/mobile/**`. A **separate platform** — a native iOS/Android app on **Expo + expo-router**. NOT a Cloudflare Worker. Platform rules (the parts that apply) live in the root `CLAUDE.md`.

**Stack:** Expo (SDK 52-ish) · React Native · expo-router · TypeScript. **Scaffold — finalize the stack + versions on `pnpm install`.**

## How it differs from the web apps (read this first)

- **Deploy ≠ wrangler.** Builds run on **EAS** (`eas build`) and ship to the **App Store / Play Store** (`eas submit`). It is **NOT** in `pnpm deploy:all` — that's Cloudflare-only. Add an `eas.json` (build profiles + submit creds) before your first build.
- **Runtime is React Native (Hermes), not the DOM.** The **web/DOM bricks do NOT run here** — `@indiecrafts/ui`, `ui-components`, `ui-tokens` are web-only. Reuse only the **React-free** bricks: `@indiecrafts/config`, `format`, `utils`, `schema`, and the shared `i18n` messages. (Packages reserve a `src/native/` slot for a future RN component set — see `code/packages/.claude/CLAUDE.md`.)
- **React version.** RN pins its own React (18.x today) — older than the web apps' React 19. That's fine because the shared bricks it imports are React-free; pnpm keeps the versions separate per package.
- **Data.** Read the tenant's Sanity content over HTTP (the read client / a small API worker), not the web app's server components.

## Deploy

```bash
pnpm --filter @indiecrafts/mobile start                # expo dev
pnpm --filter @indiecrafts/mobile build:ios            # eas build → store
pnpm --filter @indiecrafts/mobile submit:ios
```

## Pointers

- Multi-app model → [`docs/shared/architecture/multi-app.md`](../../../../docs/shared/architecture/multi-app.md).
- Native platform convention (packages' `src/native/`) → `code/packages/.claude/CLAUDE.md`.
