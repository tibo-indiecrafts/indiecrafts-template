# Logger (structured · edge-safe · Sentry-ready)

The one logging system for the app + every module — **beautiful in dev, structured JSON in prod,
Cloudflare-Workers-safe, Sentry-ready**. Lives in the **`@indiecrafts/packages-shared-logger`** brick
(`code/packages/shared/logger`), consumed as source. Pure `console.*` — **zero runtime deps** except
`@indiecrafts/packages-shared-config` — so it runs identically in the browser, server, edge middleware, and Workers
isolates.

Replaces the old 26-line `@indiecrafts/packages-shared-utils/logger` placeholder (its header even said "replace with
Pino/Datadog/Sentry per project"). pino/winston are Node-stream-based → **not edge-safe**; this is
`console`-based by design.

## Exports

| Import                                                | What it is                                                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `logger` (`.`)                                        | The root logger — `trace · debug · info · warn · error · fatal` + `child(scope)` · `time`/`timeEnd`. |
| `createLogger(scope?, ctx?)` (`.`)                    | A scoped logger (dot-joined scope, merged base context).                                             |
| `addTransport` · `configure` · `setEnvironment` (`.`) | Register a sink · override level/reporter/redaction at runtime · force env at edge module-load.      |
| `sentryTransport(Sentry)` (`./sentry`)                | The opt-in Sentry sink — **no `@sentry/*` dependency** (structural `SentryLike` type).               |
| `cloudflareTransport()` (`./cloudflare`)              | The opt-in **Cloudflare Workers Logs** sink — forwards error/fatal to `console.error` past the silent gate. No vendor SDK. |
| `safeStringify` · `normalizeError` (`.`)              | The serialization helpers (circular/depth/array caps).                                               |

## Usage

```ts
import { logger } from "@indiecrafts/packages-shared-logger";

logger.info("subscriber confirmed", { id }); // dev: pretty · prod: silent
logger.error("send failed", err, { to }); // Error positional + context
logger.error("send failed", { error: err, to }); // …or the error nested in context (both work)

const log = logger.child("newsletter"); // scoped subsystem logger
log.warn("retrying", { attempt: 2 });
```

Never call `console.*` directly in app code — always the logger.

## Levels & per-environment config

Config is DATA in **`@indiecrafts/packages-shared-config` → `logging`** (resolution logic lives in the brick):

```ts
export const logging = {
  levels: {
    development: "debug",
    test: "silent",
    staging: "info",
    production: "silent",
  },
  redactKeys: [
    "password",
    "token",
    "apiKey",
    "authorization",
    "cookie",
    "secret",
    "sessionToken",
  ],
};
```

- **`production: "silent"`** — a live site emits **no console output** (the requirement). `"silent"`
  gates every level off.
- **Errors still reach transports** even when the console is silent — see below.
- **Override the level live** with **`NEXT_PUBLIC_LOG_LEVEL`** (e.g. set `debug` on a prod deploy to
  chase an incident), or `configure({ level: "debug" })` at runtime.
- **Redaction runs at the source** — any context key matching `redactKeys` (case-insensitive) is
  replaced with `"[REDACTED]"` before it reaches a reporter or transport.

## Reporters (auto-picked)

| Runtime                      | Reporter          | Output                                                                                                            |
| ---------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Server, non-prod (dev TTY)   | `prettyReporter`  | Colored level badge · dim time · dim scope · message · context (hand-rolled ANSI, no `chalk`; honors `NO_COLOR`). |
| Browser                      | `browserReporter` | `%c`-styled console badge.                                                                                        |
| Server, production / Workers | `jsonReporter`    | One structured JSON line.                                                                                         |

Every reporter routes each level to the matching `console` method (`error`→`console.error`, …).

## Cloudflare — Workers Logs (the default observability)

The prod `jsonReporter` writes with `console.*`, and **Cloudflare Workers Logs captures `console`
output automatically** — `[observability.logs] enabled = true` is already set in `wrangler.toml`. So
prod logs appear in the Workers Logs dashboard + `wrangler tail`, structured and queryable.

The catch: the app console is `silent` in prod by default (no request-log noise), which would also drop
**errors**. `cloudflareTransport()` closes that gap — a transport forwards error/fatal to `console.error`
(one JSON line, via `jsonReporter`) **independent of the console gate**, so errors reach Workers Logs
while the console stays quiet. It is the observability sink for this stack (Cloudflare-native — no vendor
SDK, no DSN). Wire it at each Worker entry, gated to production:

```ts
import { addTransport } from "@indiecrafts/packages-shared-logger";
import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";

if (getCurrentEnvironment() === "production") addTransport(cloudflareTransport());
```

Wired today at the `code/shared/api` + `code/shared/cron` Workers and the website's
`instrumentation.ts` (server boot). The gate is self-correcting: if prod is mis-detected the transport is
skipped, but then the console is not silent, so the normal reporter logs the error anyway — Workers Logs
gets it either way, once. Client-side errors (browser `error.tsx`, the Electron renderer) stay
client-side; forwarding those to Cloudflare (a POST to an ingestion Worker) is a later step.

## Sentry — opt-in transport

Transports fire **independent of the console gate**, so a prod-silent console still forwards errors.
The Sentry sink takes the Sentry instance as a parameter — **the brick has no `@sentry/*` dependency**:

```ts
import * as Sentry from "@sentry/nextjs"; // a project adds this + its DSN
import { addTransport } from "@indiecrafts/packages-shared-logger";
import { sentryTransport } from "@indiecrafts/packages-shared-logger/sentry";

addTransport(sentryTransport(Sentry)); // error/fatal → captureException, else breadcrumbs
```

Wire it once per runtime (`instrumentation-client.ts`, `sentry.server.config.ts`,
`sentry.edge.config.ts`). This stack ships the **Cloudflare** transport wired (above), not Sentry —
`sentryTransport` stays as a drop-in alternative for a project that prefers Sentry: **Sentry-less,
Sentry-ready**.

## Deps

`@indiecrafts/packages-shared-config` only (`logging` + `getCurrentEnvironment`). Never imports an app or a module.
Consumers: app + blog + newsletter + waitlist.
