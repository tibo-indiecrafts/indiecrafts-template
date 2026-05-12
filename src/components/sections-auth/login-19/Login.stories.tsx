import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login19Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login19",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login19Sample, id: "login-19-default" },
};
