import { safeWebOrigin } from "./safe-web-origin";

describe("safeWebOrigin", () => {
  it("passes an https origin through unchanged", () => {
    expect(safeWebOrigin("https://indiecrafts.dev")).toBe(
      "https://indiecrafts.dev",
    );
    expect(safeWebOrigin("https://app.foo.dev/account")).toBe(
      "https://app.foo.dev/account",
    );
  });

  it("allows http://localhost for the local dev web stack", () => {
    expect(safeWebOrigin("http://localhost:3000")).toBe(
      "http://localhost:3000",
    );
    expect(safeWebOrigin("http://localhost")).toBe("http://localhost");
  });

  it("fails closed on a non-TLS remote origin", () => {
    expect(safeWebOrigin("http://evil.com")).toBeUndefined();
    // A LAN http origin is not localhost — rejected (use https or a tunnel for device testing).
    expect(safeWebOrigin("http://192.168.1.5:3000")).toBeUndefined();
    expect(safeWebOrigin("ftp://x")).toBeUndefined();
  });

  it("returns undefined for an empty or missing value", () => {
    expect(safeWebOrigin(undefined)).toBeUndefined();
    expect(safeWebOrigin("")).toBeUndefined();
  });
});
