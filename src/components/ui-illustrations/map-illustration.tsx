"use client";
import DottedMap from "dotted-map";
import Image from "next/image";

type Pin = {
  src: string;
  alt: string;
  /** Position classes applied to the marker root. */
  className: string;
  /** Set to true on Theo's marker for the subtle ring border. */
  ringed?: boolean;
};

const PINS: readonly Pin[] = [
  {
    src: "https://avatars.githubusercontent.com/u/99137927?v=4",
    alt: "Glodie",
    className: "left-1/3 top-1/2 size-8 -translate-x-full",
  },
  {
    src: "https://avatars.githubusercontent.com/u/68236786?v=4",
    alt: "Theo",
    className: "right-1/2 top-1/2 -translate-y-full translate-x-full",
    ringed: true,
  },
  {
    src: "https://avatars.githubusercontent.com/u/31113941?v=4",
    alt: "Bernard",
    className: "top-1/6 right-1/4 size-8 -translate-y-full translate-x-full",
  },
];

/**
 * Dotted-map illustration — three tear-drop map-marker avatars
 * (rotate-45 with half-rounded corners) positioned over a
 * `dotted-map` (height 55, vertical grid) world projection that
 * fades via `mask-radial-from-40%`. Self-positioning: the outer
 * wrapper is `relative` so the pins anchor to the map area, not to
 * the consumer's container. Pure decoration; mock pin avatars stay
 * hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/expandable-features-2` (the polished tear-drop
 * version; supersedes the plain-circle variant from features-13).
 */
export const MapIllustration = () => (
  <div aria-hidden className="relative min-w-lg [--color-background:transparent]">
    <div className="absolute inset-6">
      {PINS.map((pin) => (
        <div
          key={pin.alt}
          className={`absolute z-10 size-8 rotate-45 rounded-t-full rounded-l-full bg-white p-0.5 shadow-md shadow-black/15 ${pin.ringed ? "ring-border-illustration ring-1" : ""} ${pin.className}`}
        >
          <div className="before:border-foreground/20 relative size-7 -rotate-45 overflow-hidden rounded-full shadow-md before:absolute before:inset-0 before:rounded-full before:border">
            <Image
              className="aspect-square rounded-full object-cover"
              src={pin.src}
              alt={pin.alt}
              width={100}
              height={100}
              loading="lazy"
            />
          </div>
        </div>
      ))}
    </div>
    <div className="mask-radial-from-40%">
      <DottedMapSvg />
    </div>
  </div>
);

const map = new DottedMap({ height: 55, grid: "vertical" });
const points = map.getPoints();

function DottedMapSvg() {
  return (
    <svg
      viewBox="0 0 120 60"
      style={{ background: "var(--color-background)" }}
      className="opacity-75"
    >
      {points.map((point, i) => (
        <circle key={i} cx={point.x} cy={point.y} r={0.15} fill="currentColor" />
      ))}
    </svg>
  );
}
