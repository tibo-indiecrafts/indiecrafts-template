import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-16";
  id: string;
  titleKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  forgotHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
