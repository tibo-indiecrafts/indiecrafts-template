import type { LoginBlock } from "./schema";

export const login14Key = "login-14" as const;
export const login14Namespace = "blocks.login-14" as const;

export const login14Sample: Omit<LoginBlock, "id"> = {
  type: "login-14",
  titleKey: "blocks.login-14.title",
  descriptionKey: "blocks.login-14.description",
  googleHref: "#",
  githubHref: "#",
  signupHref: "/",
  homeHref: "/",
};
