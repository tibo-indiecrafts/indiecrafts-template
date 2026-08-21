import type { NormalizedError, LogRecord } from "./core";
import type { Transport } from "./transport";

/**
 * The minimal Sentry surface we use — a structural type, so this file imports
 * **nothing** from `@sentry/*`. Pass the real `Sentry` object at wire-up time;
 * `@sentry/nextjs`, `@sentry/browser`, and the Cloudflare SDK all satisfy it.
 */
export type SentryLike = {
  captureException: (
    error: unknown,
    hint?: { extra?: Record<string, unknown> },
  ) => unknown;
  addBreadcrumb?: (breadcrumb: {
    level?: string;
    message?: string;
    category?: string;
    data?: Record<string, unknown>;
  }) => void;
};

function toError(
  error: NormalizedError | undefined,
  fallbackMessage: string,
): unknown {
  if (!error) return new Error(fallbackMessage);
  const e = new Error(error.message);
  e.name = error.name;
  if (error.stack) e.stack = error.stack;
  return e;
}

/**
 * A transport that forwards `error`/`fatal` records to Sentry as exceptions and
 * lower levels as breadcrumbs (context, not noise). Opt-in — a project wires it:
 *
 *   import * as Sentry from "@sentry/nextjs";
 *   import { addTransport } from "@indiecrafts/packages-shared-logger";
 *   import { sentryTransport } from "@indiecrafts/packages-shared-logger/sentry";
 *   addTransport(sentryTransport(Sentry));
 *
 * Because the console gate is independent of transports, this still fires when the
 * prod console is silent — so production errors reach Sentry without console noise.
 */
export function sentryTransport(Sentry: SentryLike): Transport {
  return {
    log(record: LogRecord) {
      if (record.level === "error" || record.level === "fatal") {
        Sentry.captureException(toError(record.error, record.message), {
          extra: {
            ...(record.scope ? { scope: record.scope } : {}),
            message: record.message,
            ...record.context,
          },
        });
        return;
      }
      Sentry.addBreadcrumb?.({
        level: record.level,
        message: record.message,
        category: record.scope,
        data: record.context,
      });
    },
  };
}
