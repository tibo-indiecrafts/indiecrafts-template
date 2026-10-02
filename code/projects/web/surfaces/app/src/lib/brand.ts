/**
 * Read the configured brand logo (Sanity `siteSettings`) for the app's service screens.
 *
 * @see docs/reference/projects/web/app/src/lib/brand.md
 */
import { liveQuery } from "./sanity-live";

/** The brand as configured once in Sanity — the same `siteSettings` the website reads.
 *  `logo` / `logoDark` are Sanity CDN URLs; null fields = not configured. */
export type Brand = {
  name: string | null;
  logo: string | null;
  logoDark: string | null;
};

const readBrand = liveQuery<Brand>(
  '*[_id == "siteSettings"][0]{ "name": siteName, "logo": logo.asset->url, "logoDark": logoDark.asset->url }',
  "app brand",
);

/** The brand, or null when no logo is configured (or Sanity is unreachable). */
export async function getBrand(): Promise<Brand | null> {
  const brand = await readBrand();
  return brand?.logo ? brand : null;
}
