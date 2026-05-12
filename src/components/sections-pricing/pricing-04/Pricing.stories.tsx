import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Pricing from "./Pricing";
import { pricing04Sample } from "./config";

const meta: Meta<typeof Pricing> = {
  title: "Sections/Pricing/Pricing04",
  component: Pricing,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Pricing>;

export const Default: Story = {
  args: { ...pricing04Sample, id: "pricing-04-storybook" },
};
