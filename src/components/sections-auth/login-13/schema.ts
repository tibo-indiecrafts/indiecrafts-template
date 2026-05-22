import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-13";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
