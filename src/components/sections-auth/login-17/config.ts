import type { LoginBlock } from "./schema";

export const login17Key = "login-17" as const;
export const login17Namespace = "blocks.login-17" as const;

export const login17Sample: Omit<LoginBlock, "id"> = {
  type: "login-17",
  titleKey: "blocks.login-17.title",
  descriptionKey: "blocks.login-17.description",
  googleHref: "#",
  microsoftHref: "#",
  signinHref: "/",
  homeHref: "/",
};
