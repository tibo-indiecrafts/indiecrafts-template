import type { StaticAppPathname } from "@/config";
import type { MessageKey } from "@/types/messages";

export type LoginBlock = {
  type: "login-14";
  id: string;
  titleKey?: MessageKey;
  descriptionKey?: MessageKey;
  googleHref?: StaticAppPathname | string;
  githubHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
