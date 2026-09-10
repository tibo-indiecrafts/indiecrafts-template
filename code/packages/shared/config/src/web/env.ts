/**
 * Environment detection + the CSP connect-src allowlist — the only functions that
 * read `process.env`, isolated in one file. `getCurrentEnvironment` gates robots +
 * CSP + the logger; `getCSPConnectSources` is consumed by `@indiecrafts/packages-shared-security`.
 */

import type { Environment } from "../shared/types";

const ENVIRONMENTS: readonly Environment[] = [
  "development",
  "staging",
  "test",
  "production",
];

/**
 * Validate an explicit `NEXT_PUBLIC_ENVIRONMENT` against the union. An unknown
 * non-empty value is a config mistake (typo, wrong CI var) — warn loudly instead
 * of silently degrading to `development`, then fall back to `NODE_ENV`.
 */
export function parseEnvironment(
  raw: string | undefined,
): Environment | undefined {
  if (!raw) return undefined;
  if ((ENVIRONMENTS as readonly string[]).includes(raw))
    return raw as Environment;
  console.warn(
    `[config] Ignoring unknown NEXT_PUBLIC_ENVIRONMENT="${raw}" (expected ${ENVIRONMENTS.join(" | ")}); falling back to NODE_ENV.`,
  );
  return undefined;
}

export function getCurrentEnvironment(): Environment {
  const explicit = parseEnvironment(process.env.NEXT_PUBLIC_ENVIRONMENT);
  if (explicit) return explicit;
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
}

/**
 * Clerk CSP hosts, derived from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. Empty when Clerk
 * is unconfigured, so the CSP is byte-for-byte unchanged until an operator sets the key.
 * The key encodes Clerk's Frontend-API host — `pk_(test|live)_<base64(host + "$")>` — and
 * ClerkJS loads from that host (script), talks to it + the telemetry host (XHR), opens an
 * iframe there (frame), pulls avatars from img.clerk.com, and spins a blob worker. The
 * enforced CSP must allow all of these or sign-in is blocked. Same env-gated pattern as
 * `getCSPConnectSources`; consumed by `@indiecrafts/packages-shared-security`.
 */
export type ClerkCspHosts = {
  script: string[];
  connect: string[];
  img: string[];
  frame: string[];
  worker: string[];
};

function clerkFrontendApi(key: string): string | null {
  const b64 = key.replace(/^pk_(test|live)_/, "");
  try {
    // atob is global on Node 22 + Workers; a malformed key throws → fail safe (no hosts).
    const host = atob(b64).replace(/\$+$/, "");
    return host ? `https://${host}` : null;
  } catch {
    return null;
  }
}

export function getClerkCspHosts(): ClerkCspHosts {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const fapi = key ? clerkFrontendApi(key) : null;
  if (!fapi) return { script: [], connect: [], img: [], frame: [], worker: [] };
  return {
    script: [fapi],
    connect: [fapi, "https://clerk-telemetry.com"],
    img: ["https://img.clerk.com"],
    frame: [fapi],
    worker: ["blob:"],
  };
}

export function getCSPConnectSources(env: Environment): readonly string[] {
  // Sanity Studio at /studio needs to reach the project API + CDN.
  // Safe to leave in prod CSP: the wildcard is locked to *.sanity.io.
  //
  // `registry.npmjs.org` — the embedded Studio polls npm for its own
  // package version ("you're running an outdated Studio" check). Not
  // critical, but without this entry the dev console fills with
  // `TypeError: Failed to fetch` from CSP blocking the request.
  const sanity = ["https://*.sanity.io", "wss://*.api.sanity.io"];
  const npm = ["https://registry.npmjs.org"];
  const common = ["'self'", ...sanity, ...npm];
  if (env === "development" || env === "test") {
    return [
      ...common,
      "ws://localhost:*",
      "http://localhost:*",
      "https://*.vercel.app",
    ];
  }
  return common;
}
