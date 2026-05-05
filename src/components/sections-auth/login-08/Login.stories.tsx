import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login08Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login08",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login08Sample, id: "login-08-default" },
};
