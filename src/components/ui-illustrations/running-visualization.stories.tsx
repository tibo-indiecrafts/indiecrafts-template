import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RunningVisualization } from "./running-visualization";

const meta: Meta<typeof RunningVisualization> = {
  title: "UI Illustrations/Running Visualization",
  component: RunningVisualization,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof RunningVisualization>;
export const Default: Story = {};
