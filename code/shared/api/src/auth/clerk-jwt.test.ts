import { describe, expect, it } from "vitest";
import { verifyClerkClaims } from "./clerk-jwt";

// A real RS256 session token, verified by the REAL @clerk/backend through `jwtKey`
// (networkless). This pins the library contract: v3 `verifyToken` RETURNS the claims and
// THROWS on a bad token — reading `{ data, errors }` rejected every valid token.
const b64url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const json64 = (value: unknown) =>
  b64url(new TextEncoder().encode(JSON.stringify(value)));

async function mint(claims: Record<string, unknown>) {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  const now = Math.floor(Date.now() / 1000);
  const body = `${json64({ alg: "RS256", typ: "JWT", kid: "test" })}.${json64({ iat: now, nbf: now - 5, exp: now + 60, ...claims })}`;
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(body),
  );
  const spki = btoa(
    String.fromCharCode(
      ...new Uint8Array(await crypto.subtle.exportKey("spki", publicKey)),
    ),
  );
  const pem = `-----BEGIN PUBLIC KEY-----\n${spki.match(/.{1,64}/g)!.join("\n")}\n-----END PUBLIC KEY-----`;
  return { token: `${body}.${b64url(sig)}`, jwtKey: pem };
}

describe("verifyClerkClaims", () => {
  it("returns the claims of a valid session token", async () => {
    const { token, jwtKey } = await mint({ sub: "user_123", fva: [3, -1] });
    const claims = await verifyClerkClaims(token, { jwtKey });
    expect(claims?.sub).toBe("user_123");
    expect(claims?.fva).toEqual([3, -1]);
  });

  it("returns null for a forged, expired or empty token (fail closed)", async () => {
    const { token } = await mint({ sub: "user_123" });
    const other = await mint({ sub: "user_123" });
    expect(await verifyClerkClaims(token, { jwtKey: other.jwtKey })).toBeNull();
    const expired = await mint({
      sub: "user_123",
      exp: Math.floor(Date.now() / 1000) - 600,
    });
    expect(
      await verifyClerkClaims(expired.token, { jwtKey: expired.jwtKey }),
    ).toBeNull();
    expect(await verifyClerkClaims("", { jwtKey: other.jwtKey })).toBeNull();
  });

  it("returns null when the token has no subject", async () => {
    const { token, jwtKey } = await mint({});
    expect(await verifyClerkClaims(token, { jwtKey })).toBeNull();
  });
});
