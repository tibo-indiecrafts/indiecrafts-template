"use client";

import DottedMap from "dotted-map";
import Image from "next/image";

const PINS = [
  {
    src: "https://avatars.githubusercontent.com/u/99137927?v=4",
    alt: "Glodie",
    className: "left-1/3 top-1/3 -translate-x-full",
  },
  {
    src: "https://avatars.githubusercontent.com/u/68236786?v=4",
    alt: "Theo",
    className: "right-1/2 top-1/2 -translate-y-full translate-x-full",
  },
  {
    src: "https://avatars.githubusercontent.com/u/31113941?v=4",
    alt: "Bernard",
    className: "right-1/4 top-1/3 -translate-y-full translate-x-full",
  },
] as const;

const map = new DottedMap({ height: 55, grid: "vertical" });
const POINTS = map.getPoints();
const VIEW_BOX = "0 0 120 60";

/**
 * Dotted-map illustration with three CIRCULAR avatar pins (no
 * tear-drop rotation). Used by `sections-bento/bento-14/`'s "Global
 * Analytics" cell. Sourced from `@tailark-pro/bento-14` (upstream
 * `MapIllustration`; renamed to `map-circles-illustration` to
 * differentiate from our existing tear-drop `map-illustration` and
 * the wider `map-pins-illustration`).
 */
export const MapCirclesIllustration = () => (
  <div
    aria-hidden
    className="relative mask-radial-from-25% [--color-background:transparent]"
  >
    <div className="absolute inset-6 -mb-12">
      {PINS.map((pin) => (
        <div
          key={pin.alt}
          className={`absolute z-10 size-8 rounded-full bg-white p-0.5 shadow-md shadow-black/15 ${pin.className}`}
        >
          <Image
            className="aspect-square rounded-full object-cover"
            src={pin.src}
            alt={pin.alt}
            height={52}
            width={52}
          />
        </div>
      ))}
    </div>
    <div className="isolate -mb-12 opacity-75">
      <svg viewBox={VIEW_BOX} style={{ background: "var(--color-background)" }}>
        {POINTS.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={0.15} fill="currentColor" />
        ))}
      </svg>
    </div>
  </div>
);
