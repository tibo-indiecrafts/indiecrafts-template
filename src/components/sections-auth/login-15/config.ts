import type { LoginBlock } from "./schema";

export const login15Key = "login-15" as const;
export const login15Namespace = "blocks.login-15" as const;

export const login15Sample: Omit<LoginBlock, "id"> = {
  type: "login-15",
  titleKey: "blocks.login-15.title",
  descriptionKey: "blocks.login-15.description",
  googleHref: "#",
  microsoftHref: "#",
  forgotHref: "/forgot-password",
  signupHref: "/signup",
  homeHref: "/",
};
