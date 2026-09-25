/**
 * Render a custom SVG mark by name for React Native.
 *
 * @see docs/reference/packages/shared/ui-icons/src/native/SvgIcon.md
 */
import Svg, { Path, type SvgProps } from "react-native-svg";
import { SVGS, type SvgName } from "../shared/svgs";

export type SvgIconProps = SvgProps & { name: SvgName };

/** Render a custom SVG by name (React Native), from the shared registry. Tint via `color`. */
export function SvgIcon({ name, ...props }: SvgIconProps) {
  const mark = SVGS[name];
  return (
    <Svg viewBox={mark.viewBox} {...props}>
      <Path d={mark.path} fill="currentColor" />
    </Svg>
  );
}
