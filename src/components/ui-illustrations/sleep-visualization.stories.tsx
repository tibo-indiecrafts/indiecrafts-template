import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SleepVisualization } from "./sleep-visualization";

const meta: Meta<typeof SleepVisualization> = {
  title: "UI Illustrations/Sleep Visualization",
  component: SleepVisualization,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SleepVisualization>;
export const Default: Story = {};
