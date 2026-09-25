/**
 * Create scoped structured loggers and the root logger.
 *
 * @see docs/reference/packages/shared/logger/src/logger.md
 */
import {
  LEVEL_WEIGHT,
  normalizeError,
  sanitize,
  type EmitLevel,
  type LogRecord,
  type NormalizedError,
} from "./core";
import {
  resolveConsoleLevel,
  resolveReporter,
  resolveRedactKeys,
} from "./config";
import { getTransports } from "./transport";

export type LogContext = Record<string, unknown>;

/** Console (level-gated) ⊕ every transport (independent) — the split that keeps prod-silent yet Sentry-fed. */
function dispatch(record: LogRecord): void {
  if (LEVEL_WEIGHT[record.level] >= LEVEL_WEIGHT[resolveConsoleLevel()]) {
    try {
      resolveReporter()(record);
    } catch {
      /* a reporter must never break the caller */
    }
  }
  for (const transport of getTransports()) {
    try {
      transport.log(record);
    } catch {
      /* nor a transport */
    }
  }
}

/** A structured, scoped logger. `logger` is the root; `createLogger`/`child` add a scope + base context. */
export type Logger = {
  trace: (message: string, context?: LogContext) => void;
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  /** `error(msg, err, ctx?)` OR `error(msg, ctx)` — a plain 2nd arg is context (its `.error` is lifted). */
  error: (
    message: string,
    errOrContext?: unknown,
    context?: LogContext,
  ) => void;
  fatal: (
    message: string,
    errOrContext?: unknown,
    context?: LogContext,
  ) => void;
  /** A child logger — its scope is dot-joined, its base context merged into every call. */
  child: (scope: string, context?: LogContext) => Logger;
  time: (label: string) => void;
  timeEnd: (label: string, context?: LogContext) => void;
};

export function createLogger(scope?: string, baseContext?: LogContext): Logger {
  const timers = new Map<string, number>();

  function emit(
    level: EmitLevel,
    message: string,
    context?: LogContext,
    error?: NormalizedError,
  ): void {
    const merged = { ...baseContext, ...context };
    const redactKeys = resolveRedactKeys();
    const cleaned = Object.keys(merged).length
      ? (sanitize(merged, redactKeys) as Record<string, unknown>)
      : undefined;
    dispatch({
      level,
      message,
      timestamp: new Date().toISOString(),
      scope,
      context: cleaned,
      error,
    });
  }

  // Accepts both the 3-arg `error(msg, err, ctx)` and the common `error(msg, { error })`.
  function emitError(
    level: "error" | "fatal",
    message: string,
    errOrContext?: unknown,
    context?: LogContext,
  ): void {
    if (errOrContext instanceof Error) {
      emit(level, message, context, normalizeError(errOrContext));
      return;
    }
    if (errOrContext && typeof errOrContext === "object") {
      const ctx = { ...(errOrContext as LogContext) };
      const lifted = "error" in ctx ? ctx.error : undefined;
      if ("error" in ctx) delete ctx.error;
      emit(level, message, ctx, normalizeError(lifted));
      return;
    }
    emit(level, message, context);
  }

  return {
    trace: (message, context) => emit("trace", message, context),
    debug: (message, context) => emit("debug", message, context),
    info: (message, context) => emit("info", message, context),
    warn: (message, context) => emit("warn", message, context),
    error: (message, errOrContext, context) =>
      emitError("error", message, errOrContext, context),
    fatal: (message, errOrContext, context) =>
      emitError("fatal", message, errOrContext, context),
    child: (childScope, context) =>
      createLogger(scope ? `${scope}:${childScope}` : childScope, {
        ...baseContext,
        ...context,
      }),
    time: (label) => {
      timers.set(label, Date.now());
    },
    timeEnd: (label, context) => {
      const started = timers.get(label);
      if (started == null) return;
      timers.delete(label);
      emit("debug", `${label}: ${Date.now() - started}ms`, context);
    },
  };
}

/** The application-wide root logger. Prefer `logger.child("scope")` for a subsystem. */
export const logger = createLogger();
