/**
 * Minimal logger — replace with Pino/Datadog/Sentry wiring per project.
 * Never import `console.*` directly in production code.
 */

type Meta = Record<string, unknown>;

const prefix = "[indiecrafts]";

export const logger = {
  debug(msg: string, meta?: Meta) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(prefix, msg, meta ?? "");
    }
  },
  info(msg: string, meta?: Meta) {
    console.info(prefix, msg, meta ?? "");
  },
  warn(msg: string, meta?: Meta) {
    console.warn(prefix, msg, meta ?? "");
  },
  error(msg: string, err?: unknown, meta?: Meta) {
    console.error(prefix, msg, err, meta ?? "");
  },
};
