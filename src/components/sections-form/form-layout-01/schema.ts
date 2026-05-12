import type { MessageKey } from "@/types/messages";

export type FormLayoutBlock = {
  type: "form-layout-01";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
};
