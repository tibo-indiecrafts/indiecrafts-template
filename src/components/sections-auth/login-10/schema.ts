import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-10";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
