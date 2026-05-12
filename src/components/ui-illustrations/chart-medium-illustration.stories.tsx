import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartMediumIllustration } from "./chart-medium-illustration";

const meta: Meta<typeof ChartMediumIllustration> = {
  title: "UI Illustrations/ChartMedium",
  component: ChartMediumIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChartMediumIllustration>;

export const Default: Story = {};
