import type { SVGProps } from "react";
import { SVGS, type SvgName } from "../shared/svgs";

export type SvgIconProps = SVGProps<SVGSVGElement> & { name: SvgName };

/** Render a custom SVG by name (web / DOM), from the shared registry. */
export function SvgIcon({ name, ...props }: SvgIconProps) {
  const mark = SVGS[name];
  return (
    <svg viewBox={mark.viewBox} fill="currentColor" aria-hidden="true" {...props}>
      <path d={mark.path} />
    </svg>
  );
}
