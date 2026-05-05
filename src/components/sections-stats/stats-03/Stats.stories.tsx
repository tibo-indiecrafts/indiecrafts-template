import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSection from "./Stats";
import { stats03Sample } from "./config";

const meta: Meta<typeof StatsSection> = {
  title: "Sections/Stats/Stats03",
  component: StatsSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: { ...stats03Sample, id: "stats-03-default" },
};
