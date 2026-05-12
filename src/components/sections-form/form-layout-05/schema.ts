import type { MessageKey } from "@/types/messages";

export type FormLayoutPlan = {
  id: string;

  href: string;
  isRecommended?: boolean;
};

export type FormLayoutBlock = {
  type: "form-layout-05";
  id: string;
  titleKey?: MessageKey;

  sideTitleKey?: MessageKey;
  sideBodyKey?: MessageKey;
  sideHref?: string;
  plans?: FormLayoutPlan[];
};
