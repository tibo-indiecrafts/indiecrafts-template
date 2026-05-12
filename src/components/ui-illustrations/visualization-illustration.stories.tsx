import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VisualizationIllustration } from "./visualization-illustration";

const meta: Meta<typeof VisualizationIllustration> = {
  title: "UI Illustrations/Visualization",
  component: VisualizationIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof VisualizationIllustration>;

export const Default: Story = {};
