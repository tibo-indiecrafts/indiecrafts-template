import type { LoginBlock } from "./schema";

export const login22Key = "login-22" as const;
export const login22Namespace = "blocks.login-22" as const;

export const login22Sample: Omit<LoginBlock, "id"> = {
  type: "login-22",
  titleKey: "blocks.login-22.title",
  descriptionKey: "blocks.login-22.description",
  googleHref: "#",
  microsoftHref: "#",
  forgotHref: "/forgot-password",
  signinHref: "/login",
  homeHref: "/",
};
