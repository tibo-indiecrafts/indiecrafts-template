import type { ForgotPasswordBlock } from "./schema";

export const forgotPassword02Key = "forgot-password-02" as const;
export const forgotPassword02Namespace = "blocks.forgot-password-02" as const;

export const forgotPassword02Sample: Omit<ForgotPasswordBlock, "id"> = {
  type: "forgot-password-02",
  titleKey: "blocks.forgot-password-02.title",
  descriptionKey: "blocks.forgot-password-02.description",
  signinHref: "/login",
  homeHref: "/",
};
