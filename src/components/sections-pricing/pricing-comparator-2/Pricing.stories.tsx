import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricingComparator2Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/PricingComparator2",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricingComparator2Sample, id: "pricing-comparator-2-storybook" },
};
