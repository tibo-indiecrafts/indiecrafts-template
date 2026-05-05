"use client";

import { useTranslations } from "next-intl";
import { LayoutTextFlip as LayoutTextFlipPrimitive } from "@/components/ui-effects/layout-text-flip";
import { layoutTextFlipDefaults, layoutTextFlipNamespace } from "./config";

export type LayoutTextFlipProps = {
  /** Override the rotation duration (ms). Defaults to `layoutTextFlipDefaults.duration`. */
  duration?: number;
};

/**
 * Wraps `LayoutTextFlip` so `text` and `words` come from the block's
 * translation namespace. Timing comes from config (or the `duration` prop).
 */
export function LayoutTextFlip({
  duration = layoutTextFlipDefaults.duration,
}: LayoutTextFlipProps = {}) {
  const t = useTranslations(layoutTextFlipNamespace);
  const words: string[] = t.raw("words");
  return <LayoutTextFlipPrimitive text={t("text")} words={words} duration={duration} />;
}
