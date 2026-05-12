import type { LoginBlock } from "./schema";

export const login19Key = "login-19" as const;
export const login19Namespace = "blocks.login-19" as const;

export const login19Sample: Omit<LoginBlock, "id"> = {
  type: "login-19",
  titleKey: "blocks.login-19.title",
  descriptionKey: "blocks.login-19.description",
  googleHref: "#",
  githubHref: "#",
  signinHref: "/login",
  homeHref: "/",
};
