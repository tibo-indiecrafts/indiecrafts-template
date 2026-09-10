import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultLocale } from "@indiecrafts/packages-shared-config";
import {
  authKind,
  canonicalAuthSlug,
  fetchAuthEmailStrings,
  resolveAuthCopy,
  type AuthEmailStrings,
} from "./sanity";

const env = { SANITY_PROJECT_ID: "p", SANITY_DATASET: "production" };

const strings: AuthEmailStrings = {
  authVerification: {
    subject: { en: "Code", fr: "Code FR" },
    intro: { fr: "Voici :" }, // fr-only
  },
  authMagicLink: { enabled: false, subject: { en: "ignored" } },
};

describe("authKind / canonicalAuthSlug (forgiving slug match)", () => {
  it("maps Clerk's exact slugs to a kind", () => {
    expect(authKind("verification_code")).toBe("verification");
    expect(authKind("reset_password_code")).toBe("reset");
    expect(authKind("magic_link_sign_in")).toBe("magic");
    expect(authKind("sign_in_from_new_device")).toBe("newDevice");
  });
  it("matches slug variants forgivingly (the undocumented new-device slug)", () => {
    expect(authKind("new_device_sign_in")).toBe("newDevice");
    expect(authKind("magic_link_sign_up")).toBe("magic");
    expect(authKind("password_reset")).toBe("reset");
    expect(authKind("VERIFICATION")).toBe("verification");
  });
  it("returns null for a non-auth slug", () => {
    expect(authKind("invitation")).toBeNull();
  });
  it("canonicalizes a varying slug to our template key", () => {
    expect(canonicalAuthSlug("new_device_sign_in")).toBe(
      "sign_in_from_new_device",
    );
    expect(canonicalAuthSlug("invitation")).toBeUndefined();
  });
});

describe("resolveAuthCopy", () => {
  it("resolves a slug's group in the recipient locale", () => {
    const c = resolveAuthCopy(strings, "verification_code", "fr");
    expect(c?.subject).toBe("Code FR");
    expect(c?.intro).toBe("Voici :");
  });

  it("falls back to the default locale, then undefined per field", () => {
    const c = resolveAuthCopy(strings, "verification_code", "zz");
    const subj = strings.authVerification!.subject as Record<string, string>;
    expect(c?.subject).toBe(subj[defaultLocale]);
    expect(c?.intro).toBeUndefined(); // fr-only, no default/zz → undefined
  });

  it("resolves via a variant slug (forgiving match), not just the exact key", () => {
    const c = resolveAuthCopy(strings, "VERIFICATION-code", "fr");
    expect(c?.subject).toBe("Code FR");
  });

  it("returns undefined when the group's enabled is false", () => {
    expect(
      resolveAuthCopy(strings, "magic_link_sign_in", "en"),
    ).toBeUndefined();
  });

  it("returns undefined for an unknown slug or null strings", () => {
    expect(resolveAuthCopy(strings, "some_other_email", "en")).toBeUndefined();
    expect(resolveAuthCopy(null, "verification_code", "en")).toBeUndefined();
  });
});

describe("fetchAuthEmailStrings", () => {
  it("returns null (no fetch) when Sanity is unconfigured", async () => {
    const f = vi.fn();
    expect(
      await fetchAuthEmailStrings({}, f as unknown as typeof fetch),
    ).toBeNull();
    expect(f).not.toHaveBeenCalled();
  });

  it("fetches the emailStrings singleton and returns its result", async () => {
    const f = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            result: { authVerification: { subject: { en: "Hi" } } },
          }),
          { status: 200 },
        ),
    );
    const r = await fetchAuthEmailStrings(env, f as unknown as typeof fetch);
    expect(r?.authVerification?.subject).toEqual({ en: "Hi" });
    expect(String(f.mock.calls[0][0])).toContain("emailStrings");
  });

  it("returns null on a non-ok response or a thrown fetch", async () => {
    const bad = vi.fn(async () => new Response("", { status: 500 }));
    expect(
      await fetchAuthEmailStrings(env, bad as unknown as typeof fetch),
    ).toBeNull();
    const threw = vi.fn(async () => {
      throw new Error("net");
    });
    expect(
      await fetchAuthEmailStrings(env, threw as unknown as typeof fetch),
    ).toBeNull();
  });

  it("caches the real-fetch read within the window (second call = no network)", async () => {
    let calls = 0;
    // Default `doFetch` === the stubbed global `fetch`, so the cacheable path runs
    // (an injected doFetch, as above, always bypasses the cache).
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls++;
        return new Response(
          JSON.stringify({
            result: { authVerification: { subject: { en: "Cached" } } },
          }),
          { status: 200 },
        );
      }),
    );
    const a = await fetchAuthEmailStrings(env);
    const b = await fetchAuthEmailStrings(env);
    expect(a?.authVerification?.subject).toEqual({ en: "Cached" });
    expect(b).toEqual(a);
    expect(calls).toBe(1); // second read served from the in-worker cache
  });
});

afterEach(() => vi.unstubAllGlobals());
