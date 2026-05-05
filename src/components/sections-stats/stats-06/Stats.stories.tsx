import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSection from "./Stats";
import { stats06Sample } from "./config";

const meta: Meta<typeof StatsSection> = {
  title: "Sections/Stats/Stats06",
  component: StatsSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: { ...stats06Sample, id: "stats-06-default" },
};
