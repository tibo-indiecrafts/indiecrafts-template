import { describe, expect, it } from "vitest";
import { shouldAlert, formatSecurityAlert, ALERT_SEVERITIES } from "./alerts";

describe("shouldAlert", () => {
  it("alerts on high and critical only", () => {
    expect(shouldAlert("critical")).toBe(true);
    expect(shouldAlert("high")).toBe(true);
    expect(shouldAlert("medium")).toBe(false);
    expect(shouldAlert("low")).toBe(false);
    expect(shouldAlert("")).toBe(false);
  });
  it("exposes the alert set", () => {
    expect([...ALERT_SEVERITIES]).toEqual(["high", "critical"]);
  });
});

describe("formatSecurityAlert", () => {
  const base = {
    eventType: "data_exfiltration",
    severity: "critical",
    surface: "app",
    userId: "user_123",
    country: "FR",
    description: "bulk export attempt",
    ts: "2026-08-24T10:00:00.000Z",
  };
  it("puts type + severity + surface in the subject", () => {
    expect(formatSecurityAlert(base).subject).toBe(
      "[Security] critical — data_exfiltration (app)",
    );
  });
  it("lists the fields and never crashes on nulls", () => {
    const out = formatSecurityAlert({
      ...base,
      surface: null,
      userId: null,
      country: null,
      description: null,
    });
    expect(out.text).toContain("Severity: critical");
    expect(out.text).toContain("Type: data_exfiltration");
    expect(out.text).toContain("User: —");
  });
  it("adds a review link when adminUrl is given", () => {
    const out = formatSecurityAlert({
      ...base,
      adminUrl: "https://admin.example.com",
    });
    expect(out.text).toContain("https://admin.example.com/security");
  });
});
