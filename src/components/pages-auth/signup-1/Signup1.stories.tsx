import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Signup1 } from "./Signup1";

const meta: Meta<typeof Signup1> = {
  title: "Pages/Auth/Signup1",
  component: Signup1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Signup1>;

export const Default: Story = {};
export const WithSiteHeader: Story = { args: { header: true } };
