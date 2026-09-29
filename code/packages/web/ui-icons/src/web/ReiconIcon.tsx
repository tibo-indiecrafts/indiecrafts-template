"use client";
/**
 * Render a reicon glyph by name for the web.
 *
 * @see docs/reference/packages/web/ui-icons/src/web/ReiconIcon.md
 */
import type { ComponentType } from "react";
import * as ReiconReact from "reicon-react";

export type ReiconIconProps = {
  /** A reicon component name, e.g. `"ShieldCheck"` (see reicon.dev). */
  name: string;
  /** Rendered when `name` isn't a reicon icon. */
  fallback?: string;
  size?: number;
  weight?: "Outline" | "Filled";
  className?: string;
};

type ReiconGlyphProps = Omit<ReiconIconProps, "name" | "fallback">;
// reicon-react ships its icons as named exports; resolve by name (web-only — no RN build).
const SET = ReiconReact as unknown as Record<
  string,
  ComponentType<ReiconGlyphProps>
>;

/** Render a reicon glyph by name (web). Returns null on an unknown name. */
export function ReiconIcon({ name, fallback, ...props }: ReiconIconProps) {
  const Glyph = SET[name] ?? (fallback ? SET[fallback] : undefined);
  return typeof Glyph === "function" ? <Glyph {...props} /> : null;
}
