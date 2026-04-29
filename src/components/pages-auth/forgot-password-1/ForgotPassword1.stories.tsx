import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ForgotPassword1 } from "./ForgotPassword1";

const meta: Meta<typeof ForgotPassword1> = {
  title: "Pages/Auth/ForgotPassword1",
  component: ForgotPassword1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof ForgotPassword1>;

export const Default: Story = {};
export const WithSiteHeader: Story = { args: { header: true } };
