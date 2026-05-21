import type { LoginBlock } from "./schema";

export const login08Key = "login-08" as const;
export const login08Namespace = "blocks.login-08" as const;

export const login08Sample: Omit<LoginBlock, "id"> = {
  type: "login-08",
  titleKey: "blocks.login-08.title",
  brandKey: "blocks.login-08.brand",
  descriptionKey: "blocks.login-08.description",
  resetHref: "/",
  ssoHref: "#",
  signupHref: "/",
};
