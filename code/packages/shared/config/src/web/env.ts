/**
 * Environment detection + the CSP connect-src allowlist — the only functions that
 * read `process.env`, isolated in one file. `getCurrentEnvironment` gates robots +
 * CSP + the logger; `getCSPConnectSources` is consumed by `@indiecrafts/security`.
 */

import type { Environment } from "../shared/types";

export function getCurrentEnvironment(): Environment {
  const explicit = process.env.NEXT_PUBLIC_ENVIRONMENT;
  if (explicit === "staging") return "staging";
  if (explicit === "test") return "test";
  switch (process.env.NODE_ENV) {
    case "production":
      return "production";
    case "test":
      return "test";
    default:
      return "development";
  }
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
