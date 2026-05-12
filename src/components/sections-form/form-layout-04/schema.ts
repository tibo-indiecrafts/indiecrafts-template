import type { MessageKey } from "@/types/messages";

export type FormLayoutPlan = {
  id: string;
};

export type FormLayoutBlock = {
  type: "form-layout-04";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;

  plans?: FormLayoutPlan[];
};
