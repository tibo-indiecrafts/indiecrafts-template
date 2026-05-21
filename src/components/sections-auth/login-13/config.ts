import type { LoginBlock } from "./schema";

export const login13Key = "login-13" as const;
export const login13Namespace = "blocks.login-13" as const;

export const login13Sample: Omit<LoginBlock, "id"> = {
  type: "login-13",
  titleKey: "blocks.login-13.title",
  descriptionKey: "blocks.login-13.description",
  googleHref: "#",
  signupHref: "/",
  homeHref: "/",
};
