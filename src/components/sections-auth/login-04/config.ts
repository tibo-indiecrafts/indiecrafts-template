import type { LoginBlock } from "./schema";

export const login04Key = "login-04" as const;
export const login04Namespace = "blocks.login-04" as const;

export const login04Sample: Omit<LoginBlock, "id"> = {
  type: "login-04",
  titleKey: "blocks.login-04.title",
  brandKey: "blocks.login-04.brand",
  signupHref: "/signup",
  githubHref: "#",
  googleHref: "#",
  resetHref: "/forgot-password",
};
