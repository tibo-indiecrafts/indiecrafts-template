import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GanttChartIllustration } from "./gantt-chart-illustration";

const meta: Meta<typeof GanttChartIllustration> = {
  title: "UI Illustrations/GanttChartIllustration",
  component: GanttChartIllustration,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof GanttChartIllustration>;

export const Default: Story = {};
