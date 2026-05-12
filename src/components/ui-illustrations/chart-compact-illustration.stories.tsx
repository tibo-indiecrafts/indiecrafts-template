import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartCompactIllustration } from "./chart-compact-illustration";

const meta: Meta<typeof ChartCompactIllustration> = {
  title: "UI Illustrations/ChartCompact",
  component: ChartCompactIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChartCompactIllustration>;

export const Default: Story = {};
