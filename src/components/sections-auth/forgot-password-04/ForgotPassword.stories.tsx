import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword04Sample } from "./config";

const meta: Meta<typeof ForgotPassword> = {
  title: "Sections/Auth/ForgotPassword04",
  component: ForgotPassword,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPassword>;

export const Default: Story = {
  args: { ...forgotPassword04Sample, id: "forgot-password-04-default" },
};
