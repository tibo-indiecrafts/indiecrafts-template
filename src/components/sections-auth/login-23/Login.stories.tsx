import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login23Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login23",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login23Sample, id: "login-23-default" },
};
