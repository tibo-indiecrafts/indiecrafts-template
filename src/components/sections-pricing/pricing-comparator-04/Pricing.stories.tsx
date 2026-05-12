import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricingComparator04Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/PricingComparator04",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricingComparator04Sample, id: "pricing-comparator-04-storybook" },
};
