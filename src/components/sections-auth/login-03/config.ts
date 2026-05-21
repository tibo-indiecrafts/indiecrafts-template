import type { LoginBlock } from "./schema";

export const login03Key = "login-03" as const;
export const login03Namespace = "blocks.login-03" as const;

export const login03Sample: Omit<LoginBlock, "id"> = {
  type: "login-03",
  titleKey: "blocks.login-03.title",
  descriptionKey: "blocks.login-03.description",
  resetHref: "/",
};
