"use client";

export interface GooeySvgFilterProps {
  /**
   * SVG filter id consumers reference via `filter: url(#<id>)`.
   * @default "gooey-filter"
   */
  id?: string;
  /**
   * Blur strength feeding the threshold matrix. Higher = blobbier merges.
   * @default 10
   */
  strength?: number;
}

export function GooeySvgFilter({
  id = "gooey-filter",
  strength = 10,
}: Readonly<GooeySvgFilterProps>) {
  // Render with width/height 0 + position absolute rather than `display:none`
  // — some browsers skip filter-def parsing on fully-hidden SVGs, which silently
  // breaks any `filter: url(#…)` reference on consumers.
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
      }}
    >
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur-sm" />
          <feColorMatrix
            in="blur-sm"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
