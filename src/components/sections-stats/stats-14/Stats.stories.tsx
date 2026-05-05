import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSection from "./Stats";
import { stats14Sample } from "./config";

const meta: Meta<typeof StatsSection> = {
  title: "Sections/Stats/Stats14",
  component: StatsSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {
  args: { ...stats14Sample, id: "stats-14-default" },
};
