import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ForgotPasswordPage } from "./index";

const meta: Meta<typeof ForgotPasswordPage> = {
  title: "Sections/Auth/ForgotPassword",
  component: ForgotPasswordPage,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPasswordPage>;

export const Default: Story = {
  render: () => <ForgotPasswordPage />,
};

export const CustomLinks: Story = {
  render: () => <ForgotPasswordPage brandHref="/home" loginHref="/auth/login" />,
};
