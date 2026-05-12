import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login16Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login16",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login16Sample, id: "login-16-default" },
};
