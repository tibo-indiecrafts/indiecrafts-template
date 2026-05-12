import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricing06Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/Pricing06",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricing06Sample, id: "pricing-06-storybook" },
};
