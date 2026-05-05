"use client";

import { useTranslations } from "next-intl";
import WorldMapPrimitive from "@/components/ui-effects/world-map";
import { worldMapDefaultDots, worldMapNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof WorldMapPrimitive>;

export type WorldMapProps = PrimitiveProps & {
  /** See `PixelatedCanvas.informational`. Defaults to decorative. */
  informational?: boolean;
};

/**
 * Wraps the upstream `WorldMap` to ship a default `dots` arc set (so it
 * renders something useful without configuration) and to flip the default
 * a11y stance to decorative — the rasterized world map underneath is
 * visual flair, not informational, on most landings.
 *
 * Pass `informational` for the rare case where the routes carry real
 * meaning; the wrapper then exposes a translated label.
 */
export function WorldMap({ dots, informational, ...props }: WorldMapProps = {}) {
  const t = useTranslations(worldMapNamespace);
  const resolvedDots = dots ?? [...worldMapDefaultDots];
  if (informational) {
    return (
      <span role="img" aria-label={t("alt")} className="contents">
        <WorldMapPrimitive dots={resolvedDots} {...props} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="contents">
      <WorldMapPrimitive dots={resolvedDots} {...props} />
    </span>
  );
}
