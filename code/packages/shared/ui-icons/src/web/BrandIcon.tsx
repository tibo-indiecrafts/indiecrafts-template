import type { SVGProps } from "react";
import { BRANDS, type BrandName } from "../shared/brands";

export type BrandIconProps = SVGProps<SVGSVGElement> & {
  name: BrandName;
  /** Square px size (sets width + height). Default 24. */
  size?: number;
  /** Paint in the brand's official hex instead of `currentColor`. */
  brandColor?: boolean;
};

/**
 * Render a brand/social mark by name (web / DOM), from the shared path data.
 * Inherits `currentColor` by default; `brandColor` paints the official hex.
 */
export function BrandIcon({
  name,
  size = 24,
  brandColor = false,
  ...props
}: BrandIconProps) {
  const mark = BRANDS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={brandColor ? mark.hex : "currentColor"}
      role="img"
      aria-label={mark.title}
      {...props}
    >
      <path d={mark.path} />
    </svg>
  );
}
