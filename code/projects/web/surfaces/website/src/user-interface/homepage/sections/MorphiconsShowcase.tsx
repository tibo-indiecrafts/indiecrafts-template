"use client";

/**
 * Renders the homepage Morphicons showcase.
 *
 * @see docs/reference/projects/web/website/src/user-interface/homepage/sections/MorphiconsShowcase.md
 */

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MorphIcon, type IconInput } from "morphicons/react";
import {
  Bell,
  BellOff,
  Copy,
  Check,
  Menu,
  Moon,
  Pause,
  Play,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide";

/**
 * Homepage demo for [Morphicons](https://www.morphicons.com) — SVG icons that
 * mathematically morph from one shape to another. Each tile toggles between two
 * related icons on click/tap; changing `MorphIcon`'s `icon` prop is the whole
 * trigger. SSR-safe (the server emits the static SVG) and `prefers-reduced-motion`
 * degrades to an instant swap, so it's on-brand quiet by default.
 *
 * Client component — the morph is state-driven. Icons come from `lucide` as raw
 * **data** (not `lucide-react` components). Copy from `namespace`.
 */
const PAIRS: { key: string; a: IconInput; b: IconInput }[] = [
  { key: "menu", a: Menu, b: X },
  { key: "play", a: Play, b: Pause },
  { key: "theme", a: Sun, b: Moon },
  { key: "volume", a: Volume2, b: VolumeX },
  { key: "bell", a: Bell, b: BellOff },
  { key: "copy", a: Copy, b: Check },
];

export function MorphiconsShowcase({ id, namespace }: { id: string; namespace: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic namespace, matches the other sections
  const t = useTranslations(namespace as any);

  return (
    <section aria-labelledby={`${id}-title`} className="border-t py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-(--gutter) text-center">
        <p className="text-brand text-xs font-medium tracking-widest uppercase">
          {t("eyebrow")}
        </p>
        <h2
          id={`${id}-title`}
          className="mt-4 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="text-muted-foreground mt-3 text-balance">{t("body")}</p>

        <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {PAIRS.map((pair) => (
            <li key={pair.key}>
              <MorphTile a={pair.a} b={pair.b} label={t(`icons.${pair.key}`)} />
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mt-6 text-xs">{t("hint")}</p>
      </div>
    </section>
  );
}

function MorphTile({ a, b, label }: { a: IconInput; b: IconInput; label: string }) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((o) => !o)}
      aria-pressed={on}
      aria-label={label}
      className="ring-border/60 hover:bg-brand/5 hover:ring-brand/40 focus-visible:ring-ring text-foreground flex aspect-square w-full items-center justify-center rounded-xl ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <MorphIcon icon={on ? b : a} size={28} strokeWidth={2} spring="smooth" />
    </button>
  );
}
