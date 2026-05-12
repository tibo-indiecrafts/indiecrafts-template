import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login12Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login12",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login12Sample, id: "login-12-default" },
};
