import type { LoginBlock } from "./schema";

export const login18Key = "login-18" as const;
export const login18Namespace = "blocks.login-18" as const;

export const login18Sample: Omit<LoginBlock, "id"> = {
  type: "login-18",
  googleHref: "#",
  facebookHref: "#",
  microsoftHref: "#",
  signinHref: "/",
  homeHref: "/",
};
