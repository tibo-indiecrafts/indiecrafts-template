import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartMiniIllustration } from "./chart-mini-illustration";

const meta: Meta<typeof ChartMiniIllustration> = {
  title: "UI Illustrations/ChartMini",
  component: ChartMiniIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChartMiniIllustration>;

export const Default: Story = {};
