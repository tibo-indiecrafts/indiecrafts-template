/**
 * Render log records to the console for dev, browser, and production.
 *
 * @see docs/reference/packages/shared/logger/src/reporters.md
 */
import type { EmitLevel, LogRecord } from "./core";
import { safeStringify } from "./core";

/** A reporter renders a record to the console. */
export type Reporter = (record: LogRecord) => void;

/** Route each level to the matching `console` method (so Cloudflare Workers Logs classifies severity). */
const CONSOLE_METHOD: Record<EmitLevel, "debug" | "info" | "warn" | "error"> = {
  trace: "debug",
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  fatal: "error",
};

const ANSI = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
} as const;

const LEVEL_COLOR: Record<EmitLevel, string> = {
  trace: ANSI.gray,
  debug: ANSI.blue,
  info: ANSI.cyan,
  warn: ANSI.yellow,
  error: ANSI.red,
  fatal: ANSI.magenta + ANSI.bold,
};

const isBrowser =
  typeof window !== "undefined" &&
  typeof (window as { document?: unknown }).document !== "undefined";

/** ANSI only on a non-browser TTY that hasn't opted out via NO_COLOR. */
function useColor(): boolean {
  if (isBrowser) return false;
  if (typeof process === "undefined") return false;
  if (process.env.NO_COLOR) return false;
  const stdout = (process as { stdout?: { isTTY?: boolean } }).stdout;
  return Boolean(stdout?.isTTY);
}

function clockTime(iso: string): string {
  // HH:MM:SS.mmm — the date is redundant in a live dev stream.
  const t = iso.split("T")[1] ?? iso;
  return t.replace("Z", "");
}

/** Human dev reporter — colored level badge · dim time · dim scope · message · context. */
export const prettyReporter: Reporter = (record) => {
  const color = useColor();
  const c = (code: string, s: string) =>
    color ? `${code}${s}${ANSI.reset}` : s;
  const badge = c(
    LEVEL_COLOR[record.level],
    record.level.toUpperCase().padEnd(5),
  );
  const time = c(ANSI.dim, clockTime(record.timestamp));
  const scope = record.scope ? ` ${c(ANSI.dim, `[${record.scope}]`)}` : "";
  const parts = [time, badge + scope, record.message];
  if (record.context && Object.keys(record.context).length)
    parts.push(c(ANSI.gray, safeStringify(record.context)));
  const line = parts.join("  ");
  console[CONSOLE_METHOD[record.level]](line);
  if (record.error?.stack)
    console[CONSOLE_METHOD[record.level]](
      color ? c(ANSI.dim, record.error.stack) : record.error.stack,
    );
};

/** Browser reporter — a CSS-styled `%c` badge + the record. */
export const browserReporter: Reporter = (record) => {
  const css: Record<EmitLevel, string> = {
    trace: "color:#888",
    debug: "color:#3b82f6",
    info: "color:#06b6d4",
    warn: "color:#eab308",
    error: "color:#ef4444;font-weight:bold",
    fatal: "color:#d946ef;font-weight:bold",
  };
  const label = `%c${record.level.toUpperCase()}%c${record.scope ? ` [${record.scope}]` : ""}`;
  const extra: unknown[] = [];
  if (record.context && Object.keys(record.context).length)
    extra.push(record.context);
  if (record.error) extra.push(record.error);
  console[CONSOLE_METHOD[record.level]](
    label,
    css[record.level],
    "color:inherit",
    record.message,
    ...extra,
  );
};

/** Production / Workers reporter — one structured JSON line (Workers Logs / Datadog / Axiom friendly). */
export const jsonReporter: Reporter = (record) => {
  const payload = {
    level: record.level,
    time: record.timestamp,
    ...(record.scope ? { scope: record.scope } : {}),
    msg: record.message,
    ...(record.context ?? {}),
    ...(record.error ? { err: record.error } : {}),
  };
  console[CONSOLE_METHOD[record.level]](safeStringify(payload));
};
