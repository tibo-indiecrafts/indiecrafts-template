import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login17Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login17",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login17Sample, id: "login-17-default" },
};
