import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricing02Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/Pricing02",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricing02Sample, id: "pricing-02-storybook" },
};
