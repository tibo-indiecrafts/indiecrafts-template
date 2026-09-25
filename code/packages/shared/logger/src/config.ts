/**
 * Resolve the logger level, reporter, and redaction keys.
 *
 * @see docs/reference/packages/shared/logger/src/config.md
 */
import {
  getCurrentEnvironment,
  logging,
  type Environment,
  type LogLevel,
} from "@indiecrafts/packages-shared-config";
import { LEVEL_WEIGHT } from "./core";
import {
  browserReporter,
  jsonReporter,
  prettyReporter,
  type Reporter,
} from "./reporters";

const isBrowser =
  typeof window !== "undefined" &&
  typeof (window as { document?: unknown }).document !== "undefined";

/**
 * Runtime overrides — the escape hatch on top of the config-file defaults. Set
 * with `configure(...)` (e.g. crank the level while chasing a bug). `null` fields
 * fall back to the config/env resolution below.
 */
type Overrides = {
  level?: LogLevel;
  reporter?: Reporter;
  redactKeys?: readonly string[];
};
const overrides: Overrides = {};

/**
 * Force the environment. `process.env` is unreliable at edge module-load time, so
 * a Worker/middleware entry can call `setEnvironment(...)` once at startup.
 */
let envOverride: Environment | undefined;
export function setEnvironment(env: Environment): void {
  envOverride = env;
}

function currentEnv(): Environment {
  return envOverride ?? getCurrentEnvironment();
}

/** Programmatic config — highest precedence, above the config file + env var. */
export function configure(opts: Overrides): void {
  Object.assign(overrides, opts);
}

/** The active minimum console level: `configure` → `NEXT_PUBLIC_LOG_LEVEL` → per-env config default. */
export function resolveConsoleLevel(): LogLevel {
  if (overrides.level) return overrides.level;
  const fromEnv = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel | undefined;
  if (fromEnv && fromEnv in LEVEL_WEIGHT) return fromEnv;
  return logging.levels[currentEnv()] ?? "info";
}

/** Keys to redact from context (`configure` override, else the config default). */
export function resolveRedactKeys(): readonly string[] {
  return overrides.redactKeys ?? logging.redactKeys;
}

/** The active console reporter: `configure` override, else browser → prod=json / non-prod=pretty. */
export function resolveReporter(): Reporter {
  if (overrides.reporter) return overrides.reporter;
  if (isBrowser) return browserReporter;
  return currentEnv() === "production" ? jsonReporter : prettyReporter;
}
