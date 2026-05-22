import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-09";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  termsHref?: StaticAppPathname | string;
  conditionsHref?: StaticAppPathname | string;
};
