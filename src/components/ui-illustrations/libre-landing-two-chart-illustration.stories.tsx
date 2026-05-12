import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChartIllustration } from "./libre-landing-two-chart-illustration";

const meta: Meta<typeof ChartIllustration> = {
  title: "UI Illustrations/Libre Landing Two Chart",
  component: ChartIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof ChartIllustration>;
export const Default: Story = {};
