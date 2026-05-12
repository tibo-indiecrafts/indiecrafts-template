import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricing05Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/Pricing05",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricing05Sample, id: "pricing-05-storybook" },
};
