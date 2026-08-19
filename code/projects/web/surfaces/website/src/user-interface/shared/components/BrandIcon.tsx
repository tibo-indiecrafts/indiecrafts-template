/**
 * The shape this renders. `reicon-brands` icons satisfy it structurally, and
 * so can a hand-declared mark for a brand the set doesn't carry (e.g. LinkedIn,
 * pulled from Simple Icons after a trademark request, so every mirror lacks it).
 */
export type BrandMark = {
  /** Official brand hex, WITHOUT the leading "#". */
  hex: string;
  title: string;
  /** The icon's static `<path>` markup. */
  svgContent: string;
};

/**
 * Renders a `reicon-brands` icon — or any `BrandMark` — in React.
 *
 * The brand icons are framework-agnostic factories: calling `icon(opts)`
 * builds a DOM node via `document.createElementNS`, which throws during SSR.
 * So instead we construct the `<svg>` ourselves from `icon.svgContent` (the
 * icon's static `<path>` markup) — server-safe and fully controllable.
 *
 * Pass `brandColor` to paint it in the brand's official hex (e.g. GitHub
 * `#181717`); otherwise it inherits `currentColor` like any other icon.
 *
 *   import { Github } from "reicon-brands";
 *   <BrandIcon icon={Github} size={28} brandColor />
 */
export function BrandIcon({
  icon,
  size = 24,
  brandColor = false,
  className,
  title,
}: {
  icon: BrandMark;
  size?: number;
  brandColor?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={brandColor ? `#${icon.hex}` : "currentColor"}
      role="img"
      aria-label={title ?? icon.title}
      className={className}
      // `svgContent` is the library's own static path markup — no user input,
      // so injecting it is safe. It's the only SSR-compatible render path
      // reicon-brands exposes (the callable form needs `document`).
      dangerouslySetInnerHTML={{ __html: icon.svgContent }}
    />
  );
}
