"use client";

export interface PixelateSvgFilterProps {
  /**
   * SVG filter id consumers reference via `filter: url(#<id>)`.
   * @default "pixelate-filter"
   */
  id?: string;
  /**
   * Pixel block size in px. Larger = chunkier pixels.
   * @default 16
   */
  size?: number;
  /**
   * Adds two fallback layers (X-tiled and Y-tiled) so the pixel grid stays
   * solid in browsers that drop the primary tile pass. Heavier filter.
   * @default false
   */
  crossLayers?: boolean;
}

export function PixelateSvgFilter({
  id = "pixelate-filter",
  size = 16,
  crossLayers = false,
}: Readonly<PixelateSvgFilterProps>) {
  // Same hiding pattern as GooeySvgFilter — `display: none` SVGs sometimes
  // skip filter-def parsing; width/height 0 keeps the def reachable.
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
        <filter id={id} x="0" y="0" width="1" height="1">
          {/* First layer: standard pixelation */}
          <feConvolveMatrix kernelMatrix="1 1 1  1 1 1  1 1 1" result="AVG" />
          <feFlood x="1" y="1" width="1" height="1" />
          <feComposite
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            width={size}
            height={size}
          />
          <feTile result="TILE" />
          <feComposite in="AVG" in2="TILE" operator="in" k1="0" k2="1" k3="0" k4="0" />
          <feMorphology operator="dilate" radius={size / 2} result="NORMAL" />

          {crossLayers && (
            <>
              {/* Fallback layer: full-width tile */}
              <feConvolveMatrix kernelMatrix="1 1 1  1 1 1  1 1 1" result="AVG" />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
                width={size / 2}
                height={size}
              />
              <feTile result="TILE" />
              <feComposite
                in="AVG"
                in2="TILE"
                operator="in"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
              />
              <feMorphology operator="dilate" radius={size / 2} result="FALLBACKX" />

              {/* Fallback layer: full-height tile */}
              <feConvolveMatrix kernelMatrix="1 1 1  1 1 1  1 1 1" result="AVG" />
              <feFlood x="1" y="1" width="1" height="1" />
              <feComposite
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
                width={size}
                height={size / 2}
              />
              <feTile result="TILE" />
              <feComposite
                in="AVG"
                in2="TILE"
                operator="in"
                k1="0"
                k2="1"
                k3="0"
                k4="0"
              />
              <feMorphology operator="dilate" radius={size / 2} result="FALLBACKY" />

              <feMerge>
                <feMergeNode in="FALLBACKX" />
                <feMergeNode in="FALLBACKY" />
                <feMergeNode in="NORMAL" />
              </feMerge>
            </>
          )}
          {/* When crossLayers is false, the implicit result of the last
              primitive (NORMAL) is the filter output — no explicit merge
              needed. The upstream's bare <feMergeNode> was invalid SVG. */}
        </filter>
      </defs>
    </svg>
  );
}
