/**
 * Re-export the logger public API.
 *
 * @see docs/reference/packages/shared/logger/src/index.md
 */
export { logger, createLogger } from "./logger";
export type { Logger, LogContext } from "./logger";

export { addTransport, clearTransports } from "./transport";
export type { Transport } from "./transport";

export { configure, setEnvironment } from "./config";

export { safeStringify, normalizeError } from "./core";
export type { LogLevel, LogRecord, NormalizedError } from "./core";
