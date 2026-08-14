import Image from "next/image";
import { cn } from "@indiecrafts/utils/cn";
import { sanityImageLoader } from "@indiecrafts/sanity/image";

type LogoImgProps = { src: string; alt: string; className?: string };

/**
 * A single logo image. `unoptimized` because editor-uploaded logos are often
 * SVG (next/image can't optimize SVG without `dangerouslyAllowSVG`) and are
 * already served from the Sanity CDN. Scales by height so wide wordmarks fit.
 *
 * Raster logos still get CDN-sized here (2× the ~96px slot for retina); the
 * loader leaves SVG untouched, so the `unoptimized` SVG path is preserved.
 */
function LogoImg({ src, alt, className }: LogoImgProps) {
  return (
    <Image
      src={sanityImageLoader({ src, width: 192, quality: 90 })}
      alt={alt}
      width={96}
      height={24}
      unoptimized
      priority
      className={cn("h-6 w-auto object-contain", className)}
    />
  );
}

type LogoProps = {
  /** Site name — the wordmark + image alt. Resolved from Sanity, passed in. */
  name: string;
  /** Main logo URL (Sanity). Absent → wordmark only. */
  logo?: string;
  /** Dark-theme logo URL (Sanity). Absent → `logo` shows on every theme. */
  logoDark?: string;
  className?: string;
  iconClassName?: string;
};

/**
 * Brand lockup: logo mark + the site-name wordmark. Logo URLs come from Sanity
 * (`siteSettings.logo` / `logoDark`), fetched server-side and passed in — this
 * stays presentational so it can render inside the client Header.
 *
 * Theme-safe with no JS: when a dark logo is set, both render and a pure-CSS
 * `dark:` swap (keyed on `data-theme` via the `@custom-variant dark` in
 * globals.css) shows the right one for light / dark / system / forced. No logo
 * at all → the wordmark alone (no static fallback — Sanity is the sole source).
 */
export function Logo({ name, logo, logoDark, className, iconClassName }: LogoProps) {
  return (
    <span className={cn("text-foreground inline-flex items-center gap-2", className)}>
      {logo ? (
        logoDark ? (
          <>
            <LogoImg
              src={logo}
              alt={name}
              className={cn("block dark:hidden", iconClassName)}
            />
            <LogoImg
              src={logoDark}
              alt={name}
              className={cn("hidden dark:block", iconClassName)}
            />
          </>
        ) : (
          <LogoImg src={logo} alt={name} className={iconClassName} />
        )
      ) : null}
      <span className="font-semibold">{name}</span>
    </span>
  );
}
