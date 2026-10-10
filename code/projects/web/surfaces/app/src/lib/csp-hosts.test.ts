import { describe, expect, it } from "vitest";
import { buildCsp } from "@indiecrafts/packages-shared-security";
import { appCspHosts } from "./csp-hosts";

describe("appCspHosts", () => {
  it("allows the website (live legal version) and the api Worker (legal sync)", () => {
    expect(appCspHosts("https://site.test/", "https://api.test/v1")).toEqual({
      connectSrc: ["https://site.test", "https://api.test"],
    });
  });

  it("drops an unset or malformed URL", () => {
    expect(appCspHosts("https://site.test", undefined)).toEqual({
      connectSrc: ["https://site.test"],
    });
    expect(appCspHosts("not a url", "")).toEqual({ connectSrc: [] });
  });

  it("reaches the production connect-src", () => {
    const csp = buildCsp(
      "production",
      appCspHosts("https://site.test", "https://api.test"),
    );
    expect(csp).toMatch(/connect-src [^;]*https:\/\/site\.test[^;]*https:\/\/api\.test/);
  });
});
