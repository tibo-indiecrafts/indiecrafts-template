import type { LoginBlock } from "./schema";

export const login09Key = "login-09" as const;
export const login09Namespace = "blocks.login-09" as const;

export const login09Sample: Omit<LoginBlock, "id"> = {
  type: "login-09",
  titleKey: "blocks.login-09.title",
  descriptionKey: "blocks.login-09.description",
  signinHref: "/",
  termsHref: "#",
  conditionsHref: "#",
};
