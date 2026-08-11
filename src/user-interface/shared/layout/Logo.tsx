import Image from "next/image";
import { site } from "@/config";
import { cn } from "@/lib/utils";

type LogoImgProps = { src: string; className?: string };

/**
 * A single logo image. `unoptimized` because editor-uploaded logos are often
 * SVG (next/image can't optimize SVG without `dangerouslyAllowSVG`) and are
 * already served from the Sanity CDN. Scales by height so wide wordmarks fit.
 */
function LogoImg({ src, className }: LogoImgProps) {
  return (
    <Image
      src={src}
      alt={site.name}
      width={96}
      height={24}
      unoptimized
      priority
      className={cn("h-6 w-auto object-contain", className)}
    />
  );
}

type LogoProps = {
  /** Main logo URL (Sanity). Absent → wordmark only. */
  logo?: string;
  /** Dark-theme logo URL (Sanity). Absent → `logo` shows on every theme. */
  logoDark?: string;
  className?: string;
  iconClassName?: string;
};

/**
 * Brand lockup: logo mark + `{site.name}` wordmark. Logo URLs come from Sanity
 * (`siteSettings.logo` / `logoDark`), fetched server-side and passed in — this
 * stays presentational so it can render inside the client Header.
 *
 * Theme-safe with no JS: when a dark logo is set, both render and a pure-CSS
 * `dark:` swap (keyed on `data-theme` via the `@custom-variant dark` in
 * globals.css) shows the right one for light / dark / system / forced. No logo
 * at all → the wordmark alone (no static fallback — Sanity is the sole source).
 */
export function Logo({ logo, logoDark, className, iconClassName }: LogoProps) {
  return (
    <span className={cn("text-foreground inline-flex items-center gap-2", className)}>
      {logo ? (
        logoDark ? (
          <>
            <LogoImg src={logo} className={cn("block dark:hidden", iconClassName)} />
            <LogoImg src={logoDark} className={cn("hidden dark:block", iconClassName)} />
          </>
        ) : (
          <LogoImg src={logo} className={iconClassName} />
        )
      ) : null}
      <span className="font-semibold">{site.name}</span>
    </span>
  );
}
