import type { LoginBlock } from "./schema";

export const login11Key = "login-11" as const;
export const login11Namespace = "blocks.login-11" as const;

export const login11Sample: Omit<LoginBlock, "id"> = {
  type: "login-11",
  googleHref: "#",
  facebookHref: "#",
  microsoftHref: "#",
  signupHref: "/signup",
  homeHref: "/",
};
