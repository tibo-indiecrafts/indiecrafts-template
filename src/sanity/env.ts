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

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

/** Where the embedded Studio mounts (`/app/studio/[[...tool]]/page.tsx`). */
export const studioBasePath = "/studio";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
