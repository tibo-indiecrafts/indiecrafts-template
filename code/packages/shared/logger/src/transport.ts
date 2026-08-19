import type { LogRecord } from "./core";

/**
 * A sink that receives every record, **independent of the console level gate** —
 * so a prod-silent console can still forward errors to Sentry/Datadog/etc. A
 * transport self-filters (e.g. the Sentry one forwards only error/fatal). It must
 * never throw; the dispatcher already wraps it, but keep it defensive.
 */
export type Transport = { log: (record: LogRecord) => void };

const transports: Transport[] = [];

/** Register a transport (e.g. `addTransport(sentryTransport(Sentry))`). */
export function addTransport(transport: Transport): void {
  transports.push(transport);
}

/** Remove all transports — mainly for tests. */
export function clearTransports(): void {
  transports.length = 0;
}

export function getTransports(): readonly Transport[] {
  return transports;
}
