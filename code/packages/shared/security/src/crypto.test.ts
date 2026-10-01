import { describe, expect, it } from "vitest";

import {
  decrypt,
  decryptObject,
  encrypt,
  encryptObject,
  fingerprintEmail,
  hashIpAddress,
  isEncryptedData,
  sha256Hex,
  verifyIpHash,
} from "./crypto";

const SECRET = "test-secret-key-do-not-use-in-prod";

describe("encrypt / decrypt", () => {
  it("round-trips a string", async () => {
    const enc = await encrypt("42 Sunny Lane, Apt 3", SECRET);
    expect(enc.version).toBe(1);
    expect(enc.ciphertext).not.toContain("Sunny");
    expect(await decrypt(enc, SECRET)).toBe("42 Sunny Lane, Apt 3");
  });

  it("round-trips an object", async () => {
    const value = { street: "1 Rue de la Paix", zip: "75002" };
    expect(
      await decryptObject(await encryptObject(value, SECRET), SECRET),
    ).toEqual(value);
  });

  it("rejects a wrong key or tampered ciphertext (auth tag)", async () => {
    const enc = await encrypt("secret", SECRET);
    await expect(decrypt(enc, "wrong-key")).rejects.toThrow();
    // Flip the last hex digit — always a change (a fixed "00" suffix was a no-op 1 in 256).
    const last = enc.ciphertext.at(-1) === "0" ? "1" : "0";
    await expect(
      decrypt(
        { ...enc, ciphertext: `${enc.ciphertext.slice(0, -1)}${last}` },
        SECRET,
      ),
    ).rejects.toThrow();
  });

  it("uses a fresh IV each call (same plaintext → different ciphertext)", async () => {
    const a = await encrypt("x", SECRET);
    const b = await encrypt("x", SECRET);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });
});

describe("hashIpAddress", () => {
  it("is deterministic, salted, and one-way", async () => {
    const h = await hashIpAddress("192.168.1.1", "salt");
    expect(h).toBe(await hashIpAddress("192.168.1.1", "salt"));
    expect(h).not.toBe(await hashIpAddress("192.168.1.1", "other-salt"));
    expect(h).not.toContain("192.168");
    expect(await verifyIpHash("192.168.1.1", h, "salt")).toBe(true);
    expect(await verifyIpHash("10.0.0.1", h, "salt")).toBe(false);
  });
});

describe("isEncryptedData", () => {
  it("recognises the shape, rejects others", async () => {
    expect(isEncryptedData(await encrypt("x", SECRET))).toBe(true);
    expect(isEncryptedData({ ciphertext: "x" })).toBe(false);
    expect(isEncryptedData(null)).toBe(false);
    expect(isEncryptedData("nope")).toBe(false);
  });
});

describe("fingerprintEmail", () => {
  it("is deterministic, salted, normalised, and one-way", async () => {
    const f = await fingerprintEmail("User@Example.com ", "salt");
    // case-folded + trimmed → same as the normalised form
    expect(f).toBe(await fingerprintEmail("user@example.com", "salt"));
    // salt-sensitive
    expect(f).not.toBe(
      await fingerprintEmail("user@example.com", "other-salt"),
    );
    // hex shape, not recoverable
    expect(f).toMatch(/^[0-9a-f]{64}$/);
    expect(f).not.toContain("example");
    // known-answer test — guards the algorithm and the Task 6 node:crypto twin
    expect(await fingerprintEmail("a@b.com", "salt")).toBe(
      "d3bdaa92b6373f6067a450fb11488f88965636df6452f34eff6ffaf7803b1db0",
    );
    await expect(fingerprintEmail("", "salt")).rejects.toThrow();
    await expect(fingerprintEmail("a@b.com", "")).rejects.toThrow();
  });
});

describe("sha256Hex", () => {
  it("is deterministic, hex, case-sensitive (no lowercasing)", async () => {
    const h = await sha256Hex("Abc-123");
    expect(h).toBe(await sha256Hex("Abc-123"));
    expect(h).not.toBe(await sha256Hex("abc-123")); // case-sensitive, unlike fingerprintEmail
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    await expect(sha256Hex("")).rejects.toThrow();
  });
});
