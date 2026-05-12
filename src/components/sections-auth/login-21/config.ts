import type { LoginBlock } from "./schema";

export const login21Key = "login-21" as const;
export const login21Namespace = "blocks.login-21" as const;

export const login21Sample: Omit<LoginBlock, "id"> = {
  type: "login-21",
  titleKey: "blocks.login-21.title",
  descriptionKey: "blocks.login-21.description",
  googleHref: "#",
  githubHref: "#",
  signinHref: "/login",
  homeHref: "/",
};
