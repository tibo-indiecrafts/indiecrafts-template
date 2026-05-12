import type { LoginBlock } from "./schema";

export const login12Key = "login-12" as const;
export const login12Namespace = "blocks.login-12" as const;

export const login12Sample: Omit<LoginBlock, "id"> = {
  type: "login-12",
  titleKey: "blocks.login-12.title",
  descriptionKey: "blocks.login-12.description",
  googleHref: "#",
  githubHref: "#",
  forgotHref: "/forgot-password",
  signupHref: "/signup",
  homeHref: "/",
};
