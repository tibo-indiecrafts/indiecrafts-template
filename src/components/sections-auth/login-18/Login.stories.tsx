import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login18Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login18",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login18Sample, id: "login-18-default" },
};
