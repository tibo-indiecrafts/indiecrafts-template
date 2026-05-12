import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MonitoringBarchartIllustration } from "./monitoring-barchart-illustration";

const meta: Meta<typeof MonitoringBarchartIllustration> = {
  title: "UI Illustrations/MonitoringBarchart",
  component: MonitoringBarchartIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MonitoringBarchartIllustration>;

export const Default: Story = {};
