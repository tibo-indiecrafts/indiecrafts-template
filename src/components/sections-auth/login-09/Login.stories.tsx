import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login09Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login09",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login09Sample, id: "login-09-default" },
};
