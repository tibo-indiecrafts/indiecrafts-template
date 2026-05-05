"use client";

import { useTranslations } from "next-intl";
import { DitherShader as DitherShaderPrimitive } from "@/components/ui-effects/dither-shader";
import { ditherShaderNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof DitherShaderPrimitive>;

export type DitherShaderProps = PrimitiveProps & {
  /** See `PixelatedCanvas.informational` — same opt-in semantics. */
  informational?: boolean;
};

/** See `PixelatedCanvas` for the decorative-by-default rationale. */
export function DitherShader({ informational, ...props }: DitherShaderProps) {
  const t = useTranslations(ditherShaderNamespace);
  if (informational) {
    return (
      <span role="img" aria-label={t("label")} className="contents">
        <DitherShaderPrimitive {...props} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="contents">
      <DitherShaderPrimitive {...props} />
    </span>
  );
}
