import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricing09Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/Pricing09",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricing09Sample, id: "pricing-09-storybook" },
};
