# @indiecrafts/mobile

A **native iOS/Android app** (Expo + expo-router) — a **separate platform**, not a
Cloudflare Worker. **Scaffold**: the slot + entry; finalize the stack, add `eas.json`,
and `pnpm install` (RN pins its own versions).

```bash
pnpm --filter @indiecrafts/mobile start          # expo dev server
pnpm --filter @indiecrafts/mobile build:ios      # EAS build → App Store
```

**Not** in `pnpm deploy:all` (that's Cloudflare-only) — mobile deploys via **EAS →
the stores**. Reuse only the React-free bricks (`config`/`format`/`utils`); the
web/DOM bricks don't run on React Native. See `.claude/CLAUDE.md`.
