import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addTransport,
  clearTransports,
  configure,
  createLogger,
  logger,
  safeStringify,
  setEnvironment,
  type LogRecord,
} from "./index";

/** Capture every dispatched record via a transport (fires regardless of the console gate). */
function captureRecords(): LogRecord[] {
  const records: LogRecord[] = [];
  addTransport({ log: (r) => records.push(r) });
  return records;
}

beforeEach(() => {
  clearTransports();
  configure({ level: undefined, reporter: undefined, redactKeys: undefined });
  vi.restoreAllMocks();
});

describe("console gating by environment", () => {
  it("prints info in development", () => {
    setEnvironment("development");
    const spy = vi.spyOn(console, "info").mockImplementation(() => {});
    logger.info("hello");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("is fully silent on the console in production", () => {
    setEnvironment("production");
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.info("quiet");
    logger.error("boom", new Error("x"));
    expect(info).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it("NEXT_PUBLIC_LOG_LEVEL override re-enables the console in production", () => {
    setEnvironment("production");
    configure({ level: "debug" });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("now visible");
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("transports fire independent of the console gate", () => {
  it("prod-silent console still forwards error to a transport", () => {
    setEnvironment("production");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const records = captureRecords();
    logger.error("db down", new Error("ECONN"));
    expect(records).toHaveLength(1);
    expect(records[0].level).toBe("error");
    expect(records[0].error?.message).toBe("ECONN");
  });
});

describe("error() signature back-compat", () => {
  it("lifts an error nested in a context object", () => {
    setEnvironment("production");
    const records = captureRecords();
    logger.error("failed", { error: new Error("boom"), postId: "1" });
    expect(records[0].error?.message).toBe("boom");
    expect(records[0].context).toEqual({ postId: "1" });
  });

  it("takes an Error positional + a context", () => {
    setEnvironment("production");
    const records = captureRecords();
    logger.error("route error", new Error("kaboom"), { digest: "abc" });
    expect(records[0].error?.message).toBe("kaboom");
    expect(records[0].context).toEqual({ digest: "abc" });
  });
});

describe("redaction", () => {
  it("masks configured keys, keeps the rest", () => {
    setEnvironment("production");
    const records = captureRecords();
    logger.warn("login", { password: "hunter2", user: "jo" });
    expect(records[0].context).toEqual({ password: "[REDACTED]", user: "jo" });
  });
});

describe("scoped child logger", () => {
  it("dot-joins scopes", () => {
    setEnvironment("production");
    const records = captureRecords();
    createLogger("api").child("emails").info("sent");
    expect(records[0].scope).toBe("api:emails");
  });
});

describe("safeStringify", () => {
  it("survives a circular reference", () => {
    const a: Record<string, unknown> = { name: "a" };
    a.self = a;
    expect(() => safeStringify(a)).not.toThrow();
    expect(safeStringify(a)).toContain("[Circular]");
  });
});
