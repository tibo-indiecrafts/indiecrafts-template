import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Signup } from "./Signup";

const meta: Meta<typeof Signup> = {
  title: "Pages/Signup/Signup01",
  component: Signup,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Signup>;

export const Default: Story = {};
export const WithSiteHeader: Story = { args: { header: true } };
