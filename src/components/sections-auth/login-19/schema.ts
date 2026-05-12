import type { StaticAppPathname } from "@/config/routes.types";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-19";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
