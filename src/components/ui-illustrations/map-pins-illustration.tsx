"use client";

import DottedMap from "dotted-map";
import Image from "next/image";

const PINS = [
  {
    src: "https://avatars.githubusercontent.com/u/99137927?v=4",
    alt: "Glodie",
    className: "left-1/3 top-1/2 size-8 -translate-x-full",
    extraRing: false,
  },
  {
    src: "https://avatars.githubusercontent.com/u/68236786?v=4",
    alt: "Theo",
    className:
      "right-1/2 top-1/2 -translate-y-full translate-x-full size-8 ring-border-illustration ring-1",
    extraRing: true,
  },
  {
    src: "https://avatars.githubusercontent.com/u/124599?v=4",
    alt: "Shadcn",
    className: "top-1/6 right-1/4 size-8 -translate-y-full translate-x-full",
    extraRing: false,
  },
] as const;

const map = new DottedMap({ height: 55, grid: "vertical" });
const POINTS = map.getPoints();
const VIEW_BOX = "0 0 120 60";

/**
 * Wide dotted-map illustration with three rotated tear-drop avatar
 * pins (Glodie / Theo / Shadcn). Sourced from `@tailark-pro/bento-07`
 * (upstream `MapIllustration`; renamed to `map-pins-illustration` to
 * differentiate from our existing narrower `map-illustration`).
 * Pure decoration; mock pin avatars stay hardcoded per the
 * illustration rule.
 */
export const MapPinsIllustration = () => (
  <div aria-hidden className="relative min-w-2xl [--color-background:transparent]">
    <div className="absolute inset-6">
      {PINS.map((pin) => (
        <div
          key={pin.alt}
          className={`absolute z-10 rotate-45 rounded-t-full rounded-l-full bg-white p-0.5 shadow-md shadow-black/15 ${pin.className}`}
        >
          <div className="before:border-foreground/20 relative size-7 -rotate-45 overflow-hidden rounded-full shadow-md before:absolute before:inset-0 before:rounded-full before:border">
            <Image
              className="aspect-square rounded-full object-cover"
              src={pin.src}
              alt={pin.alt}
              height={100}
              width={100}
            />
          </div>
        </div>
      ))}
    </div>
    <div className="mask-radial-from-35% *:opacity-50">
      <svg
        viewBox={VIEW_BOX}
        style={{ background: "var(--color-background)" }}
        className="opacity-75"
      >
        {POINTS.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={0.15} fill="currentColor" />
        ))}
      </svg>
    </div>
  </div>
);
