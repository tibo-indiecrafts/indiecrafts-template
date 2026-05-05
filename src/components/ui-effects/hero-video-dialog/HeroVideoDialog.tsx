"use client";

import { useTranslations } from "next-intl";
import { HeroVideoDialog as HeroVideoDialogPrimitive } from "@/components/ui-effects/hero-video-dialog";
import { heroVideoDialogNamespace } from "./config";

type PrimitiveProps = React.ComponentProps<typeof HeroVideoDialogPrimitive>;

export type HeroVideoDialogProps = Omit<PrimitiveProps, "thumbnailAlt">;

/**
 * Wraps `HeroVideoDialog` so `thumbnailAlt` (and, where wired in the future,
 * the player iframe `title` + the play button aria-label) flow through the
 * block's translation namespace. The primitive only surfaces `thumbnailAlt`
 * today; `playLabel` / `videoTitle` are in `en.json` ready for when the
 * upstream exposes them.
 */
export function HeroVideoDialog(props: HeroVideoDialogProps) {
  const t = useTranslations(heroVideoDialogNamespace);
  return <HeroVideoDialogPrimitive thumbnailAlt={t("thumbnailAlt")} {...props} />;
}
