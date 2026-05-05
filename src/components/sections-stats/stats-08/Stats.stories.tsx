import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSection from "./Stats";
import { stats08Sample } from "./config";

const meta: Meta<typeof StatsSection> = {
  title: "Sections/Stats/Stats08",
  component: StatsSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: { ...stats08Sample, id: "stats-08-default" },
};
