import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-05";
  id: string;
  titleKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  termsHref?: StaticAppPathname | string;
  privacyHref?: StaticAppPathname | string;
};
