import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login20Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login20",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login20Sample, id: "login-20-default" },
};
