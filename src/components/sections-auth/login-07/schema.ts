import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-07";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
};
