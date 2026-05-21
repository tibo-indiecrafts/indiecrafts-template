import type { LoginBlock } from "./schema";

export const login10Key = "login-10" as const;
export const login10Namespace = "blocks.login-10" as const;

export const login10Sample: Omit<LoginBlock, "id"> = {
  type: "login-10",
  titleKey: "blocks.login-10.title",
  descriptionKey: "blocks.login-10.description",
  googleHref: "#",
  microsoftHref: "#",
  forgotHref: "/",
  signupHref: "/",
  homeHref: "/",
};
