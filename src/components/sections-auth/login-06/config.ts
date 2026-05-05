import type { LoginBlock } from "./schema";

export const login06Key = "login-06" as const;
export const login06Namespace = "blocks.login-06" as const;

export const login06Sample: Omit<LoginBlock, "id"> = {
  type: "login-06",
  titleKey: "blocks.login-06.title",
  signupHref: "/signup",
  passwordSigninHref: "/login",
  ssoHref: "#",
  termsHref: "#",
  privacyHref: "#",
};
