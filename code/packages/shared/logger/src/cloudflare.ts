import type { Transport } from "./transport";
import { jsonReporter } from "./reporters";

/**
 * A transport that forwards `error`/`fatal` records to **Cloudflare Workers Logs** —
 * one structured JSON line via `console.error`. `[observability.logs]` is on in every
 * Worker's `wrangler.toml`, so Workers Logs ingests + severity-classifies it. It reuses
 * the production `jsonReporter`, so a forwarded error is byte-identical to a normally
 * reported one — Workers Logs sees one consistent shape.
 *
 * WHY a transport, not just the reporter: production sets the console level to `silent`
 * (no request-log noise), which would also drop errors. Transports fire INDEPENDENT of
 * the console gate, so error/fatal still reach Workers Logs while the console stays
 * quiet. This is the Cloudflare counterpart to `./sentry` — Cloudflare-native, no vendor
 * SDK, no DSN.
 *
 * Wire it at a Worker entry, gated to production (so a non-prod console — which already
 * shows errors — does not log them twice):
 *
 *   import { addTransport } from "@indiecrafts/packages-shared-logger";
 *   import { cloudflareTransport } from "@indiecrafts/packages-shared-logger/cloudflare";
 *   import { getCurrentEnvironment } from "@indiecrafts/packages-shared-config";
 *   if (getCurrentEnvironment() === "production") addTransport(cloudflareTransport());
 *
 * The gate is self-correcting: if prod is ever mis-detected as non-prod, the transport
 * is not wired — but then the console is not silent either, so the normal reporter logs
 * the error. Errors reach Workers Logs either way, exactly once.
 *
 * A richer sink (Analytics Engine, an ingestion Worker) is a sibling transport; this one
 * keeps errors visible in Workers Logs by default.
 */
export function cloudflareTransport(): Transport {
  return {
    log(record) {
      if (record.level === "error" || record.level === "fatal") jsonReporter(record);
    },
  };
}
