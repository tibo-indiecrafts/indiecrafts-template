import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login06Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login06",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login06Sample, id: "login-06-default" },
};
