import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricingComparator02Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/PricingComparator02",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricingComparator02Sample, id: "pricing-comparator-02-storybook" },
};
