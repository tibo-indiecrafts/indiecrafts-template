import Svg, { Path, type SvgProps } from "react-native-svg";
import { BRANDS, type BrandName } from "../shared/brands";

export type BrandIconProps = SvgProps & { name: BrandName };

/**
 * Render a brand/social mark by name (React Native), from the shared path data.
 * Tint via the `color` prop (react-native-svg resolves `currentColor` to it).
 */
export function BrandIcon({ name, ...props }: BrandIconProps) {
  const mark = BRANDS[name];
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <Path d={mark.path} fill="currentColor" />
    </Svg>
  );
}
