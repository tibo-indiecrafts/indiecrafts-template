import type { ForgotPasswordBlock } from "./schema";

export const forgotPassword04Key = "forgot-password-04" as const;
export const forgotPassword04Namespace = "blocks.forgot-password-04" as const;

export const forgotPassword04Sample: Omit<ForgotPasswordBlock, "id"> = {
  type: "forgot-password-04",
  titleKey: "blocks.forgot-password-04.title",
  descriptionKey: "blocks.forgot-password-04.description",
  signinHref: "/login",
  homeHref: "/",
};
