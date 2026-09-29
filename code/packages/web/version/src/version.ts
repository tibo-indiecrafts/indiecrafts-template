/**
 * The version-check core — the compare + the `/api/version` response shape. String
 * identity, not semver: a deploy stamps a new opaque id (commit sha, else version), and
 * any bundle whose baked-in id differs from the live one is stale. Zero react/next
 * coupling; `use-version-check` owns the polling.
 *
 * @see docs/reference/packages/web/version/src/version.md
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
