import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-20";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
