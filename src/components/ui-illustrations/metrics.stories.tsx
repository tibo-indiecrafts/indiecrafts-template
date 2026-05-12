import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MetricsIllustration } from "./metrics";

const meta: Meta<typeof MetricsIllustration> = {
  title: "UI Illustrations/Metrics",
  component: MetricsIllustration,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MetricsIllustration>;
export const Default: Story = {};
