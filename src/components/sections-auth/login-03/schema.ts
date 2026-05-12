import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  resetHref?: StaticAppPathname | string;
};
