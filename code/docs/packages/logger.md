# Logger (structured · edge-safe · Sentry-ready)

The one logging system for the app + every module — **beautiful in dev, structured JSON in prod,
Cloudflare-Workers-safe, Sentry-ready**. Lives in the **`@indiecrafts/logger`** brick
(`code/packages/shared/logger`), consumed as source. Pure `console.*` — **zero runtime deps** except
`@indiecrafts/config` — so it runs identically in the browser, server, edge middleware, and Workers
isolates.

Replaces the old 26-line `@indiecrafts/utils/logger` placeholder (its header even said "replace with
Pino/Datadog/Sentry per project"). pino/winston are Node-stream-based → **not edge-safe**; this is
`console`-based by design.

## Exports

| Import                                                | What it is                                                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `logger` (`.`)                                        | The root logger — `trace · debug · info · warn · error · fatal` + `child(scope)` · `time`/`timeEnd`. |
| `createLogger(scope?, ctx?)` (`.`)                    | A scoped logger (dot-joined scope, merged base context).                                             |
| `addTransport` · `configure` · `setEnvironment` (`.`) | Register a sink · override level/reporter/redaction at runtime · force env at edge module-load.      |
| `sentryTransport(Sentry)` (`./sentry`)                | The opt-in Sentry sink — **no `@sentry/*` dependency** (structural `SentryLike` type).               |
| `safeStringify` · `normalizeError` (`.`)              | The serialization helpers (circular/depth/array caps).                                               |

## Usage

```ts
import { logger } from "@indiecrafts/logger";

logger.info("subscriber confirmed", { id }); // dev: pretty · prod: silent
logger.error("send failed", err, { to }); // Error positional + context
logger.error("send failed", { error: err, to }); // …or the error nested in context (both work)

const log = logger.child("newsletter"); // scoped subsystem logger
log.warn("retrying", { attempt: 2 });
```

Never call `console.*` directly in app code — always the logger.

## Levels & per-environment config

Config is DATA in **`@indiecrafts/config` → `logging`** (resolution logic lives in the brick):

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

## Cloudflare — it just works

The prod `jsonReporter` writes with `console.*`, and **Cloudflare Workers Logs captures `console`
output automatically** — `[observability.logs] enabled = true` is already set in `wrangler.toml`. So
prod logs appear in the Workers Logs dashboard + `wrangler tail`, structured and queryable, with **no
extra wiring**. (Recall the app console is `silent` in prod by default — raise `NEXT_PUBLIC_LOG_LEVEL`
to actually emit, or rely on the Sentry transport for errors.)

## Sentry — opt-in transport

Transports fire **independent of the console gate**, so a prod-silent console still forwards errors.
The Sentry sink takes the Sentry instance as a parameter — **the brick has no `@sentry/*` dependency**:

```ts
import * as Sentry from "@sentry/nextjs"; // a project adds this + its DSN
import { addTransport } from "@indiecrafts/logger";
import { sentryTransport } from "@indiecrafts/logger/sentry";

addTransport(sentryTransport(Sentry)); // error/fatal → captureException, else breadcrumbs
```

Wire it once per runtime (`instrumentation-client.ts`, `sentry.server.config.ts`,
`sentry.edge.config.ts`). Without it, prod errors are silent (console off, no sink) — that's the lean
default: **Sentry-less, Sentry-ready**.

## Deps

`@indiecrafts/config` only (`logging` + `getCurrentEnvironment`). Never imports an app or a module.
Consumers: app + blog + newsletter + waitlist.
