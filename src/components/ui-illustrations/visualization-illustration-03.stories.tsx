import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VisualizationIllustration } from "./visualization-illustration-03";

const meta: Meta<typeof VisualizationIllustration> = {
  title: "UI Illustrations/Grid 1 Landing Visualization",
  component: VisualizationIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof VisualizationIllustration>;
export const Default: Story = {};
