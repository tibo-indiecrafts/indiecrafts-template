import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { About1 } from "./About1";

const meta: Meta<typeof About1> = {
  title: "Pages/Marketing/About1",
  component: About1,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof About1>;

export const Default: Story = {};
export const NoFooter: Story = { args: { footer: false } };
