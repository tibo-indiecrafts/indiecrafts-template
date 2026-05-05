import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login03Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login03",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login03Sample, id: "login-03-default" },
};
