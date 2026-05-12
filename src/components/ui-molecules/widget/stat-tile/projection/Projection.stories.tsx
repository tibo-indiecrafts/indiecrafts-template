import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Projection from "./Projection";
import { stats15Sample } from "./config";

const meta: Meta<typeof Projection> = {
  title: "UI Molecules/Widget/StatTile/Projection",
  component: Projection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Projection>;

export const Default: Story = {
  args: { ...stats15Sample, id: "stat-tile-projection-default" },
};
