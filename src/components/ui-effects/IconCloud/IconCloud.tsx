"use client";

import { useTranslations } from "next-intl";
import { IconCloud as IconCloudPrimitive } from "@/components/ui-effects/icon-cloud";
import { iconCloudNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof IconCloudPrimitive>;

export type IconCloudProps = PrimitiveProps & {
  /** See `PixelatedCanvas.informational` — same opt-in semantics. */
  informational?: boolean;
};

/** See `PixelatedCanvas` for the decorative-by-default rationale. */
export function IconCloud({ informational, ...props }: IconCloudProps) {
  const t = useTranslations(iconCloudNamespace);
  if (informational) {
    return (
      <span role="img" aria-label={t("label")} className="contents">
        <IconCloudPrimitive {...props} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="contents">
      <IconCloudPrimitive {...props} />
    </span>
  );
}
