import type { StaticAppPathname } from "@/config";

export type LoginBlock = {
  type: "login-11";
  id: string;
  googleHref?: StaticAppPathname | string;
  facebookHref?: StaticAppPathname | string;
  microsoftHref?: StaticAppPathname | string;
  signupHref?: StaticAppPathname | string;
  homeHref?: StaticAppPathname | string;
};
