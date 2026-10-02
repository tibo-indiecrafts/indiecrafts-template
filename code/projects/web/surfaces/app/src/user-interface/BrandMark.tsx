/**
 * Render the configured brand logo on the app's service screens.
 *
 * @see docs/reference/projects/web/app/src/user-interface/BrandMark.md
 */
import type { Brand } from "@/lib/brand";

/** The CDN-sized logo (2× a 48px slot) — a raw `<img>` with explicit Sanity params, as
 *  `.claude/rules/web/sanity-images.md` allows. */
const sized = (url: string) => `${url}?h=96&fit=max&auto=format`;

/**
 * The logo configured in Sanity (`siteSettings.logo`, `logoDark` for the dark theme),
 * for the 404 / error screens. The theme swap is pure CSS (`dark:`), like the website's
 * `Logo`. No brand → renders nothing (the screen still works).
 */
export function BrandMark({ brand }: { brand: Brand | null }) {
  if (!brand?.logo) return null;
  const alt = brand.name ?? "";
  return (
    <>
      <img
        src={sized(brand.logo)}
        alt={alt}
        height={48}
        className={brand.logoDark ? "h-12 w-auto dark:hidden" : "h-12 w-auto"}
      />
      {brand.logoDark ? (
        <img
          src={sized(brand.logoDark)}
          alt={alt}
          height={48}
          className="hidden h-12 w-auto dark:block"
        />
      ) : null}
    </>
  );
}
