import { describe, expect, it } from "vitest";
import { buildErasureAdapters, type ErasureAdapterOpts } from "./adapters";
import type { Env } from "../index";

const full = {
  MAIN_DB: {},
  AUDIT_DB: {},
  GDPR_FINGERPRINT_SALT: "s",
  CLERK_SECRET_KEY: "sk",
  SANITY_API_WRITE_TOKEN: "w",
  SANITY_PROJECT_ID: "p",
  SANITY_DATASET: "d",
} as unknown as Env;

const names = (env: Env, opts?: ErasureAdapterOpts) =>
  buildErasureAdapters(env, opts)
    .map((a) => a.name)
    .sort();

describe("buildErasureAdapters", () => {
  it("includes all five when every secret is present", () => {
    expect(names(full)).toEqual([
      "clerk",
      "d1-audit",
      "d1-core",
      "orders",
      "sanity",
    ]);
  });
  it("excludes clerk when includeClerk is false (webhook path)", () => {
    expect(names(full, { includeClerk: false })).not.toContain("clerk");
  });
  it("omits sanity when its secrets are absent (no broken client)", () => {
    const noSanity = {
      ...full,
      SANITY_API_WRITE_TOKEN: undefined,
    } as unknown as Env;
    expect(names(noSanity)).not.toContain("sanity");
  });
  it("adds resend only when RESEND_API_KEY is set and not excluded", () => {
    const withResend = { ...full, RESEND_API_KEY: "re" } as unknown as Env;
    expect(names(full)).not.toContain("resend");
    expect(names(withResend)).toContain("resend");
    expect(names(withResend, { includeResend: false })).not.toContain("resend");
  });
});
