import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login11Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login11",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login11Sample, id: "login-11-default" },
};
