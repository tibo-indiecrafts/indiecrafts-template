// One shared gate for sensitive, per-user actions (self-service erasure + data export).
// It resolves the caller from their Clerk session JWT and (optionally) enforces step-up
// reverification. Extracted from a verbatim copy that lived in both erasure/self.ts and
// export/route.ts — a single source of truth so the two can't drift, and so export can
// enforce step-up too (its old copy hard-coded fvaMinutes:null).
import { reverificationError } from "@clerk/backend/internal";
import { type Env } from "../index";
import { createRealClerkClient } from "../erasure/clerk-client";

/** The resolved caller of a sensitive action. `fvaMinutes` is the first-factor age from
 *  the JWT `fva` claim (null when absent/not-applicable), used by the step-up gate. */
export type SelfAuth = {
  userId: string;
  email: string;
  fvaMinutes: number | null;
};

/** Clerk's own step-up window (see `factor1FreshEnough` in @clerk/shared): a first factor
 *  verified longer ago than this — or not applicable (fva === -1) — requires reverification. */
export const REVERIFY_WINDOW_MIN = 10;

/**
 * Verify the Clerk session JWT and resolve the caller's primary email + first-factor age.
 * Dynamic import keeps @clerk/backend out of the worker startup graph. Fails closed:
 * any missing token/secret or verify/resolve failure → null (unauthenticated).
 *
 * `verifyToken` returns `{ data, errors }` (not throwing); the installed @clerk/backend
 * types resolve these to `unknown`, so the claims are read via a narrow cast.
 */
export async function authenticateClerkJwt(
  request: Request,
  env: Env,
): Promise<SelfAuth | null> {
  const token = (request.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  if (!token || !env.CLERK_SECRET_KEY) return null;
  try {
    const { verifyToken } = await import("@clerk/backend");
    const { data: claims, errors } = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });
    if (errors || !claims) return null;
    const payload = claims as { sub?: unknown; fva?: unknown };
    const userId = typeof payload.sub === "string" ? payload.sub : null;
    if (!userId) return null;
    // fva = [firstFactorAgeMinutes, secondFactorAgeMinutes] | undefined; -1 = not
    // applicable. Runtime-validate before trusting it (never trust an uncast claim).
    const isValidFactorAge = (x: unknown): x is number =>
      typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
    const fvaMinutes =
      Array.isArray(payload.fva) && isValidFactorAge(payload.fva[0])
        ? payload.fva[0]
        : null;
    // Resolve the primary email from Clerk (the JWT omits it by default).
    const user = await createRealClerkClient(env.CLERK_SECRET_KEY).exportUser(
      userId,
    );
    const u = user as {
      primaryEmailAddressId?: string | null;
      emailAddresses?: Array<{ id: string; emailAddress: string }>;
    };
    const email =
      u.emailAddresses?.find((e) => e.id === u.primaryEmailAddressId)
        ?.emailAddress ??
      u.emailAddresses?.[0]?.emailAddress ??
      null;
    if (!email) return null;
    return { userId, email, fvaMinutes };
  } catch {
    return null; // any verify/resolve failure → unauthenticated (fail closed)
  }
}

/**
 * Step-up gate: a session whose first factor was verified too long ago (or `fva` is
 * absent/not-applicable) must reverify before a sensitive action runs — a raw API call
 * cannot bypass step-up. Returns the 403 reverification Response the client's
 * `useReverification` reacts to, or `null` when the session is fresh enough.
 */
export function requireStepUp(
  authed: SelfAuth,
  cors: Record<string, string>,
  afterMinutes: number = REVERIFY_WINDOW_MIN,
): Response | null {
  if (
    authed.fvaMinutes === null ||
    authed.fvaMinutes < 0 ||
    authed.fvaMinutes > afterMinutes
  )
    return new Response(
      JSON.stringify(
        reverificationError({ level: "first_factor", afterMinutes }),
      ),
      { status: 403, headers: { "content-type": "application/json", ...cors } },
    );
  return null;
}
