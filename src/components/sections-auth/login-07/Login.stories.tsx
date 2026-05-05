import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login07Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login07",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login07Sample, id: "login-07-default" },
};
