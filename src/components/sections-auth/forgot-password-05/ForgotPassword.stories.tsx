import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword05Sample } from "./config";

const meta: Meta<typeof ForgotPassword> = {
  title: "Sections/Auth/ForgotPassword05",
  component: ForgotPassword,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPassword>;

export const Default: Story = {
  args: { ...forgotPassword05Sample, id: "forgot-password-05-default" },
};
