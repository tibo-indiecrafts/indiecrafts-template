import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login22Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login22",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login22Sample, id: "login-22-default" },
};
