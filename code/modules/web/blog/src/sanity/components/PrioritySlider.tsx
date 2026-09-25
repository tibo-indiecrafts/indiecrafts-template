/**
 * Render the Studio priority range input for a post.
 *
 * @see docs/reference/modules/web/blog/src/sanity/components/PrioritySlider.md
 */
import type { ChangeEvent } from "react";
import { set, unset, type NumberInputProps } from "sanity";

const MIN = 0;
const MAX = 10;

/**
 * Priority slider — a native `<input type="range">` for the post `priority`
 * field. 0 = ranked by date; higher = pinned toward the top of listings.
 *
 * Deliberately dependency-free (native range input, no `@sanity/ui`, no Radix)
 * — this is the one custom Studio input in the codebase, so it stays minimal.
 * A value of 0 is stored as `unset()` so an unranked post keeps a clean
 * document and falls through to `coalesce(priority, 0)` in the listing order.
 */
export function PrioritySlider(props: NumberInputProps) {
  const { value = 0, onChange, elementProps, readOnly } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = Number(event.currentTarget.value);
    onChange(next === MIN ? unset() : set(next));
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <input
        {...elementProps}
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={value}
        disabled={readOnly}
        onChange={handleChange}
        style={{ flex: 1 }}
      />
      <span
        style={{
          minWidth: "2ch",
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default PrioritySlider;
