import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login13Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login13",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login13Sample, id: "login-13-default" },
};
