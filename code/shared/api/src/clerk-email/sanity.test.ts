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
  verification: {
    subject: { en: "Code", fr: "Code FR" },
    intro: { fr: "Voici :" }, // fr-only
  },
  magicLink: { enabled: false, subject: { en: "ignored" } },
};

describe("authKind / canonicalAuthSlug (forgiving slug match)", () => {
  it("maps the auth slugs to a kind", () => {
    expect(authKind("verification_code")).toBe("verification");
    expect(authKind("reset_password_code")).toBe("resetPassword");
    expect(authKind("magic_link_sign_in")).toBe("magicLink");
    expect(authKind("new_device_sign_in")).toBe("newDevice");
    expect(authKind("magic_link_sign_up")).toBe("magicLink");
    expect(authKind("VERIFICATION")).toBe("verification");
  });
  it("maps the security-notification slugs", () => {
    expect(authKind("password_changed")).toBe("passwordChanged");
    expect(authKind("password_removed")).toBe("passwordRemoved");
    expect(authKind("passkey_added")).toBe("passkeyAdded");
    expect(authKind("passkey_removed")).toBe("passkeyRemoved");
    expect(authKind("mfa_enabled")).toBe("mfaEnabled");
    expect(authKind("primary_email_address_changed")).toBe(
      "primaryEmailChanged",
    );
    expect(authKind("account_locked")).toBe("accountLocked");
    expect(authKind("invitation")).toBe("invitation");
  });
  it("orders reset/passkey ahead of password (substring collisions)", () => {
    expect(authKind("reset_password_code")).toBe("resetPassword");
    expect(authKind("passkey_removed")).toBe("passkeyRemoved");
  });
  it("returns null for a slug we don't localize", () => {
    expect(authKind("billing_receipt")).toBeNull();
    expect(authKind("waitlist_confirmation")).toBeNull();
  });
  it("canonicalizes a varying slug to our template key", () => {
    expect(canonicalAuthSlug("sign_in_from_new_device")).toBe(
      "new_device_sign_in",
    );
    expect(canonicalAuthSlug("billing_receipt")).toBeUndefined();
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
    const subj = strings.verification!.subject as Record<string, string>;
    expect(c?.subject).toBe(subj[defaultLocale]);
    expect(c?.intro).toBeUndefined(); // fr-only, no default/zz → undefined
  });

  it("resolves via a variant slug (forgiving match)", () => {
    const c = resolveAuthCopy(strings, "VERIFICATION-code", "fr");
    expect(c?.subject).toBe("Code FR");
  });

  it("returns undefined when the group's enabled is false", () => {
    expect(
      resolveAuthCopy(strings, "magic_link_sign_in", "en"),
    ).toBeUndefined();
  });

  it("returns undefined for an unknown slug or null strings", () => {
    expect(resolveAuthCopy(strings, "billing_receipt", "en")).toBeUndefined();
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

  it("reads clerkEmails groups + emailStrings.supportEmail in one query", async () => {
    const f = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            result: {
              clerk: { verification: { subject: { en: "Hi" } } },
              supportEmail: "support@x.com",
            },
          }),
          { status: 200 },
        ),
    );
    const r = await fetchAuthEmailStrings(env, f as unknown as typeof fetch);
    expect(r?.verification?.subject).toEqual({ en: "Hi" });
    expect(r?.supportEmail).toBe("support@x.com");
    const url = String(f.mock.calls[0][0]);
    expect(url).toContain("clerkEmails");
    expect(url).toContain("supportEmail");
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
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls++;
        return new Response(
          JSON.stringify({
            result: { clerk: { verification: { subject: { en: "Cached" } } } },
          }),
          { status: 200 },
        );
      }),
    );
    const a = await fetchAuthEmailStrings(env);
    const b = await fetchAuthEmailStrings(env);
    expect(a?.verification?.subject).toEqual({ en: "Cached" });
    expect(b).toEqual(a);
    expect(calls).toBe(1); // second read served from the in-worker cache
  });
});

afterEach(() => vi.unstubAllGlobals());
