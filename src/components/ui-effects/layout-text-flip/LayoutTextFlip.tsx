"use client";

import { useTranslations } from "next-intl";
import { LayoutTextFlip as LayoutTextFlipPrimitive } from "@/components/ui-effects/layout-text-flip";
import { layoutTextFlipDefaults, layoutTextFlipNamespace } from "./config";

export type LayoutTextFlipProps = {
  duration?: number;
};

export function LayoutTextFlip({
  duration = layoutTextFlipDefaults.duration,
}: LayoutTextFlipProps = {}) {
  const t = useTranslations(layoutTextFlipNamespace);
  const words: string[] = t.raw("words");
  return <LayoutTextFlipPrimitive text={t("text")} words={words} duration={duration} />;
}
