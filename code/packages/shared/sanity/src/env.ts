/**
 * Sanity client config — pulled from env vars so the same code runs in
 * dev, preview, and prod. Project ID + dataset are public (safe to
 * expose), tokens are not.
 */

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing NEXT_PUBLIC_SANITY_DATASET",
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

/**
 * Where the embedded Studio mounts (`/app/studio/[[...tool]]/page.tsx`) — also the
 * stega `studioUrl` the shared client stamps into click-to-edit overlays. Only the
 * **hub** app actually mounts a Studio here; env-overridable so another app in the
 * platform can point it elsewhere (or a read-only app can ignore it — stega only
 * fires in draft mode). Default matches the hub's route.
 */
export const studioBasePath =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_BASE_PATH ?? "/studio";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
