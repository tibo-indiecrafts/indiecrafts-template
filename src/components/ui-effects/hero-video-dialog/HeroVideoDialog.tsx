"use client";

import { useTranslations } from "next-intl";
import { HeroVideoDialog as HeroVideoDialogPrimitive } from "@/components/ui-effects/hero-video-dialog";
import { heroVideoDialogNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof HeroVideoDialogPrimitive>;

export type HeroVideoDialogProps = Omit<PrimitiveProps, "thumbnailAlt">;

export function HeroVideoDialog(props: HeroVideoDialogProps) {
  const t = useTranslations(heroVideoDialogNamespace);
  return <HeroVideoDialogPrimitive thumbnailAlt={t("thumbnailAlt")} {...props} />;
}
