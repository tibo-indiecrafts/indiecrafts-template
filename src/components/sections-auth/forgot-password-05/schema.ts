import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type ForgotPasswordBlock = {
  type: "forgot-password-05";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
