import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login21Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login21",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login21Sample, id: "login-21-default" },
};
