import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { STORAGE_KEY } from "./consent-store";
import type { ConsentCategory } from "./consent-signals";

// next/script → a plain <script> we can inspect (src, or the inline body).
vi.mock("next/script", () => ({
  default: ({
    src,
    id,
    children,
  }: {
    src?: string;
    id?: string;
    children?: string;
  }) => (
    <script data-src={src} data-id={id}>
      {children}
    </script>
  ),
}));

const categories: ConsentCategory[] = [
  { key: "necessary", title: "Necessary", required: true, signals: [] },
  { key: "stats", title: "Statistics", signals: ["analytics_storage"] },
  { key: "ads", title: "Ads", signals: ["ad_storage"] },
];
const store = (record: unknown) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
const ga = (requireConsent = true) =>
  render(
    <GoogleAnalytics
      id="G-TEST"
      version="v2"
      categories={categories}
      requireConsent={requireConsent}
    />,
  ).container.querySelectorAll("script");

afterEach(() => localStorage.clear());

describe("GoogleAnalytics — no Google request before consent", () => {
  it("loads nothing without a decision", () => {
    expect(ga()).toHaveLength(0);
  });

  it("loads nothing when analytics was refused, or the record is for an older version", () => {
    store({ v: "v2", t: 1, choices: { stats: false, ads: true } });
    expect(ga()).toHaveLength(0);
    localStorage.clear();
    store({ v: "v1", t: 1, choices: { stats: true } });
    expect(ga()).toHaveLength(0);
  });

  it("loads gtag.js + the init (default, restore, config) once analytics is granted", () => {
    store({ v: "v2", t: 1, choices: { stats: true } });
    const scripts = ga();
    expect(scripts[0]?.dataset.src).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-TEST",
    );
    const init = scripts[1]?.textContent ?? "";
    expect(init).toContain("gtag('consent', 'default'");
    expect(init).toContain('gtag("consent","update"');
    expect(init.indexOf("update")).toBeLessThan(
      init.indexOf("gtag('config', \"G-TEST\")"),
    );
  });

  it("loads GA as before when consent isn't required (no default-denied preamble)", () => {
    const scripts = ga(false);
    expect(scripts).toHaveLength(2);
    expect(scripts[1]?.textContent).not.toContain("'default'");
  });
});
