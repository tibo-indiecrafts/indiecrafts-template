import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-08";
  id: string;
  titleKey?: MessageKey;
  brandKey?: MessageKey;
  descriptionKey?: MessageKey;
  resetHref?: StaticAppPathname | string;
  ssoHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
};
