"use client";

import type { ComponentType } from "react";
import * as ReiconReact from "reicon-react";

/**
 * Resolve a free-text Reicon name (as typed by an editor in the `navigation`
 * doc, e.g. "ShieldCheck") to its `reicon-react` component. Unknown/empty names
 * render nothing — the link just shows its label. Namespace-imported on purpose
 * so any icon name resolves at runtime (the editor picked free-text over a
 * curated list); this pulls the full reicon-react set into the client bundle.
 *
 * Icon names: https://reicon.dev (use the exact export name shown for each icon).
 */
type ReiconProps = { size?: number; weight?: "Outline" | "Filled" };
const ICONS = ReiconReact as unknown as Record<string, ComponentType<ReiconProps>>;

export function NavIcon({ name, size = 16 }: { name?: string; size?: number }) {
  if (!name) return null;
  const Icon = ICONS[name];
  if (typeof Icon !== "function") return null;
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <Icon size={size} />
    </span>
  );
}
