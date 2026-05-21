import type { ForgotPasswordBlock } from "./schema";

export const forgotPassword03Key = "forgot-password-03" as const;
export const forgotPassword03Namespace = "blocks.forgot-password-03" as const;

export const forgotPassword03Sample: Omit<ForgotPasswordBlock, "id"> = {
  type: "forgot-password-03",
  titleKey: "blocks.forgot-password-03.title",
  descriptionKey: "blocks.forgot-password-03.description",
  signinHref: "/",
  homeHref: "/",
};
