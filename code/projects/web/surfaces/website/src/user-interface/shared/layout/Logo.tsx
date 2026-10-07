/**
 * Render the brand lockup — a theme-aware Sanity logo plus the site-name wordmark.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/Logo.md
 */
import Image from "next/image";
import { cn } from "@indiecrafts/packages-shared-utils/cn";
import { sanityImageLoader } from "@indiecrafts/packages-web-sanity/image";

type LogoImgProps = {
  src: string;
  className?: string;
  priority?: boolean;
};

/**
 * A single logo image. `unoptimized` because editor-uploaded logos are often
 * SVG (next/image can't optimize SVG without `dangerouslyAllowSVG`) and are
 * already served from the Sanity CDN. Scales by height so wide wordmarks fit.
 *
 * Raster logos still get CDN-sized here (2× the ~96px slot for retina); the
 * loader leaves SVG untouched, so the `unoptimized` SVG path is preserved.
 *
 * `alt=""`: the wordmark next to it always names the site, so the image is
 * decorative. Naming it too made screen readers say the name twice.
 */
function LogoImg({ src, className, priority = true }: LogoImgProps) {
  return (
    <Image
      src={sanityImageLoader({ src, width: 192, quality: 90 })}
      alt=""
      width={96}
      height={24}
      unoptimized
      priority={priority}
      className={cn("h-6 w-auto object-contain", className)}
    />
  );
}

type LogoProps = {
  /** Site name — the wordmark (the image is decorative). Resolved from Sanity, passed in. */
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
            <LogoImg src={logo} className={cn("block dark:hidden", iconClassName)} />
            {/* Not `priority`: the dark logo preloads only when dark mode is active. */}
            <LogoImg
              src={logoDark}
              priority={false}
              className={cn("hidden dark:block", iconClassName)}
            />
          </>
        ) : (
          <LogoImg src={logo} className={iconClassName} />
        )
      ) : null}
      <span className="min-w-0 truncate font-semibold">{name}</span>
    </span>
  );
}
