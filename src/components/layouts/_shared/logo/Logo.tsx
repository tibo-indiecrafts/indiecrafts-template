import Image from "next/image";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

type LogoIconProps = {
  className?: string;
};

/**
 * Square brand icon — renders `siteConfig.logo` (the asset at /public/logo.svg
 * by default). Drop a new file there (or change `siteConfig.logo`) and every
 * call site updates. `unoptimized` skips the Next image pipeline since the
 * asset is typically a hand-tuned SVG that doesn't benefit from re-encoding.
 */
export function LogoIcon({ className }: LogoIconProps) {
  return (
    <Image
      src={siteConfig.logo}
      alt={siteConfig.name}
      width={24}
      height={24}
      unoptimized
      priority
      className={cn("size-6", className)}
    />
  );
}

type LogoProps = {
  className?: string;
  /** Override the icon size (default `size-6`). */
  iconClassName?: string;
};

/** Brand mark + wordmark — pairs the project icon with `siteConfig.name`. */
export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <span className={cn("text-foreground inline-flex items-center gap-2", className)}>
      <LogoIcon className={cn("size-6", iconClassName)} />
      <span className="font-semibold">{siteConfig.name}</span>
    </span>
  );
}
