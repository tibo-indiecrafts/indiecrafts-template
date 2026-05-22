import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-06";
  id: string;
  titleKey?: MessageKey;
  signupHref?: StaticAppPathname | string;
  passwordSigninHref?: StaticAppPathname | string;
  ssoHref?: StaticAppPathname | string;
  termsHref?: StaticAppPathname | string;
  privacyHref?: StaticAppPathname | string;
};
