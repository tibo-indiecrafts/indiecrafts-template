import type { LoginBlock } from "./schema";

export const login20Key = "login-20" as const;
export const login20Namespace = "blocks.login-20" as const;

export const login20Sample: Omit<LoginBlock, "id"> = {
  type: "login-20",
  titleKey: "blocks.login-20.title",
  descriptionKey: "blocks.login-20.description",
  googleHref: "#",
  signinHref: "/",
  homeHref: "/",
};
