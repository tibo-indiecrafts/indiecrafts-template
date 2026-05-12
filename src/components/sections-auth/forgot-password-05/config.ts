import type { ForgotPasswordBlock } from "./schema";

export const forgotPassword05Key = "forgot-password-05" as const;
export const forgotPassword05Namespace = "blocks.forgot-password-05" as const;

export const forgotPassword05Sample: Omit<ForgotPasswordBlock, "id"> = {
  type: "forgot-password-05",
  titleKey: "blocks.forgot-password-05.title",
  descriptionKey: "blocks.forgot-password-05.description",
  signinHref: "/login",
  homeHref: "/",
};
