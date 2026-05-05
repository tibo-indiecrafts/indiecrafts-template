import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login05Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login05",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login05Sample, id: "login-05-default" },
};
