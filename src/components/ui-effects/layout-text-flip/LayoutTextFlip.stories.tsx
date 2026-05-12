import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LayoutTextFlip } from "./index";

const meta: Meta<typeof LayoutTextFlip> = {
  title: "UI Effects/Text/LayoutTextFlip",
  component: LayoutTextFlip,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof LayoutTextFlip>;

export const Default: Story = {};

export const Fast: Story = {
  args: { duration: 1000 },
};

export const Slow: Story = {
  args: { duration: 8000 },
};
