"use client";

import { useTranslations } from "next-intl";
import { PixelatedCanvas as PixelatedCanvasPrimitive } from "@/components/ui-effects/pixelated-canvas";
import { pixelatedCanvasNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof PixelatedCanvasPrimitive>;

export type PixelatedCanvasProps = PrimitiveProps & {
  informational?: boolean;
};

export function PixelatedCanvas({ informational, ...props }: PixelatedCanvasProps) {
  const t = useTranslations(pixelatedCanvasNamespace);
  if (informational) {
    return (
      <span role="img" aria-label={t("label")} className="contents">
        <PixelatedCanvasPrimitive {...props} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="contents">
      <PixelatedCanvasPrimitive {...props} />
    </span>
  );
}
