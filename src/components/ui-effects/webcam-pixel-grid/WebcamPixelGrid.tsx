"use client";

import { useTranslations } from "next-intl";
import { WebcamPixelGrid as WebcamPixelGridPrimitive } from "@/components/ui-effects/webcam-pixel-grid";
import { webcamPixelGridNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof WebcamPixelGridPrimitive>;

export type WebcamPixelGridProps = Omit<PrimitiveProps, "cameraAccessLabel"> & {
  cameraAccessLabel?: string;
};

export function WebcamPixelGrid({ cameraAccessLabel, ...props }: WebcamPixelGridProps) {
  const t = useTranslations(webcamPixelGridNamespace);
  return (
    <WebcamPixelGridPrimitive
      cameraAccessLabel={cameraAccessLabel ?? t("cameraAccessLabel")}
      {...props}
    />
  );
}
