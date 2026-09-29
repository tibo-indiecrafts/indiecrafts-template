"use client";

/**
 * Resolve a free-text Reicon name to its navigation glyph.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/components/NavIcon.md
 */

import { ReiconIcon } from "@indiecrafts/packages-web-ui-icons/web";

/**
 * Resolve a free-text Reicon name (as typed by an editor in the `navigation`
 * doc, e.g. "ShieldCheck") to its glyph, via the shared `ui-icons` brick. Unknown/
 * empty names render nothing — the link just shows its label.
 *
 * Icon names: https://reicon.dev (use the exact export name shown for each icon).
 */
export function NavIcon({ name, size = 16 }: { name?: string; size?: number }) {
  if (!name) return null;
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <ReiconIcon name={name} size={size} />
    </span>
  );
}
