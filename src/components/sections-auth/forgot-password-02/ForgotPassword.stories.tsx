import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ForgotPassword from "./ForgotPassword";
import { forgotPassword02Sample } from "./config";

const meta: Meta<typeof ForgotPassword> = {
  title: "Sections/Auth/ForgotPassword02",
  component: ForgotPassword,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPassword>;

export const Default: Story = {
  args: { ...forgotPassword02Sample, id: "forgot-password-02-default" },
};
