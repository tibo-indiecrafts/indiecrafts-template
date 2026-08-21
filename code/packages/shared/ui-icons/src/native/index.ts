/**
 * `@indiecrafts/packages-shared-ui-icons/native` — the React Native renderers, over the
 * shared contract. `Icon` via `lucide-react-native`; `BrandIcon` via `react-native-svg`.
 * A mobile app adopts these with `npx expo install lucide-react-native react-native-svg`
 * (Expo pins the RN-svg version), then imports from here. Re-exports the contract.
 */
export { Icon, GLYPH_COMPONENTS, type IconProps } from "./Icon";
export { BrandIcon, type BrandIconProps } from "./BrandIcon";
export { SvgIcon, type SvgIconProps } from "./SvgIcon";
export * from "../shared";
