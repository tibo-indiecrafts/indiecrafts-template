"use client";

import * as React from "react";

import { useScopedT } from "@/components/_lib/scoped-t";

import { BubbleMenu, type BubbleMenuItem } from "./BubbleMenu";
import { header11Namespace } from "./config";

const ITEM_STYLES: Pick<BubbleMenuItem, "rotation" | "hoverStyles">[] = [
  { rotation: -8, hoverStyles: { bgColor: "#3b82f6", textColor: "#ffffff" } },
  { rotation: 8, hoverStyles: { bgColor: "#10b981", textColor: "#ffffff" } },
  { rotation: 8, hoverStyles: { bgColor: "#f59e0b", textColor: "#ffffff" } },
  { rotation: 8, hoverStyles: { bgColor: "#ef4444", textColor: "#ffffff" } },
  { rotation: -8, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
];

export function Header() {
  const [t] = useScopedT(header11Namespace);
  const itemIds = ["home", "about", "projects", "blog", "contact"] as const;

  const items: BubbleMenuItem[] = itemIds.map((id, i) => ({
    label: t(`items.${id}`),
    ariaLabel: t(`items.${id}`),
    href: "#",
    ...ITEM_STYLES[i],
  }));

  return (
    <BubbleMenu
      items={items}
      logo={<span style={{ fontWeight: 700 }}>{t("actions.brand")}</span>}
      menuAriaLabel={t("actions.openMenu")}
      menuBg="#ffffff"
      menuContentColor="#111111"
      useFixedPosition={false}
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
    />
  );
}
