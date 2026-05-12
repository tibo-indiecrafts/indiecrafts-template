import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword03Sample } from "./config";

const meta: Meta<typeof ForgotPassword> = {
  title: "Sections/Auth/ForgotPassword03",
  component: ForgotPassword,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPassword>;

export const Default: Story = {
  args: { ...forgotPassword03Sample, id: "forgot-password-03-default" },
};
