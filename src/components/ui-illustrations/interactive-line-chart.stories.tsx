import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InteractiveLineChart } from "./interactive-line-chart";

const meta: Meta<typeof InteractiveLineChart> = {
  title: "UI Illustrations/InteractiveLineChart",
  component: InteractiveLineChart,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InteractiveLineChart>;

export const Default: Story = {};
