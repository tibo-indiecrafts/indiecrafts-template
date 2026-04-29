import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginPage } from "./index";

const meta: Meta<typeof LoginPage> = {
  title: "Sections/Auth/Login",
  component: LoginPage,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {
  render: () => <LoginPage />,
};

/**
 * Custom routing — `brandHref` and `signupHref` overridden to point at a
 * marketing site and a separate sign-up sub-app.
 */
export const CustomLinks: Story = {
  render: () => <LoginPage brandHref="/home" signupHref="/auth/signup" />,
};
