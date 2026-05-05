import type { LoginBlock } from "./schema";

export const login01Key = "login-01" as const;
export const login01Namespace = "blocks.login-01" as const;

export const login01Sample: Omit<LoginBlock, "id"> = {
  type: "login-01",
  titleKey: "blocks.login-01.title",
  googleHref: "#",
  termsHref: "#",
  privacyHref: "#",
};
