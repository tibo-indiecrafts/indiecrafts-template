import { describe, it, expect } from "vitest";
import {
  grantedKeys,
  consentUpdate,
  acceptAllChoices,
  rejectAllChoices,
  DEFAULT_CONSENT_CATEGORIES,
  resolveCategories,
} from "./consent";
import {
  legalUrl,
  needsReacceptance,
  LEGAL_PAGES,
  LEGAL_PAGE_KEYS,
} from "./legal";
import type { ConsentCategory } from "./consent-signals";

const CATEGORIES: ConsentCategory[] = [
  {
    key: "necessary",
    title: "N",
    required: true,
    signals: ["security_storage"],
  },
  {
    key: "analytics",
    title: "A",
    required: false,
    signals: ["analytics_storage"],
  },
  { key: "marketing", title: "M", required: false, signals: ["ad_storage"] },
];

describe("grantedKeys", () => {
  it("always grants required categories, plus the chosen ones", () => {
    const granted = grantedKeys(CATEGORIES, { analytics: true });
    expect(granted.has("necessary")).toBe(true); // required, no choice needed
    expect(granted.has("analytics")).toBe(true);
    expect(granted.has("marketing")).toBe(false);
  });
});

describe("consentUpdate", () => {
  it("grants a signal iff a granted category lists it, denies the rest", () => {
    const update = consentUpdate(CATEGORIES, { analytics: true });
    expect(update.security_storage).toBe("granted"); // via required `necessary`
    expect(update.analytics_storage).toBe("granted");
    expect(update.ad_storage).toBe("denied"); // marketing not chosen
    expect(update.ad_user_data).toBe("denied"); // no category lists it here
  });
});

describe("accept/reject choices over the default taxonomy", () => {
  it("accept grants every non-required category; reject denies them", () => {
    expect(acceptAllChoices(DEFAULT_CONSENT_CATEGORIES)).toEqual({
      analytics: true,
      marketing: true,
    });
    expect(rejectAllChoices(DEFAULT_CONSENT_CATEGORIES)).toEqual({
      analytics: false,
      marketing: false,
    });
  });
});

describe("resolveCategories", () => {
  it("merges copy into the taxonomy, falling back to the key", () => {
    const resolved = resolveCategories(DEFAULT_CONSENT_CATEGORIES, {
      analytics: { title: "Analytics" },
    });
    expect(resolved.find((c) => c.key === "analytics")?.title).toBe(
      "Analytics",
    );
    expect(resolved.find((c) => c.key === "necessary")?.title).toBe(
      "necessary",
    );
    expect(resolved.find((c) => c.key === "necessary")?.required).toBe(true);
  });
});

describe("legalUrl", () => {
  it("builds the default-locale URL unprefixed", () => {
    expect(legalUrl("https://example.com", "privacy", "en")).toBe(
      "https://example.com/privacy-policy",
    );
  });
  it("builds a non-default locale URL with the /<code> prefix + localized slug", () => {
    expect(legalUrl("https://example.com", "privacy", "fr")).toBe(
      "https://example.com/fr/politique-de-confidentialite",
    );
  });
  it("trims a trailing slash on the base URL", () => {
    expect(legalUrl("https://example.com/", "terms", "en")).toBe(
      "https://example.com/terms",
    );
  });
  it("LEGAL_PAGE_KEYS excludes the data-request form", () => {
    expect(LEGAL_PAGE_KEYS).not.toContain("dataRequest");
    expect(Object.keys(LEGAL_PAGES)).toContain("dataRequest");
  });
});

describe("needsReacceptance", () => {
  it("is true with no prior acceptance", () => {
    expect(needsReacceptance(null, "2026-01")).toBe(true);
  });
  it("is true when the acked version is stale", () => {
    expect(needsReacceptance({ version: "2025-06", t: 0 }, "2026-01")).toBe(
      true,
    );
  });
  it("is false when the acked version matches current", () => {
    expect(needsReacceptance({ version: "2026-01", t: 0 }, "2026-01")).toBe(
      false,
    );
  });
});
