import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login01Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login01",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login01Sample, id: "login-01-default" },
};

/**
 * Custom routing — terms / privacy links overridden so the same block
 * renders inside a host app pointing at its real legal routes.
 */
export const CustomLegalLinks: Story = {
  args: {
    ...login01Sample,
    id: "login-01-custom",
    termsHref: "/legal/terms",
    privacyHref: "/legal/privacy",
    googleHref: "/api/auth/google",
  },
};
