import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-04";
  id: string;
  titleKey?: MessageKey;
  brandKey?: MessageKey;
  signupHref?: StaticAppPathname | string;
  githubHref?: string;
  googleHref?: string;
  resetHref?: StaticAppPathname | string;
};
