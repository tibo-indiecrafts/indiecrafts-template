/**
 * `@indiecrafts/packages-shared-version` — the portable version-check core, shared by
 * every shell's update prompt (web `app` · Expo). The compare is
 * STRING IDENTITY: a deploy stamps a new id (commit sha, else version), and any bundle
 * whose baked-in id differs from the live one is stale — NOT semver, deploys are opaque
 * ids. The poll mechanism is per-platform (DOM `visibilitychange`/`online` on web,
 * `AppState` on RN); this file is the whole portable surface. Zero react/next coupling.
 */

/** The `/api/version` response — the live deploy's id (`commit` preferred, else `version`). */
export type VersionResponse = { version?: string; commit?: string };

/** The conventional endpoint path a shell polls for the live deploy id. */
export const VERSION_ENDPOINT = "/api/version";

/** The live deploy's id from a response — `commit` (sha) preferred, else `version`. */
export function versionId(res: VersionResponse): string | null {
  return res.commit || res.version || null;
}

/** True when a new build shipped: the live id is known and differs from this bundle's `current`. */
export function isUpdateAvailable(
  current: string,
  latest: string | null,
): boolean {
  return latest !== null && latest !== current;
}
