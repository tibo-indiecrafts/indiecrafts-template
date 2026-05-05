import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoginSection from "./Login";
import { login02Sample } from "./config";

const meta: Meta<typeof LoginSection> = {
  title: "Sections/Auth/Login02",
  component: LoginSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof LoginSection>;

export const Default: Story = {
  args: { ...login02Sample, id: "login-02-default" },
};
