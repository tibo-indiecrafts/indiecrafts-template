"use client";

import { useTranslations } from "next-intl";
import { PixelatedCanvas as PixelatedCanvasPrimitive } from "@/components/ui-effects/pixelated-canvas";
import { pixelatedCanvasNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof PixelatedCanvasPrimitive>;

export type PixelatedCanvasProps = PrimitiveProps & {
  /**
   * Treat as informational instead of decorative. The primitive's inner
   * `<canvas>` carries a hardcoded English `aria-label`; setting this to
   * `true` exposes the canvas (with that English label) to assistive tech.
   * Defaults to `false` — the wrapper marks the effect `aria-hidden` so
   * screen readers skip it (the right call for purely visual flair).
   */
  informational?: boolean;
};

/**
 * Wraps the upstream `PixelatedCanvas` to flip the default a11y stance:
 * decorative-by-default. The primitive ships an English-only aria-label
 * baked into the canvas tag we can't reach; wrapping with
 * `aria-hidden="true"` hides the entire subtree from screen readers,
 * which matches how this effect is actually used (visual flair).
 *
 * For the rare case where the canvas is informational, pass
 * `informational` and provide a labeled wrapper at the call site.
 */
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
