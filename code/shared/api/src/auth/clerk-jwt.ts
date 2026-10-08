/**
 * Verify a Clerk session JWT and return its claims.
 *
 * @see docs/reference/shared/api/src/auth/clerk-jwt.md
 */
import { withTimeout } from "../http";
import type { VerifyTokenOptions } from "@clerk/backend";
import type { Env } from "../index";

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

/** Verify the request's Clerk session JWT → the caller's user id (`sub`). No email/exportUser
 *  call — the self-service consent routes key on user_id and read email from user_profiles.
 *  The routes take it as an injectable default, so tests never load the SDK or hit the network. */
export async function verifyUserId(
  request: Request,
  env: Env,
): Promise<string | null> {
  if (!env.CLERK_SECRET_KEY) return null;
  const claims = await verifyClerkClaims(bearerToken(request), {
    secretKey: env.CLERK_SECRET_KEY,
  });
  return claims?.sub ?? null; // any verify failure → unauthenticated (fail closed)
}
