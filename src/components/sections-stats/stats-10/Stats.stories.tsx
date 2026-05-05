import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSection from "./Stats";
import { stats10Sample } from "./config";

const meta: Meta<typeof StatsSection> = {
  title: "Sections/Stats/Stats10",
  component: StatsSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: { ...stats10Sample, id: "stats-10-default" },
};
