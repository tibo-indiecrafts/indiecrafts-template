/**
 * `@indiecrafts/packages-web-ui-icons/web` — the WEB (DOM) renderers, over the shared
 * contract. `Icon` draws a curated glyph via `lucide-react`; `BrandIcon` draws a brand
 * mark via inline `<svg>`. Re-exports the contract for one-import ergonomics.
 */
export { Icon, GLYPH_COMPONENTS, type IconProps } from "./Icon";
export { BrandIcon, type BrandIconProps } from "./BrandIcon";
export { SvgIcon, type SvgIconProps } from "./SvgIcon";
export * from "../shared";
