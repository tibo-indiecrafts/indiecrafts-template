"use client";

import { useTranslations } from "next-intl";
import { WebcamPixelGrid as WebcamPixelGridPrimitive } from "@/components/ui-effects/webcam-pixel-grid";
import { webcamPixelGridNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof WebcamPixelGridPrimitive>;

export type WebcamPixelGridProps = Omit<PrimitiveProps, "cameraAccessLabel"> & {
  /** Override the localized "permission denied" tooltip. */
  cameraAccessLabel?: string;
};

/**
 * Wraps the upstream `WebcamPixelGrid` so the "camera access required"
 * tooltip pulls from `blocks.webcam-pixel-grid.cameraAccessLabel` instead
 * of the primitive's English default. Pass `cameraAccessLabel` explicitly
 * to override per call site.
 */
export function WebcamPixelGrid({
  cameraAccessLabel,
  ...props
}: WebcamPixelGridProps) {
  const t = useTranslations(webcamPixelGridNamespace);
  return (
    <WebcamPixelGridPrimitive
      cameraAccessLabel={cameraAccessLabel ?? t("cameraAccessLabel")}
      {...props}
    />
  );
}
