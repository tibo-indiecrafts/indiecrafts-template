import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-02";
  id: string;
  titleKey?: MessageKey;
  googleHref?: string;
  termsHref?: StaticAppPathname | string;
  privacyHref?: StaticAppPathname | string;
};
