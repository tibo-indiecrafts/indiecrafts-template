import type { LoginBlock } from "./schema";

export const login16Key = "login-16" as const;
export const login16Namespace = "blocks.login-16" as const;

export const login16Sample: Omit<LoginBlock, "id"> = {
  type: "login-16",
  titleKey: "blocks.login-16.title",
  googleHref: "#",
  githubHref: "#",
  forgotHref: "/",
  signupHref: "/",
  homeHref: "/",
};
