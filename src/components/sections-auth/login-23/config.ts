import type { LoginBlock } from "./schema";

export const login23Key = "login-23" as const;
export const login23Namespace = "blocks.login-23" as const;

export const login23Sample: Omit<LoginBlock, "id"> = {
  type: "login-23",
  titleKey: "blocks.login-23.title",
  googleHref: "#",
  githubHref: "#",
  signinHref: "/",
  homeHref: "/",
};
