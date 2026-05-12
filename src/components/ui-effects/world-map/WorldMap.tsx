"use client";

import { useTranslations } from "next-intl";
import WorldMapPrimitive from "@/components/ui-effects/world-map";
import { worldMapDefaultDots, worldMapNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof WorldMapPrimitive>;

export type WorldMapProps = PrimitiveProps & {
  informational?: boolean;
};

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
