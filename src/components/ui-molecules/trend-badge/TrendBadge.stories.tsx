import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TrendBadge } from "./TrendBadge";

const meta: Meta<typeof TrendBadge> = {
  title: "UI Molecules/TrendBadge",
  component: TrendBadge,
};
export default meta;

type Story = StoryObj<typeof TrendBadge>;

export const Up: Story = {
  args: { direction: "up", delta: "+12%" },
};

export const Down: Story = {
  args: { direction: "down", delta: "-3.4%" },
};
