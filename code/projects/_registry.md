# apps — deployable surfaces (islands)

- **web/** ● the Next.js app (live) — today it is also the **hub Studio** (edits all content).
- **workers/** ◐ Cloudflare Worker — cron / queue / background jobs. Scaffolded + compiling; no live job yet.
- **marketing/** ◐ Next.js — campaigns / landing pages / microsites. Skeleton (brief + README); `create-next-app` to activate.
- **admin/** ◐ Next.js — auth-gated ops / moderation dashboard. Skeleton; `create-next-app` + an auth gate.
- **mobile/** ◐ React Native (Expo) — mobile client. Skeleton; `create-expo-app`; builds the bricks' `native/` layers.
- **hybrid/** ◐ Electron — desktop app (native shell + web renderer). Active scaffold — **builds** (electron-vite 5 → main/preload/renderer); `pnpm --filter @indiecrafts/hybrid build`. Finalize signing/notarization + the prod-renderer strategy.
- **api/** ◐ Cloudflare Worker + Hono — shared versioned API for non-web clients. Skeleton; mirror `workers` + Hono.
- docs/ → kept at repo root (npm-isolated VitePress)

**Legend:** ● live · ◐ scaffolded skeleton (folder + `.claude/CLAUDE.md` brief; run its framework's init to
activate — no `package.json` until then, so it stays out of the pnpm workspace) · ○ reserved (name only).

**Model:** an app is a **read-lens** over one tenant's shared Sanity dataset; one **hub Studio** edits
everything (desk grouped per app); islands (modules) compose into apps. Full architecture →
[`docs/shared/architecture/multi-app.md`](../../docs/shared/architecture/multi-app.md).
