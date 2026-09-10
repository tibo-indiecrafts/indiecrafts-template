import { describe, it, expect } from "vitest";
import {
  SETTINGS,
  coerceSetting,
  effectiveSettings,
  SETTING_DEFAULTS,
} from "./settings";

describe("coerceSetting", () => {
  it("returns an in-range integer unchanged", () => {
    expect(coerceSetting("retention.audit_days", "120")).toBe(120);
  });
  it("clamps below the floor and above the ceiling", () => {
    expect(coerceSetting("retention.consent_days", "10")).toBe(1095); // floor
    expect(coerceSetting("retention.csp_days", "9999")).toBe(365); // ceiling
  });
  it("rejects an unknown key or a non-integer", () => {
    expect(coerceSetting("nope", "1")).toBeNull();
    expect(coerceSetting("retention.audit_days", "1.5")).toBeNull();
    expect(coerceSetting("retention.audit_days", "abc")).toBeNull();
  });
});

describe("effectiveSettings", () => {
  it("returns pure defaults for no rows", () => {
    expect(effectiveSettings([])).toEqual(SETTING_DEFAULTS);
  });
  it("applies a valid override and ignores invalid/unknown rows", () => {
    const got = effectiveSettings([
      { key: "retention.audit_days", value: "120" },
      { key: "retention.consent_days", value: "1" }, // clamped to floor 1095
      { key: "bogus", value: "5" }, // ignored
      { key: "ops.sla_warning_days", value: "x" }, // ignored
    ]);
    expect(got["retention.audit_days"]).toBe(120);
    expect(got["retention.consent_days"]).toBe(1095);
    expect(got["ops.sla_warning_days"]).toBe(
      SETTINGS["ops.sla_warning_days"].def,
    );
  });
});
