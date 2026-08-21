import { afterEach, describe, expect, it, vi } from "vitest";
import type { LogRecord } from "./core";
import { cloudflareTransport } from "./cloudflare";

function record(level: LogRecord["level"], message = "boom"): LogRecord {
  return {
    level,
    message,
    timestamp: "2026-01-01T00:00:00.000Z",
    ...(level === "error" || level === "fatal"
      ? { error: { name: "Error", message } }
      : {}),
  };
}

afterEach(() => vi.restoreAllMocks());

describe("cloudflareTransport", () => {
  it("forwards an error record to console.error as one JSON line", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    cloudflareTransport().log(record("error"));
    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0][0] as string;
    expect(line).toContain('"level":"error"');
    expect(line).toContain('"msg":"boom"');
  });

  it("forwards a fatal record too", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    cloudflareTransport().log(record("fatal"));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("ignores non-error levels (the console gate handles those)", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = cloudflareTransport();
    t.log(record("info"));
    t.log(record("warn"));
    expect(err).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });
});
