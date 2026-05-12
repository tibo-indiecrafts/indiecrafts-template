import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricingComparator3Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/PricingComparator3",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricingComparator3Sample, id: "pricing-comparator-3-storybook" },
};
