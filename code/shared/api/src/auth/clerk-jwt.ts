/**
 * Verify a Clerk session JWT and return its claims.
 *
 * @see docs/reference/shared/api/src/auth/clerk-jwt.md
 */
import { withTimeout } from "../http";
import type { VerifyTokenOptions } from "@clerk/backend";

/** The session claims the api reads: the user id, and the factor ages (`fva`) for step-up. */
export type ClerkClaims = { sub: string; fva?: unknown };

/**
 * `@clerk/backend` v3 `verifyToken` RETURNS the claims and THROWS on an invalid, expired
 * or forged token — it has no `{ data, errors }` result. Dynamic import keeps the library
 * out of the worker startup graph. Fails closed: any failure → null.
 */
export async function verifyClerkClaims(
  token: string,
  options: VerifyTokenOptions,
): Promise<ClerkClaims | null> {
  if (!token) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const claims = (await withTimeout(
      verifyToken(token, options),
      5000,
      "clerk",
    )) as {
      sub?: unknown;
      fva?: unknown;
    };
    return typeof claims.sub === "string"
      ? { sub: claims.sub, fva: claims.fva }
      : null;
  } catch {
    return null;
  }
}

/** The bearer token of a request (`Authorization: Bearer <jwt>`), or "". */
export const bearerToken = (request: Request): string =>
  (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
