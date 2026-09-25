/**
 * Define the log record shape and sanitize values for logging.
 *
 * @see docs/reference/packages/shared/logger/src/core.md
 */
import type { LogLevel } from "@indiecrafts/packages-shared-config";

export type { LogLevel };

/** The levels that actually emit (everything except the `silent` gate). */
export type EmitLevel = Exclude<LogLevel, "silent">;

/** Numeric severity — higher = more severe. `silent` sits above all, so nothing passes it. */
export const LEVEL_WEIGHT: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  silent: 100,
};

/** A normalized error attached to a record — plain + serializable. */
export type NormalizedError = { name: string; message: string; stack?: string };

/** One structured log event — exactly what reporters + transports receive. */
export type LogRecord = {
  level: EmitLevel;
  message: string;
  /** ISO 8601. */
  timestamp: string;
  scope?: string;
  /** Already sanitized + redacted (safe to serialize). */
  context?: Record<string, unknown>;
  error?: NormalizedError;
};

const MAX_DEPTH = 4;
const MAX_ARRAY = 20;
const MAX_STACK_LINES = 6;

/** Normalize any thrown value into `{ name, message, stack }`. */
export function normalizeError(err: unknown): NormalizedError | undefined {
  if (err == null) return undefined;
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: truncateStack(err.stack),
    };
  }
  return {
    name: "NonError",
    message: typeof err === "string" ? err : safeStringify(err),
  };
}

function truncateStack(stack?: string): string | undefined {
  if (!stack) return undefined;
  const lines = stack.split("\n");
  if (lines.length <= MAX_STACK_LINES) return stack;
  return [
    ...lines.slice(0, MAX_STACK_LINES),
    `    … (${lines.length - MAX_STACK_LINES} more lines)`,
  ].join("\n");
}

/**
 * Depth/array-capped, circular-safe, redacting deep clone into JSON-safe values.
 * Keys whose name matches `redactKeys` (case-insensitive) get `"[REDACTED]"`.
 * Never throws — logging must not crash the request.
 */
export function sanitize(
  value: unknown,
  redactKeys: readonly string[] = [],
  depth = 0,
  seen: WeakSet<object> = new WeakSet(),
): unknown {
  if (value == null) return value;
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return value;
  if (t === "bigint") return `${(value as bigint).toString()}n`;
  if (t === "function")
    return `[Function ${(value as { name?: string }).name || "anonymous"}]`;
  if (t === "symbol") return (value as symbol).toString();
  if (value instanceof Error) return normalizeError(value);
  if (value instanceof Date) return value.toISOString();
  if (depth >= MAX_DEPTH) return "[Truncated]";
  if (t === "object") {
    if (seen.has(value as object)) return "[Circular]";
    seen.add(value as object);
    if (Array.isArray(value)) {
      const arr: unknown[] = value
        .slice(0, MAX_ARRAY)
        .map((v) => sanitize(v, redactKeys, depth + 1, seen));
      if (value.length > MAX_ARRAY)
        arr.push(`… (${value.length - MAX_ARRAY} more)`);
      return arr;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = redactKeys.some((rk) => rk.toLowerCase() === k.toLowerCase())
        ? "[REDACTED]"
        : sanitize(v, redactKeys, depth + 1, seen);
    }
    return out;
  }
  return String(value);
}

/** `sanitize` + `JSON.stringify`, guaranteed not to throw. */
export function safeStringify(
  value: unknown,
  redactKeys: readonly string[] = [],
): string {
  try {
    return JSON.stringify(sanitize(value, redactKeys)) ?? String(value);
  } catch {
    return "[Unserializable]";
  }
}
