import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricingComparator03Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/PricingComparator03",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricingComparator03Sample, id: "pricing-comparator-03-storybook" },
};
