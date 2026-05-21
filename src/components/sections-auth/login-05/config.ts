import type { LoginBlock } from "./schema";

export const login05Key = "login-05" as const;
export const login05Namespace = "blocks.login-05" as const;

export const login05Sample: Omit<LoginBlock, "id"> = {
  type: "login-05",
  titleKey: "blocks.login-05.title",
  signinHref: "/",
  termsHref: "#",
  privacyHref: "#",
};
