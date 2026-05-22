import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-23";
  id: string;
  titleKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
