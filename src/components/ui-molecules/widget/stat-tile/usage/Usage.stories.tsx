import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Usage from "./Usage";
import { stats09Sample } from "./config";

const meta: Meta<typeof Usage> = {
  title: "UI Molecules/Widget/StatTile/Usage",
  component: Usage,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Usage>;

export const Default: Story = {
  args: { ...stats09Sample, id: "stat-tile-usage-default" },
};
