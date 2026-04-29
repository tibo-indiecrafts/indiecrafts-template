import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingComparatorSection } from "./index";
import { pricingComparatorSample } from "./config";

const meta: Meta<typeof PricingComparatorSection> = {
  title: "Sections/Marketing/Pricing/PricingComparator",
  component: PricingComparatorSection,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof PricingComparatorSection>;

export const Default: Story = {
  args: {
    ...pricingComparatorSample,
    id: "story-pricing-comparator",
  } as React.ComponentProps<typeof PricingComparatorSection>,
};
