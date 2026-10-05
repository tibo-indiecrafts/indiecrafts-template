import { describe, expect, it } from "vitest";
import { consentRestoreScript } from "./consent-restore";

const categories = [
  {
    key: "necessary",
    title: "Necessary",
    required: true,
    signals: ["security_storage" as const],
  },
  {
    key: "analytics",
    title: "Analytics",
    signals: ["analytics_storage" as const],
  },
  { key: "marketing", title: "Marketing", signals: ["ad_storage" as const] },
];

/** Run the snippet against a fake localStorage + gtag; return the consent updates sent. */
function run(stored: unknown) {
  const calls: unknown[][] = [];
  const script = consentRestoreScript({
    storageKey: "k",
    version: "v2",
    categories,
  });
  new Function("localStorage", "gtag", script)(
    { getItem: () => (stored === undefined ? null : JSON.stringify(stored)) },
    (...a: unknown[]) => calls.push(a),
  );
  return calls;
}

describe("consentRestoreScript", () => {
  it("restores a current record: granted categories + required ones", () => {
    const [call] = run({
      v: "v2",
      choices: { analytics: true, marketing: false },
    });
    expect(call?.slice(0, 2)).toEqual(["consent", "update"]);
    expect(call?.[2]).toMatchObject({
      security_storage: "granted",
      analytics_storage: "granted",
      ad_storage: "denied",
    });
  });

  it("sends nothing for no record, a stale version, or unreadable JSON", () => {
    expect(run(undefined)).toEqual([]);
    expect(run({ v: "v1", choices: { analytics: true } })).toEqual([]);
    const calls: unknown[] = [];
    new Function(
      "localStorage",
      "gtag",
      consentRestoreScript({ storageKey: "k", version: "v2", categories }),
    )({ getItem: () => "{not json" }, (...a: unknown[]) => calls.push(a));
    expect(calls).toEqual([]);
  });

  it("cannot be broken out of the <script> by a value", () => {
    const script = consentRestoreScript({
      storageKey: "</script><b>",
      version: "v",
      categories,
    });
    expect(script).not.toContain("</script>");
  });
});
