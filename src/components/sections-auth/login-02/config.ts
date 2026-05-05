import type { LoginBlock } from "./schema";

export const login02Key = "login-02" as const;
export const login02Namespace = "blocks.login-02" as const;

export const login02Sample: Omit<LoginBlock, "id"> = {
  type: "login-02",
  titleKey: "blocks.login-02.title",
  googleHref: "#",
  termsHref: "#",
  privacyHref: "#",
};
