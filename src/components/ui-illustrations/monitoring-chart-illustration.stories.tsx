import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonitoringChartIllustration } from "./monitoring-chart-illustration";

const meta: Meta<typeof MonitoringChartIllustration> = {
  title: "UI Illustrations/MonitoringChartIllustration",
  component: MonitoringChartIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MonitoringChartIllustration>;

export const Default: Story = {};
