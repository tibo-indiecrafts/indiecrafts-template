import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login15Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login15",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login15Sample, id: "login-15-default" },
};
