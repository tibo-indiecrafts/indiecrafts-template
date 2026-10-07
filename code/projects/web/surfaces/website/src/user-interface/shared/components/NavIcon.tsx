/**
 * Resolve a navigation icon name to its curated glyph.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/components/NavIcon.md
 */

import { Icon, isGlyph } from "@indiecrafts/packages-web-ui-icons/web";

/**
 * Draw the glyph an editor picked for a header link (the `navigation` doc's `icon`,
 * chosen from the curated `GLYPHS` list in Studio). Unknown or empty names render
 * nothing — the link just shows its label. Decorative: hidden from screen readers.
 */
export function NavIcon({ name, size = 16 }: { name?: string; size?: number }) {
  if (!name || !isGlyph(name)) return null;
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <Icon name={name} size={size} />
    </span>
  );
}
