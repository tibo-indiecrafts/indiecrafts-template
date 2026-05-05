import type { LoginBlock } from "./schema";

export const login07Key = "login-07" as const;
export const login07Namespace = "blocks.login-07" as const;

export const login07Sample: Omit<LoginBlock, "id"> = {
  type: "login-07",
  titleKey: "blocks.login-07.title",
  descriptionKey: "blocks.login-07.description",
  googleHref: "#",
  forgotHref: "/forgot-password",
  signupHref: "/signup",
};
