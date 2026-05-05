import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { About } from "./About";

const meta: Meta<typeof About> = {
  title: "Pages/About/About01",
  component: About,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof About>;

export const Default: Story = {};
export const NoFooter: Story = { args: { footer: false } };
