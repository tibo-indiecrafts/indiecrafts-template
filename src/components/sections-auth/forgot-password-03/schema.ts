import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type ForgotPasswordBlock = {
  type: "forgot-password-03";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
