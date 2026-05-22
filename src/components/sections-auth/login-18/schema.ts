import type { StaticAppPathname } from "@/config";

export type LoginBlock = {
  type: "login-18";
  id: string;
  googleHref?: StaticAppPathname | string;
  facebookHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  signinHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
