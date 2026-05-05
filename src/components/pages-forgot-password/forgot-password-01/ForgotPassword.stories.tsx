import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ForgotPassword } from "./ForgotPassword";

const meta: Meta<typeof ForgotPassword> = {
  title: "Pages/ForgotPassword/ForgotPassword01",
  component: ForgotPassword,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPassword>;

export const Default: Story = {};
export const WithSiteHeader: Story = { args: { header: true } };
