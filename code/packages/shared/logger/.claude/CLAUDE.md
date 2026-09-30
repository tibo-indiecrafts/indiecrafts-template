# `@indiecrafts/packages-shared-logger` — structured logging

Auto-loads under `code/packages/shared/logger/**`. The one logging system for app + modules:
beautiful in dev, structured JSON in prod, **edge/Cloudflare-Workers-safe**, **Sentry-ready**.
Area rules → `../../../.claude/CLAUDE.md`.

**Stack:** TypeScript, isomorphic (browser/server/edge/Workers). Zero runtime deps except
`@indiecrafts/packages-shared-config`. Pure `console.*` — no Node `fs`/streams, so it runs identically on
Workers isolates (and Workers Logs captures the output automatically; `[observability.logs]`
is on in `wrangler.toml`).

- **Import:** `import { logger } from "@indiecrafts/packages-shared-logger"`; `logger.child("newsletter")` for a
  subsystem. Levels: `trace · debug · info · warn · error · fatal`. Never `console.*` directly in app code.
- **`error(msg, err?, ctx?)`** accepts BOTH `error(msg, new Error(), { ctx })` and the common
  `error(msg, { error })` (the nested error is lifted) — back-compat with every existing call site.
- **Config lives in `@indiecrafts/packages-shared-config` → `logging`** (DATA): per-env `levels`
  (**`production: "silent"`** — prod console off) + `redactKeys`. Resolution (env + override) is here.
  Override the level live with **`NEXT_PUBLIC_LOG_LEVEL`**, or `configure({ level, reporter, redactKeys })`
  at runtime. Force env at edge module-load with `setEnvironment(env)`.
- **Reporters** (auto-picked): `prettyReporter` (dev TTY, ANSI badge — no `chalk`), `browserReporter`
  (`%c`), `jsonReporter` (prod/Workers, one JSON line). Each routes to the matching `console` method so
  Workers Logs classifies severity.
- **Transports fire independent of the console gate** — so a prod-silent console still feeds a sink.
  Two opt-in transports: `./cloudflare` → `cloudflareTransport()` (forwards error/fatal to `console.error` →
  **Workers Logs**; the wired default, gated to production at each Worker entry) and `./sentry` →
  `sentryTransport(Sentry)` (structural `SentryLike` type — **no `@sentry/*` dependency** — error/fatal →
  `captureException`, lower → breadcrumbs; a drop-in alternative).
- **Redaction + `safeStringify`** (circular/depth/array caps, Error normalize) run at source in `core.ts`.

Depends on `@indiecrafts/packages-shared-config` only. Never imports an app or a module. Full reference →
[`code/docs/packages/logger.md`](../../../../docs/packages/logger.md).
